import React, { useState, useEffect } from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Card, CardHeader, CardTitle, CardBody, CardSubtitle, Badge } from 'reactstrap'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { statisticByType } from '../../../api/document'

// Đăng ký các thành phần cho biểu đồ
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels)
const getRandomColor = () => {
    const r = Math.floor(Math.random() * 255)
    const g = Math.floor(Math.random() * 255)
    const b = Math.floor(Math.random() * 255)
    return `rgb(${r}, ${g}, ${b})`
}

const colorMap = {}

const getColorForLabel = (label) => {
    if (!colorMap[label]) {
        // Nếu nhãn chưa có màu, tạo màu ngẫu nhiên và lưu lại
        colorMap[label] = getRandomColor()
    }
    // Trả về màu đã lưu cho nhãn
    return colorMap[label]
}

const getTotalDocuments = (data) => {
    return data.reduce((total, item) => total + parseInt(item.count), 0)
}

// Sử dụng hàm tính tổng
const DocumentByCategories = ({ colorForLabel, colors }) => {
    const [total, setTotal] = useState()
    const [dataChart, setDataChart] = useState({
        labels: [],
        datasets: [],
    })

    const convertDataForChart = (apiData) => {
        return {
            labels: apiData.map(item => item.name),  // Lấy tên các phần (labels)
            datasets: [
                {
                    label: '# tài liệu',
                    data: apiData.map(item => parseInt(item.count)),  // Chuyển đổi count thành số nguyên
                    // backgroundColor: apiData.map((item) => colorForLabel(item.name)),  // Tạo màu ngẫu nhiên cho mỗi phần
                    backgroundColor: colors,  // Tạo màu ngẫu nhiên cho mỗi phần
                    borderColor: apiData.map(() => 'rgba(255, 255, 255, 1)'),  // Màu viền luôn là màu trắng
                    borderWidth: 1,
                },
            ],
        }
    }
    const data = {
        labels: ['Luận văn', 'Luận án'],
        datasets: [
            {
                label: '# tài liệu',
                data: [100, 90],  // Dữ liệu của các phần trong biểu đồ
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                ],
                borderColor: [
                    'rgba(255, 255, 255, 1)',
                    'rgba(255, 255, 255, 1)',
                ],
                borderWidth: 1,
            },
        ],
    }
    useEffect(() => {
        statisticByType().then((res) => {
            const apiData = res?.data ?? []
            const data_ = convertDataForChart(apiData)
            setDataChart(data_)
            const totalDocuments = getTotalDocuments(apiData)
            setTotal(totalDocuments)
        }).catch((err) => {
            console.log("Error fetching data", err)
        })
    }, [])
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
                    const dataArr = ctx.chart.data.datasets[0].data
                    dataArr.forEach(data => {
                        sum += data
                    })
                    const percentage = `${(value * 100 / sum).toFixed(2)}%`
                    return percentage // Hiển thị phần trăm
                },
                font: {
                    weight: 'bold',
                    size: 14,
                },
            },
        },
    }
    return (
        <Card>
            <CardHeader className='d-flex flex-sm-row flex-column justify-content-md-between align-items-start justify-content-start'>
                <div>
                    <CardTitle className='mb-75' tag='h4'>
                        Tổng số tài liệu mẫu: {total ?? 0}. Theo loại tài liệu:
                    </CardTitle>
                </div>
            </CardHeader>
            <CardBody style={{ width: '400px', height: '400px', margin: 'auto' }}>
                <Pie data={dataChart} options={options} />
            </CardBody>
        </Card>
    )
}

export default DocumentByCategories
