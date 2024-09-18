import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardHeader } from "reactstrap"
import { Col, Row, Input, Button } from "antd"
import { newsStateList } from '../../../../api/dashboardNews'
import TableState from '../components/TableState'
import ModalAddState from '../components/ModalAddState'
function NewsState() {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [stateNewsList, setStateNewList] = useState([])
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
  const getStateList = () => {
    newsStateList().then(res => {
      setStateNewList(res.data)
    })
  }
  const handleToggleModal = () => {
    setIsOpenModal(!isOpenModal)
  }

  const handleGetNewData = (values) => {
    setStateNewList([...stateNewsList, values])
  }
  useEffect(() => {
    getStateList()
  }, [tableParams.pagination.current, tableParams.pagination.pageSize])
  return (
    <Card>
      <CardHeader tag="h3">
        Danh sách trạng thái
      </CardHeader>
      <CardBody>
        <Row
          className="mb-2 d-flex align-items-center justify-content-between"
        >
          {/* <Col span={6}>
            <Input placeholder='Tìm kiếm' />
          </Col>
          <Col span={12}>
            <div style={{ textAlign: "right" }}>
              <Button type='primary' onClick={handleToggleModal}>Thêm mới</Button>
            </div>
          </Col> */}
        </Row>
        <TableState data={stateNewsList} handleTableChange={handleTableChange} tableParams={tableParams} />
        <ModalAddState openModal={isOpenModal} handleModal={handleToggleModal} getNewData={handleGetNewData} />
      </CardBody>
    </Card>
  )
}

export default NewsState