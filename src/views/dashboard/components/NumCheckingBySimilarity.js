// ** Third Party Components
import Chart from 'react-apexcharts'
import { ArrowDown } from 'react-feather'
import { DatePicker } from "antd"
import dayjs from "dayjs"
// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, CardSubtitle, Badge } from 'reactstrap'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { toDateStringv2 } from '../../../utility/Utils'
import { useEffect, useState } from 'react'
import { getCheckingDocumentStatisticByDuplicate } from '../../../api/checking_document_statistic'

const { RangePicker } = DatePicker

const fakeData = [
    {
        name: "_15",
        duplicate: [
            { month: "1", count: "0" },
            { month: "2", count: "0" },
            { month: "3", count: "0" },
            { month: "4", count: "0" },
            { month: "5", count: "0" },
            { month: "6", count: "0" },
            { month: "7", count: "0" },
            { month: "8", count: "1" },
            { month: "9", count: "1" },
            { month: "10", count: "0" },
            { month: "11", count: "0" },
            { month: "12", count: "0" }
        ]
    },
    {
        name: "15_30",
        duplicate: [
            { month: "1", count: "2" },
            { month: "2", count: "5" },
            { month: "3", count: "3" },
            { month: "4", count: "6" },
            { month: "5", count: "0" },
            { month: "6", count: "4" },
            { month: "7", count: "0" },
            { month: "10", count: "0" },
            { month: "11", count: "0" },
            { month: "12", count: "0" }
        ]
    },
    {
        name: "30_50",
        duplicate: [
            { month: "1", count: "1" },
            { month: "2", count: "0" },
            { month: "3", count: "2" },
            { month: "4", count: "4" },
            { month: "5", count: "3" },
            { month: "6", count: "0" },
            { month: "7", count: "5" },
            { month: "10", count: "6" },
            { month: "11", count: "0" },
            { month: "12", count: "0" }
        ]
    },
    {
        name: "50_",
        duplicate: [
            { month: "1", count: "4" },
            { month: "2", count: "0" },
            { month: "3", count: "6" },
            { month: "4", count: "7" },
            { month: "5", count: "8" },
            { month: "6", count: "0" },
            { month: "7", count: "1" },
            { month: "10", count: "2" },
            { month: "11", count: "0" },
            { month: "12", count: "0" }
        ]
    }
]

const NumCheckingBySimilarity = () => {
    const [data, setData] = useState([])
    const currentYear = new Date().getFullYear()
    const [filter, setFilter] = useState({
        startDate: dayjs(`${currentYear}-01-01`),
        endDate: dayjs(`${currentYear}-12-31`)
    })

    useEffect(() => {
        if (filter) {
            getCheckingDocumentStatisticByDuplicate({
                params: {
                    startDate: dayjs(filter?.startDate).format('YYYY-MM-DD'),
                    endDate: dayjs(filter?.endDate).format('YYYY-MM-DD')
                }
            }).then(res => {
                setData(res.data)
            }).catch(error => {
                console.log(error)
            })
        }
    }, [filter])

    const categories = data.map(item => {
        return item.duplicate.map(item => {
            return `Tháng ${item.month}`
        })
    })

    const direction = 'ltr'
    const warning = '#ff9f43'
    // ** Chart Options
    const options = {
        chart: {
            zoom: {
                enabled: false
            },
            parentHeightOffset: 0,
            toolbar: {
                show: false
            }
        },

        markers: {
            strokeWidth: 7,
            strokeOpacity: 1,
            strokeColors: ['#fff', "#fff", "#fff", "#fff"],
            colors: [warning, "#00FF00", "#0000FF", "#FF0000"]
        },
        dataLabels: {
            enabled: true, // Hiển thị số liệu
            formatter(val) {
                return val // Định dạng số liệu với ký hiệu phần trăm
            },
            offsetY: -5, // Vị trí của số liệu so với cột
            style: {
                fontSize: '12px',
                colors: ["#ccc"]
            }
        },
        stroke: {
            curve: 'straight'
        },
        colors: [warning, "#00FF00", "#0000FF", "#FF0000"],
        grid: {
            xaxis: {
                lines: {
                    show: true
                }
            }
        },
        tooltip: {
            custom(data) {
                return `<div class='px-1 py-50'>
              <span>${data.series[data.seriesIndex][data.dataPointIndex]}</span>
            </div>`
            }
        },
        xaxis: {
            categories: categories[0]
        },
        yaxis: {
            opposite: direction === 'rtl'
        }
    }

    const nameMapping = {
        _15: '<15%',
        '15_30': '15-30%',
        '30_50': '30-50%',
    }

    const data__ = data.map(item => ({
        name: nameMapping[item.name] || '>50%',
        data: item.duplicate.map(i => parseInt(i.count))
    }))
    // ** Chart Series
    const series = data__

    const handleChangeTime = (dates) => {
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
        <Card>
            <CardHeader className='d-flex flex-sm-row flex-column justify-content-md-between align-items-start justify-content-start'>
                <div>
                    <CardTitle className='mb-75' tag='h4'>
                        Số lượng tài liệu kiểm tra theo mức độ trùng lặp
                    </CardTitle>
                    {/* <CardSubtitle className='text-muted'>Commercial networks & enterprises</CardSubtitle> */}
                </div>
                {/* <div className='d-flex align-items-center flex-wrap mt-sm-0 mt-1'>
                    <h5 className='fw-bolder mb-0 me-1'>$ 100,000</h5>
                    <Badge color='light-secondary'>
                        <ArrowDown size={13} className='text-danger' />
                        <span className='align-middle ms-25'>20%</span>
                    </Badge>
                </div> */}
            </CardHeader>
            <CardBody>
                <div className="d-flex col col-4" style={{ justifyContent: "flex-start", marginRight: "1rem", alignItems: "center" }}>
                    <span style={{ marginRight: "1rem" }}>Thời gian</span>
                    <RangePicker
                        style={{
                            width: "70%",
                        }}
                        // defaultValue={[dayjs(`${currentYear}-01-01`), dayjs(`${currentYear}-12-31`)]}
                        format={"DD-MM-YYYY"}
                        allowClear={true}
                        onChange={handleChangeTime}
                    />
                </div>
                <Chart options={options} series={series} type='line' height={400} />
            </CardBody>
        </Card>
    )
}

export default NumCheckingBySimilarity
