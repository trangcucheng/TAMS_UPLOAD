import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardHeader, Label } from "reactstrap"
import { Col, Row, Input, Button, Select } from "antd"
import TableNews from '../components/TableNews'
import ModalAddNews from '../components/ModalAddNews'
import { NewsList, topicList } from '../../../../api/dashboardNews'
function News() {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [newsList, setNewsList] = useState([])
  const [search, setSearch] = useState("")
  const [topicNewsList, setTopicNewList] = useState([])
  const [newsTypeID, setNewsTypeID] = useState()
  const [newsStatusID, setNewsStatusID] = useState()
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      total: 10
    },
  })

  const [statusList, setStatusList] = useState([
    {
        id: 1,
        state: "pending",
        description: "Chờ phê duyệt"
    },
    {
        id: 2,
        state: "aprroved",
        description: "Đã duyệt"
    },
    {
        id: 3,
        state: "cancel",
        description: "Từ chối"
    },
    {
        id: 4,
        state: "recall",
        description: "Thu hồi"
    }
])
  const handleTableChange = (pagination) => {
    setTableParams({ pagination })
  }

  const handleToggleModal = () => {
    setIsOpenModal(!isOpenModal)
  }

  const getNewsList = () => {
    NewsList({
      params: {
        page: tableParams.pagination.current,
        limit: tableParams.pagination.pageSize,
        ...(newsTypeID && newsTypeID !== null && { newsTypeID }),
        ...(newsStatusID && newsStatusID !== null && { newsStateID: newsStatusID }),
        ...(search && search !== "" && { newsTitle: search }),
      }
    }).then(res => {
      setNewsList(res.data)
      setTableParams(prev => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total: res.count
        }
      }))
    })
  }
  const getTopicList = () => {
    topicList({
      params: {
        page: 1,
        limit: 200,
      }
    }).then(res => {
      setTopicNewList(res.data)
    })
  }

  const handleGetNewData = (values) => {
    setNewsList([values, ...newsList])
  }

  /** search */
  const handleKeyDown = (e) => {
    const keyCode = e.keyCode || e.which
    if (keyCode === 13) {
      setSearch(e.target.value)
    }
  }

  const handleSelectFilter = (value) => {
    setNewsTypeID(value)
  }
  const handleSelectFilterStatus = (value) => {
    setNewsStatusID(value)
  }
  /** search */

  useEffect(() => {
    getTopicList()
    getNewsList()
  }, [tableParams.pagination.current, tableParams.pagination.pageSize, search, newsTypeID, newsStatusID])

  return (
    <Card>
      <CardHeader tag="h3">
        Danh sách tin tức
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
              <Input placeholder="Tìm kiếm theo tiêu đề" style={{ width: '280px', height: '32px' }} onKeyDown={handleKeyDown} />
            </div>

            <div>
              <Label className='form-label' style={{ width: '60px', marginTop: '10px' }}>
                Chủ đề
              </Label>
              <Select
                style={{ width: 200 }}
                allowClear
                showSearch
                placeholder="Chủ đề"
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                options={topicNewsList.map((item) => ({
                  value: item?.id,
                  label: item?.newsType,
                }))}
                onChange={handleSelectFilter}
              />
            </div>
            <div>
              <Label className='form-label' style={{ width: '80px', marginTop: '10px' }}>
                Trạng thái
              </Label>
              <Select
                style={{ width: 200 }}
                allowClear
                showSearch
                placeholder="Trạng thái"
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                options={statusList.map((item) => ({
                  value: item?.id,
                  label: item?.description,
                }))}
                onChange={handleSelectFilterStatus}
              />
            </div>
          </Col>
          <Col span={4}>
            <div style={{ textAlign: "right" }}>
              <Button type='primary' onClick={handleToggleModal}>Thêm mới</Button>
            </div>
          </Col>
        </Row>
        <TableNews data={newsList} handleTableChange={handleTableChange} tableParams={tableParams} />
        <ModalAddNews openModal={isOpenModal} handleModal={handleToggleModal} getNewData={handleGetNewData} />
      </CardBody>
    </Card>
  )
}

export default News