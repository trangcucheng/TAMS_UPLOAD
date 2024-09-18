import React, { useEffect, useState } from 'react'
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    RightOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons'
import mqtt from 'mqtt'
import { Breadcrumb, Layout, Menu, theme, Row, Col, Card, Badge, Tag, Progress, Spin } from 'antd'
import { useLocation, useParams } from 'react-router-dom'
import { getCheckingResultHTML, getCheckingResultHTML2, getSimilarDocument } from '../../../api/checking_result'
import { getListDocFromSetenceId } from '../../../api/checking_sentence'
import './hightlight.css'
import { X } from 'react-feather'
import styled from 'styled-components'
import ContentModalFromHTML from './modal/ContentModal2'
// import HTMLContent from './modal/HTMLContent'
const { Header, Content, Footer, Sider } = Layout
const DetailResult2 = () => {
    const location = useLocation()
    const params = useParams()
    const [loadingData, setLoadingData] = useState(false)
    const [dataDoc, setDataDoc] = useState([])
    const [count, setCount] = useState(0)
    const [htmlResult, setHTMLResult] = useState()
    const [listDocument, setListDocument] = useState([])
    const [sentence, setSentence] = useState('')
    const [listSentence, setListSentence] = useState([])
    const [highlightIndexs, setHighlightIndex] = useState([])
    const [docFromId, setDocFromId] = useState()
    const [loadingHTML, setLoadingHTML] = useState(false)
    const [loadingDataDoc, setLoadingDataDoc] = useState(false)
    const [modalContent, setModalContent] = useState(false)
    const [selectedDocId, setSelectedDocId] = useState()

    const getData = () => {
        setLoadingHTML(true)
        getCheckingResultHTML2({
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

    const getDocHasTheSameSentence = () => {
        setLoadingDataDoc(true)
        getSimilarDocument(Number(params?.id)).then(res => {
            setDataDoc(res?.data)
            setCount(res?.total)
        }).catch(error => {
            console.log(error)
        }).finally(() => {
            setLoadingDataDoc(false)
        })
    }

    useEffect(() => {
        getData()
        getDocHasTheSameSentence()
    }, [])

    useEffect(() => {
        getDetailData()
    }, [docFromId])

    // useEffect(() => {
    //     const clientID = `clientID-${parseInt(Math.random() * 1000)}`
    //     const client = mqtt.connect('ws://broker.emqx.io:8083/mqtt', { clientId: clientID })

    //     client.on('connect', () => {
    //         console.log('Connected to MQTT broker')
    //         client.subscribe('tams')
    //     })

    //     client.on('message', (topic, message) => {
    //         console.log(`OnMessageArrived: ${message.toString()}`)
    //     })

    //     client.on('disconnect', () => {
    //         console.log('Disconnected from MQTT broker')
    //     })

    //     const publishMessage = (topic, message) => {
    //         client.publish(topic, message)
    //         console.log(`Message sent to topic ${topic}: ${message}`)
    //     }

    //     const handleClick = (event) => {
    //         const target = event.target
    //         if (target && target.dataset.sentenceId && target.dataset.indexId && target.dataset.idSentence) {
    //             const sentenceId = target.dataset.sentenceId
    //             const indexId = target.dataset.indexId
    //             const idSentence = target.dataset.idSentence
    //             setDocFromId(idSentence)
    //             publishMessage('clickedSentence', sentenceId)
    //             console.log(`Published ID: ${sentenceId}, Index: ${indexId}, Sentence: ${idSentence}`)
    //         }
    //     }

    //     document.addEventListener('click', handleClick)

    //     return () => {
    //         document.removeEventListener('click', handleClick)
    //         client.end()
    //     }
    // }, [])

    // const processHTML = (htmlString) => {
    //     const parser = new DOMParser()
    //     const doc = parser.parseFromString(htmlString, 'text/html')

    //     const spans = doc.querySelectorAll('span.tooltip.highlight-0')
    //     spans.forEach(span => {
    //         // Tách các class thành mảng
    //         const classes = span.className.split(' ')

    //         // Loại bỏ class "tooltip"
    //         const filteredClasses = classes.filter(className => className !== 'tooltip')

    //         // Thay thế class "highlight-0" bằng "highlight-1"
    //         const newClasses = filteredClasses.map(className => {
    //             return className === 'highlight-0' ? 'highlight-1' : className
    //         })

    //         // Gán lại className đã được thay đổi
    //         span.className = newClasses.join(' ')
    //     })

    //     return doc.body.innerHTML
    // }

    const CustomStyle = styled.div`
        .tooltip {
            opacity: 1 !important /* Bỏ opacity: 0 */
        }
        .tooltiptext {
            color: #000 !important
        }
    `
    const dataTest = [
        {
            document: {
                author: "Nguyễn Văn A",
                title: "Test 1"
            }
        },
        {
            document: {
                author: "Nguyễn Văn A",
                title: "Test 1"
            }
        },
        {
            document: {
                author: "Nguyễn Văn A",
                title: "Test 1"
            }
        },
        {
            document: {
                author: "Nguyễn Văn A",
                title: "Test 1"
            }
        },
        {
            document: {
                author: "Nguyễn Văn A",
                title: "Test 1"
            }
        },
        {
            document: {
                author: "Nguyễn Văn A",
                title: "Test 1"
            }
        }
    ]

    const handleGetSentences = (docId) => {
        setModalContent(true)
        setSelectedDocId(docId)
    }

    const handleModal = () => {
        setModalContent(false)
    }

    return (
        <div style={{height: '100vh', overflow: 'hidden'}}>
            <Row gutter={16} style={{ padding: '16px 16px 0 16px' }}>
                <Col md={18} style={{ display: 'flex', alignItems: 'center', padding: 0, borderBottom: '4px solid #357BBD' }}>
                    <Row style={{ flex: 1 }}>
                        <Col md={12}>
                            <h4 style={{ textTransform: 'uppercase', marginBottom: 0, color: '#1C5385' }}>Kiểm tra chi tiết</h4>
                        </Col>
                        <Col md={12}>
                            <h4 style={{ marginBottom: 0, color: 'red' }}>{location.state.fileName}</h4>
                        </Col>
                    </Row>
                </Col>
                <Col md={6}>

                </Col>
            </Row>            <Row gutter={16}>
                {
                    loadingHTML === true ? <Spin style={{
                        padding: '16px'
                    }} /> : (
                        <Col md={18} style={{ height: '100vh', overflow: 'auto' }}>
                            <Row gutter={16} style={{ padding: '16px', width: '100%', overflow: 'auto' }}>
                                {/* <h4>
                                    {location?.state?.fileName}
                                </h4> */}
                                {/* <HTMLContent htmlResult={htmlResult} orders={listSentence} indexs={highlightIndexs} /> */}
                                <CustomStyle>
                                    <Content dangerouslySetInnerHTML={{ __html: (htmlResult) }} />
                                </CustomStyle>
                            </Row>
                        </Col>
                    )
                }
                {
                    dataDoc && loadingDataDoc === true ? <Spin style={{
                        padding: '16px'
                    }} /> : (
                        <Col md={6} style={{ position: 'fixed', right: 0, width: '100%', height: '100%' }}>
                            <Row className='p-1' style={{ justifyContent: 'center', backgroundColor: '#09A863', color: '#fff', fontWeight: '600' }}>
                                <Col md={24} style={{ textAlign: 'center' }}><h6 style={{ textTransform: 'uppercase', color: '#fff', marginBottom: 0 }}>Kết quả trùng lặp</h6></Col>
                                {/* <Col md={2}><X color='#fff' /></Col> */}
                            </Row>
                            <Row style={{ justifyContent: 'center', fontSize: '24px', color: 'red', fontWeight: '600' }}>
                                {location?.state?.checkingResult?.find(item => item.typeCheckingId === 1)?.similarityTotal}%
                            </Row>
                            <Row className='p-1' style={{ border: '1px solid #ccc', height: '85vh', overflow: 'auto' }} >
                                {
                                    dataDoc?.map((doc, index) => {
                                        // const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '8B00FF']
                                        const colors = ['rgba(255, 51, 51, 0.4)', 'rgba(255, 153, 0, 0.4)', '#FF99FF', '#66CC99', 'rgba(102, 153, 255, 0.4)', 'rgba(102, 0, 204, 0.4)', 'rgba(0, 136, 0, 0.4)']
                                        const colorIndex = index % 7
                                        return (
                                            <Row style={{ width: "100%", border: "0.5px solid #ccc", display: "flex", padding: "0.4rem" }}>
                                                <Col className='p-0' md={2} style={{
                                                    color: `${colors[colorIndex]}`
                                                }}>
                                                    <h2 style={{ textAlign: "center", marginRight: "0.3rem", color: `${colors[colorIndex]}` }}>{index + 1}</h2>
                                                </Col>
                                                <Col className='p-0' md={17}>
                                                    <h4 style={{
                                                        color: `${colors[colorIndex]}`,
                                                        paddingBottom: "0"
                                                    }}>{doc?.document?.title}</h4>
                                                    <span>{doc?.document?.author}</span>
                                                </Col>
                                                <Col className='p-0' md={4}>
                                                    <span style={{ fontWeight: "bold" }}>{doc?.similarity}%</span>
                                                </Col>
                                                <Col className='p-0' md={1} style={{ justifySelf: 'right' }}>
                                                    <RightOutlined style={{ cursor: 'pointer' }} onClick={() => handleGetSentences(doc?.documentId)} />
                                                </Col>
                                            </Row>
                                        )
                                    })
                                }
                            </Row>
                        </Col>
                    )
                }
            </Row>
            <ContentModalFromHTML open={modalContent} docId={selectedDocId} handleModal={handleModal} />
        </div>
    )
}
export default DetailResult2