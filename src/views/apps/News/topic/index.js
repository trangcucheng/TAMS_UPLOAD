import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardHeader } from "reactstrap"
import { Col, Row, Input, Button } from "antd"
import TableTopic from '../components/TableTopic'
import ModalAddTopic from '../components/ModalAddTopic'
import { topicList } from '../../../../api/dashboardNews'
function NewsTopic() {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [topicNewsList, setTopicNewList] = useState([])
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      total: 10
    },
  })
  const handleTableChange = (pagination) => {
    setTableParams({ pagination })
  }
  const getTopicList = () => {
    topicList({
      params: {
        page: tableParams.pagination.current,
        limit: tableParams.pagination.pageSize,
      }
    }).then(res => {
      setTopicNewList(res.data)
      setTableParams(prev => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total: res.count
        }
      }))
    })
  }
  const handleToggleModal = () => {
    setIsOpenModal(!isOpenModal)
  }

  const handleGetNewData = (values) => {
    setTopicNewList([...topicNewsList, values])
  }
  useEffect(() => {
    getTopicList()
  }, [tableParams.pagination.current, tableParams.pagination.pageSize])
  return (
    <Card>
      <CardHeader tag="h3">
        Danh sách chủ đề
      </CardHeader>
      <CardBody>
        <Row
          className="mb-2 d-flex align-items-center justify-content-between"
        >
          <Col span={6}>
            <Input placeholder='Tìm kiếm' />
          </Col>
          <Col span={12}>
            <div style={{ textAlign: "right" }}>
              <Button type='primary' onClick={handleToggleModal}>Thêm mới</Button>
            </div>
          </Col>
        </Row>
        <TableTopic data={topicNewsList} handleTableChange={handleTableChange} tableParams={tableParams} />
        <ModalAddTopic openModal={isOpenModal} handleModal={handleToggleModal} getNewData={handleGetNewData} />
      </CardBody>
    </Card>
  )
}

export default NewsTopic