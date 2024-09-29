import React, { useEffect, useState } from 'react'
import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    LineController,
    BarController,
} from 'chart.js'
import { Chart } from 'react-chartjs-2'
import {
    Row,
    Col,
    Card,
    Button,
    CardBody,
    CardText,
    Progress,
    DropdownMenu,
    DropdownItem,
    DropdownToggle,
    UncontrolledDropdown,
    CardTitle,
    CardHeader
} from 'reactstrap'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { DatePicker } from "antd"
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)
ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    LineController,
    BarController,
    ChartDataLabels
)

import { statisticByTime } from '../../../api/document'
const fakeData = [
    {
        count1: 10,
        count2: 8,
        month: "Tháng 1",
        backgroundColor: "rgba(245,34,45,0.8)"
    },
    {
        count1: 12,
        count2: 10,
        month: "Tháng 2",
        backgroundColor: "rgba(245,34,45,0.8)"
    },
    {
        count1: 8,
        count2: 10,
        month: "Tháng 3",
        backgroundColor: "rgba(245,34,45,0.8)"
    },
    {
        count1: 4,
        count2: 10,
        month: "Tháng 4",
        backgroundColor: "rgba(245,34,45,0.8)"
    },
    {
        count1: 7,
        count2: 9,
        month: "Tháng 5",
        backgroundColor: "rgba(245,34,45,0.8)"
    },
    {
        count1: 8,
        count2: 6,
        month: "Tháng 6",
        backgroundColor: "rgba(245,34,45,0.8)"
    },
    {
        count1: 10,
        count2: 6,
        month: "Tháng 7",
        backgroundColor: "rgba(245,34,45,0.8)"
    },
    {
        count1: 9,
        count2: 12,
        month: "Tháng 8",
        backgroundColor: "rgba(245,34,45,0.8)"
    },
    {
        count1: 5,
        count2: 7,
        month: "Tháng 9",
        backgroundColor: "rgba(245,34,45,0.8)"
    },
    {
        count1: 5,
        count2: 12,
        month: "Tháng 10",
        backgroundColor: "rgba(245,34,45,0.8)"
    },
    {
        count1: 4,
        count2: 6,
        month: "Tháng 11",
        backgroundColor: "rgba(245,34,45,0.8)"
    },
    {
        count1: 2,
        month: "Tháng 12",
        backgroundColor: "rgba(245,34,45,0.8)"
    }
]
const getRandomColor = () => {
    const r = Math.floor(Math.random() * 255)
    const g = Math.floor(Math.random() * 255)
    const b = Math.floor(Math.random() * 255)
    return `rgba(${r},${g},${b},0.8)`
}
export default function DocumentByTime({ colorForLabel, colors }) {
    const currentYear = new Date().getFullYear()
    const [filter, setFilter] = useState({
        startDate: dayjs(`${currentYear}-01-01`),
        endDate: dayjs(`${currentYear}-12-31`)
    })
    const [dataChart, setDataChart] = useState({
        labels: [],
        datasets: []
    })
    const title = "Tổng số tài liệu mẫu bổ sung vào hệ thống theo thời gian"
    const labelData = fakeData?.map(item => item.month)
    const data = fakeData?.map(item => item.count)
    // data format
    const dataChart_ = {
        labels: labelData,
        datasets: [
            {
                label: "Luận văn",
                data: fakeData?.map(item => item.count1),
                backgroundColor: "rgba(245,34,45,0.8)"
            },
            {
                label: "Luận án",
                data: fakeData?.map(item => item.count2),
                backgroundColor: "rgba(34,150,245,1)"
            }
        ]
    }
    const options = {
        responsive: true,
        maintainAspectRatio: true,
        // maintainAspectRatio: true,
        aspectRatio: 2, // Tỷ
        scales: {
            y: {
                min: 0, // Giá trị tối thiểu của trục y
                // max: 20, // Giá trị tối đa của trục y
                ticks: {
                    beginAtZero: true, // Bắt đầu từ 0
                },
            },
        },
        legend: {
            display: true,
            position: 'bottom',
        },
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
            },
            // Thêm datalabels plugin để hiển thị nhãn dữ liệu
            datalabels: {
                anchor: 'end',  // Đặt vị trí nhãn dữ liệu ở cuối cột
                align: 'end',   // Căn chỉnh nhãn dữ liệu
                formatter: (value) => value, // Định dạng hiển thị của nhãn (ở đây là giá trị trực tiếp)
                color: '#000',  // Màu của nhãn dữ liệu
            }
        }
    }
    useEffect(() => {
        statisticByTime({
            params: {
                startDate: dayjs(filter?.startDate).format('YYYY-MM-DD'),
                endDate: dayjs(filter?.endDate).format('YYYY-MM-DD')
            }
        }).then((res) => {
            const apiData = res?.data ?? []
            // const apiData = apiData_.sort((a, b) => a.id - b.id)

            // Lấy tất cả các loại tài liệu (không trùng lặp)
            const allMajors = []
            const seenMajors = {}

            // Lưu trữ các tên vào mảng và theo dõi sự duy nhất
            apiData?.forEach(item => {
                item?.major?.forEach(majorItem => {
                    // Chỉ thêm nếu tên chưa được thấy
                    if (!seenMajors[majorItem.name]) {
                        seenMajors[majorItem.name] = true
                        allMajors.push({
                            name: majorItem.name,
                            id: majorItem.id
                        })
                    }
                })
            })

            // Sắp xếp mảng sao cho phần tử có id = 1 luôn nằm ở cuối
            const sortedMajors = allMajors.sort((a, b) => {
                if (a.id === 1) return 1 // Đẩy phần tử có id = 1 xuống cuối
                if (b.id === 1) return -1  // Đẩy phần tử có id = 1 xuống cuối
                return 0                // Giữ nguyên thứ tự của các phần tử còn lại
            }).map(item => item.name)

            console.log(sortedMajors)


            // Tạo mảng `datasets` động
            const datasets_ = sortedMajors?.map((majorName, index) => {
                return {
                    label: majorName,
                    data: apiData?.map(item => {
                        const major = item?.major?.find(majorItem => majorItem.name === majorName)
                        return major ? parseInt(major.count, 10) : 0 // Nếu không tìm thấy, trả về 0
                    }),
                    // backgroundColor: colorForLabel(majorName) // Gán màu ngẫu nhiên
                    backgroundColor: colors[index % colors.length] // Gán màu ngẫu nhiên
                }
            })

            // Tạo mảng `labels` cho các tháng
            const labelData = apiData?.map(item => `Tháng ${item.month}/${item.year}`)

            // Tạo cấu trúc biểu đồ cuối cùng
            const dataChart_ = {
                labels: labelData,
                datasets: datasets_
            }
            setDataChart(dataChart_)
        }).catch((err) => {
            console.log("Error fetching data", err)
        })
    }, [filter])
    const handleChangeDates = (dates) => {
        if (dates) {
            setFilter({
                startDate: dayjs(dates[0], 'YYYY-MM-DD'),
                endDate: dayjs(dates[1], 'YYYY-MM-DD')
            })
        } else {
            setFilter({
                startDate: dayjs(`${currentYear}-01-01`),
                endDate: dayjs(`${currentYear}-12-31`)
            })
        }
    }
    return (
        <Card style={{ position: "relative", width: "100%" }}>
            <CardHeader className='d-flex flex-sm-row flex-column justify-content-md-between align-items-start justify-content-start'>
                <div>
                    <CardTitle className='mb-75' tag='h4'>
                        {title}
                    </CardTitle>
                </div>
            </CardHeader>
            <CardBody>
                <div className="d-flex col col-4" style={{ justifyContent: "flex-start", marginRight: "1rem", alignItems: "center" }}>
                    <span style={{ marginRight: "1rem" }}>Thời gian</span>
                    <DatePicker.RangePicker
                        style={{
                            width: "70%",
                        }}
                        // value={[dayjs(filter?.startDate), dayjs(filter?.endDate)]}
                        format={"DD-MM-YYYY"}
                        allowClear={true}
                        onChange={handleChangeDates}
                    />
                </div>
                <Chart type='bar' data={dataChart} options={options} />
            </CardBody>
        </Card>
    )
}
