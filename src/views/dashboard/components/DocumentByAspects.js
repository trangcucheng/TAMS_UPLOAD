import React, { useEffect, useState } from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Row, Card, CardHeader, CardTitle, CardBody, CardSubtitle, Badge } from 'reactstrap'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { getDocumentStatisticByMajor } from '../../../api/document_statistic'

// Đăng ký các thành phần cho biểu đồ
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels)

const DocumentByAspects = ({ colors }) => {
    const [data, setData] = useState([])
    const [total, setTotal] = useState()
    const [dataChart, setDataChart] = useState({
        labels: [],
        datasets: [],
    })
    useEffect(() => {
        getDocumentStatisticByMajor().then(res => {
            setData(res.data)
        }).catch(err => console.log(err))
    }, [])

    const totalCount = data.reduce((sum, item) => sum + parseInt(item.count, 10), 0)

    // // Hàm tạo màu ngẫu nhiên
    // const generateRandomColor = () => {
    //     const r = Math.floor(Math.random() * 256)
    //     const g = Math.floor(Math.random() * 256)
    //     const b = Math.floor(Math.random() * 256)
    //     return `rgb(${r}, ${g}, ${b})`
    // }

    // Màu viền cố định
    const borderColorFixed = 'rgba(255, 255, 255, 1)'

    // // Tạo mảng màu nền cho từng phần tử trong data
    // const colors = data.map(() => generateRandomColor())

    const data1 = {
        labels: data.map(item => item.name),
        datasets: [
            {
                label: '# tài liệu',
                data: data.map(item => item.count),  // Dữ liệu của các phần trong biểu đồ
                backgroundColor: colors,
                borderColor: Array(data.length).fill(borderColorFixed),
                borderWidth: 1,
            },
        ],
    }


    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom', // Vị trí của chú thích
            },
            tooltip: {
                enabled: true, // Hiển thị tooltip khi hover
            },
            datalabels: {
                color: 'white', // Màu của số liệu
                formatter: (value, ctx) => {
                    let sum = 0
                    const dataArr = ctx.dataset?.data
                    dataArr.forEach(data => {
                        sum += Number(data)
                    })
                    const percentage = `${(value * 100 / sum).toFixed(2)}%`
                    return percentage // Hiển thị phần trăm
                },
                font: {
                    weight: 'bold',
                    size: 10,
                },
            },
        },
    }

    return (
        <Card>
            <CardHeader className='d-flex flex-sm-row flex-column justify-content-md-between align-items-start justify-content-start'>
                <div>
                    <CardTitle className='mb-75' tag='h4'>
                        Tổng số tài liệu mẫu: {totalCount}. Theo lĩnh vực:
                    </CardTitle>
                </div>
            </CardHeader>
            <CardBody style={{ width: '400px', height: '400px', margin: 'auto' }}>
                <Pie data={data1} options={options} />
            </CardBody>
        </Card>
    )
}

export default DocumentByAspects
