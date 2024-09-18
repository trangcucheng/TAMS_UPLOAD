import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { Eye } from 'react-feather'
import { Card, CardBody, CardHeader, Label } from "reactstrap"
import { Table, Tooltip, Input, Col, Row } from 'antd'
import { notificationList } from '../../../api/dashboardNotification'
import { Link, useNavigate } from "react-router-dom"
const columns = ({ handleDetail, tableParams }) => [
  {
    title: "STT",
    width: 30,
    align: "center",
    render: (value, record, index) => ((tableParams.pagination.current - 1) * 10) + index + 1,
  },
  {
    title: "Tiêu đề",
    dataIndex: "notificationTitle",
    width: 250
  },
  {
    title: "Nội dung",
    dataIndex: "notificationContent",
    width: 300
  },
  {
    title: "Ngày tạo",
    dataIndex: "dateCreate",
    width: 150,
    align: "center",
    render: (text) => {
      return moment.utc(text).local().format('DD/MM/YYYY HH:mm:ss')
    }
  },
  // {
  //   title: "Tác giả",
  //   dataIndex: "description",
  //   width: 110,
  //   align: "center",
  //   render: (text) => {
  //     return JSON.parse(text)?.userChange
  //   }
  // },
  {
    title: "Đường dẫn",
    dataIndex: "notificationLink",
    align: "center",
    width: 90,
    render: (value) => {
      return <Link to={value}>Link</Link>
    }
  },
  {
    title: "Thao tác",
    width: 100,
    align: "center",
    render: (value, record) => (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Tooltip destroyTooltipOnHide placement="topLeft" title={"Chi tiết"}>
          <Eye
            style={{
              color: "#09A863",
              marginRight: "10px",
              height: "16px",
              width: "16px",
              cursor: "pointer",
            }}
            onClick={() => {
              handleDetail(record)
            }}
          />
        </Tooltip>
      </div>
    ),
  },
]
function NotificationManagement() {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [search, setSearch] = useState("")
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 20,
      total: 10
    },
  })

  const handleDetail = (record) => {
    navigate(`/quanlythongtindieuhanh/thongbao/${record?.id}`)
  }
  // api thông báo
  const getNotificationList = () => {
    notificationList({
      params: {
        page: tableParams.pagination.current,
        limit: tableParams.pagination.pageSize,
        ...(search && search !== "" && { notificationTitle: search }),
      }
    }).then(res => {
      const dataRes = res.data
      setData(dataRes)
      setTableParams(prev => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total: res.count
        }
      }))
    })
  }

  /** phân trang và tìm kiếm */
  const handleTableChange = (pagination) => {
    setTableParams({ pagination })
  }
  const handleKeyDown = (e) => {
    const keyCode = e.keyCode || e.which
    if (keyCode === 13) {
      setSearch(e.target.value)
    }
  }
  /** phân trang và tìm kiếm */

  useEffect(() => {
    getNotificationList()
  }, [tableParams.pagination.current, tableParams.pagination.pageSize, search])
  return (
    <Card>
      <CardHeader tag="h3">
        Danh sách thông báo
      </CardHeader>
      <CardBody>
        <Row
          gutter={15}
          className="mb-2 d-flex align-items-center justify-content-between flex-wrap"
        >
          <Col span={20} style={{ display: "flex", flexWrap: "wrap", gap: "0 60px" }}>
            <div>
              <Label className='form-label' style={{ width: '70px', marginTop: '10px' }}>
                Tìm kiếm
              </Label>
              <Input placeholder="Tìm kiếm" style={{ width: '300px', height: '32px' }} onKeyDown={handleKeyDown} />
            </div>
          </Col>
        </Row>
        <Table
          columns={columns({ tableParams, handleDetail })}
          dataSource={data}
          bordered
          pagination={tableParams.pagination}
          onChange={handleTableChange}
        />
      </CardBody>
    </Card>
  )
}

export default NotificationManagement