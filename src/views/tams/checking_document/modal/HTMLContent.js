import React, { useEffect } from 'react'
import mqtt from 'mqtt'
import { Content } from 'antd/es/layout/layout'

const HTMLContent = ({ htmlResult, orders, indexs }) => {
    useEffect(() => {
        const clientID = `clientID-${parseInt(Math.random() * 1000)}`
        const client = mqtt.connect('ws://broker.emqx.io:8083/mqtt', { clientId: clientID })

        client.on('connect', () => {
            console.log('Connected to MQTT broker')
            client.subscribe('tams') // Subscribe to the 'tams' topic
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
                publishMessage('clickedSentence', sentenceId)
                console.log(`Published ID: ${sentenceId}, Index: ${indexId}, Sentence: ${idSentence}`)
            }
        }

        document.addEventListener('click', handleClick)

        return () => {
            document.removeEventListener('click', handleClick)
            client.end() // Disconnect the MQTT client on component unmount
        }
    }, [])

    const processContent = (htmlContent, highlightIndexes) => {
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
                            span.style.backgroundColor = 'yellow'
                            span.style.cursor = 'pointer' // Add cursor pointer for highlighted sentences
                            span.dataset.sentenceId = sentenceCounter // Set data-sentence-id attribute
                            span.dataset.indexId = orders.indexOf(sentenceCounter)
                            span.dataset.idSentence = indexs[orders.indexOf(sentenceCounter)]
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

    return <Content dangerouslySetInnerHTML={{ __html: processContent(htmlResult, orders) }} />
}

export default HTMLContent
