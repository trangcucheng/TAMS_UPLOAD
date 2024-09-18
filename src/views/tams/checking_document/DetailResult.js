import React, { useEffect, useState } from 'react'
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons'
import mqtt from 'mqtt'
import { Breadcrumb, Layout, Menu, theme, Row, Col, Card, Badge, Tag, Progress, Spin } from 'antd'
import { useLocation } from 'react-router-dom'
import { getCheckingResultHTML, getListTheSameSentence } from '../../../api/checking_result'
import { getListDocFromSetenceId } from '../../../api/checking_sentence'
// import HTMLContent from './modal/HTMLContent'
const { Header, Content, Footer, Sider } = Layout

const DetailResult = () => {
    const location = useLocation()

    const [htmlResult, setHTMLResult] = useState()
    const [listDocument, setListDocument] = useState([])
    const [sentence, setSentence] = useState('')
    const [listSentence, setListSentence] = useState([])
    const [highlightIndexs, setHighlightIndex] = useState([])
    const [docFromId, setDocFromId] = useState()
    const [loadingHTML, setLoadingHTML] = useState(false)

    const getData = () => {
        setLoadingHTML(true)
        getCheckingResultHTML({
            params: {
                id: location?.state?.id,
                type: 1
            }
        }).then(result => {
            setHTMLResult(result)
        }).catch(error => {
            console.log(error)
        }).finally(() => {
            setLoadingHTML(false)
        })
    }

    const getDetailData = () => {
        if (docFromId) {
            getListDocFromSetenceId(docFromId).then(result => {
                setListDocument(result?.data?.documents)
                setSentence(result.data[0]?.sentences?.content)
            })
        }
    }

    // const getSentence = () => {
    //     getListTheSameSentence({
    //         params: {
    //             id: location?.state?.id,
    //             type: 1,
    //             // idCheckDoc: 1
    //         }
    //     }).then(result => {
    //         const sentences = result?.data?.map(item => item?.checkingDocumentSentence?.order)
    //         const indexs = result?.data?.map(item => item?.checkingDocumentSentence?.id)
    //         setListSentence(sentences)
    //         setHighlightIndex(indexs)
    //     })
    // }

    useEffect(() => {
        getData()
        // getSentence()
    }, [])

    useEffect(() => {
        getDetailData()
    }, [docFromId])

    useEffect(() => {
        const clientID = `clientID-${parseInt(Math.random() * 1000)}`
        const client = mqtt.connect('ws://broker.emqx.io:8083/mqtt', { clientId: clientID })

        client.on('connect', () => {
            console.log('Connected to MQTT broker')
            client.subscribe('tams')
        })

        client.on('message', (topic, message) => {
            console.log(`OnMessageArrived: ${message.toString()}`)
        })

        client.on('disconnect', () => {
            console.log('Disconnected from MQTT broker')
        })

        const publishMessage = (topic, message) => {
            client.publish(topic, message)
            console.log(`Message sent to topic ${topic}: ${message}`)
        }

        const handleClick = (event) => {
            const target = event.target
            if (target && target.dataset.sentenceId && target.dataset.indexId && target.dataset.idSentence) {
                const sentenceId = target.dataset.sentenceId
                const indexId = target.dataset.indexId
                const idSentence = target.dataset.idSentence
                setDocFromId(idSentence)
                publishMessage('clickedSentence', sentenceId)
                console.log(`Published ID: ${sentenceId}, Index: ${indexId}, Sentence: ${idSentence}`)
            }
        }

        document.addEventListener('click', handleClick)

        return () => {
            document.removeEventListener('click', handleClick)
            client.end()
        }
    }, [])

    const processContent = (htmlContent, highlightIndexes) => {
        const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '8B00FF']
        const parser = new DOMParser()
        const doc = parser.parseFromString(htmlContent, 'text/html')
        let sentenceCounter = 0

        const walk = (node) => {
            node.childNodes.forEach((child) => {
                if (child.nodeType === Node.TEXT_NODE) {
                    const sentences = child.textContent.split(/(?<=[.!?])\s+/)

                    const fragments = sentences.map((sentence) => {
                        if (sentence.length < 30) return document.createTextNode(sentence)

                        sentenceCounter += 1
                        const span = document.createElement('span')

                        const isHighlighted = highlightIndexes.includes(sentenceCounter)

                        if (isHighlighted) {
                            const colorIndex = listSentence.indexOf(sentenceCounter) % 7
                            span.style.backgroundColor = colors[colorIndex]
                            span.style.cursor = 'pointer'
                            span.style.color = '#fff'
                            span.dataset.sentenceId = sentenceCounter
                            span.dataset.indexId = listSentence.indexOf(sentenceCounter)
                            span.dataset.idSentence = highlightIndexs[listSentence.indexOf(sentenceCounter)]
                        }

                        span.textContent = sentence
                        return span
                    })

                    fragments.forEach((fragment) => {
                        child.parentNode.insertBefore(fragment, child)
                    })

                    child.remove()
                } else if (child.nodeType === Node.ELEMENT_NODE) {
                    walk(child)
                }
            })
        }

        walk(doc.body)
        return doc.body.innerHTML
    }

    return (
        <Row gutter={16}>
            {
                loadingHTML === true ? <Spin style={{
                    padding: '16px'
                }} /> : (
                    <Col md={12}>
                        <Row gutter={16} style={{ padding: '16px', backgroundColor: '#00A5E9' }}>
                            <Col md={8} style={{ color: '#fff' }}>
                                Tổng số câu
                            </Col>
                            <Col md={8} style={{ color: '#fff' }}>
                                Tổng số từ
                            </Col>
                            <Col md={8} style={{ color: '#fff' }}>
                                Tổng số ký tự
                            </Col>
                        </Row>
                        <Row gutter={16} style={{ padding: '16px', width: '100%', overflow: 'auto' }}>
                            <h4>
                                {location?.state?.fileName}
                            </h4>
                            {/* <HTMLContent htmlResult={htmlResult} orders={listSentence} indexs={highlightIndexs} /> */}
                            <Content dangerouslySetInnerHTML={{ __html: processContent(htmlResult, listSentence) }} />
                        </Row>
                    </Col>
                )
            }
            {
                docFromId && (
                    <Col md={12}>
                        <Row className='p-1 gap-1' style={{ justifyContent: 'center' }}>
                            <Progress type="circle" strokeColor='yellow' strokeWidth={15} percent={75} format={(percent) => <div style={{ display: 'flex', justifyContent: 'center' }} ><span style={{ fontSize: '20px', whiteSpace: 'break-spaces', fontWeight: '600', flex: '0 0 60%' }}>{`${percent}% trùng lặp`}</span></div>} size={150} />
                            <Progress type="circle" strokeColor='green' strokeWidth={15} percent={70} format={(percent) => <div style={{ display: 'flex', justifyContent: 'center' }} ><span style={{ fontSize: '20px', whiteSpace: 'break-spaces', fontWeight: '600', flex: '0 0 40%' }}>{`${percent}% mới`}</span></div>} size={150} />
                        </Row>
                        <Row className='gap-1 p-1' style={{ border: '1px solid #ccc', borderRadius: '4px' }} >
                            {
                                listDocument?.map(item => {
                                    return (
                                        <Card className='card-doc' style={{ width: '100%' }}>
                                            <Row className='p-1 flex-column'>
                                                <h4>{item?.fileName}</h4>
                                                <div>
                                                    <Tag color='#9999FF'>Tác giả: {item?.author}</Tag>
                                                    <Tag color='#9999FF'>Loại: {item?.typeId}</Tag>
                                                    <Tag color='#9999FF'>Chuyên ngành: {item?.majorId}</Tag>
                                                    <Tag color='#9999FF'>Năm xuất bản: {item?.publish_date}</Tag>
                                                </div>
                                            </Row>
                                            <Row className='p-1' style={{ backgroundColor: '#FBF6EC', marginBottom: '8px' }}>
                                                <p>{sentence}</p>
                                            </Row>
                                        </Card>
                                    )
                                })
                            }
                        </Row>
                    </Col>
                )
            }
        </Row>
    )
}
export default DetailResult