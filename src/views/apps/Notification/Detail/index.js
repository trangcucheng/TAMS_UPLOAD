import React, { useEffect, useState } from "react"
import { Card, CardBody, CardHeader, Label } from "reactstrap"
import { Row, Table, Button, DatePicker, Col } from "antd"
import { ArrowLeftOutlined } from "@ant-design/icons"
import { useNavigate, useParams } from 'react-router-dom'
import { notificationById } from "../../../../api/dashboardNotification"
import moment from 'moment'
const textStyle = {
  fontSize: '16px',
  fontWeight: 500
}
const headingStyle = {
  fontSize: '18px',
  fontWeight: 500
}
const cardStyle = {
  backgroundColor: 'rgb(230, 244, 255)',
  border: "1px solid rgb(145, 202, 255)"
}
function NotificationDetail() {
  const [notification, setNotification] = useState()
  const navigate = useNavigate()
  const params = useParams()

  const getNotificationDetail = () => {
    notificationById(params?.id).then(
      res => {
        setNotification(res)
      }
    ).catch(err => {
      console.log(err)
    })
  }
  useEffect(() => {
    getNotificationDetail()
  }, [])
  return (
    <Card style={cardStyle}>
      <CardHeader tag="h3">
        <div>
          <Button shape='circle' icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}></Button> Thông báo
        </div>
      </CardHeader>
      <CardBody>
        <p style={headingStyle}>{notification?.notificationTitle}</p>
        <p><span style={textStyle}>Ngày:</span>  {moment.utc(notification?.dateCreate).local().format('DD/MM/YYYY HH:mm:ss')}</p>
        <p><span style={textStyle}>Tác giả:</span> {notification?.description ? JSON.parse(notification.description)?.userChange : null}</p>
        <p><span style={textStyle}>Nội dung: </span> {notification?.notificationContent}</p>
      </CardBody>
    </Card>
  )
}

export default NotificationDetail