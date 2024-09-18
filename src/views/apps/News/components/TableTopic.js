import React, { useEffect, useState } from 'react'
import { Eye } from 'react-feather'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Table, Tooltip, Popconfirm, Col, Row } from 'antd'
import { topicList, deleteTopic } from '../../../../api/dashboardNews'
import toast from 'react-hot-toast'
import ModalAddTopic from './ModalAddTopic'
const columns = ({ handleConfirmDelete, handleEdit }) => [
    {
        title: "STT",
        width: 30,
        align: "center",
        render: (value, record, index) => index + 1,
    },

    {
        title: "Chủ đề",
        dataIndex: "newsType",
    },
    {
        title: "Màu",
        dataIndex: "color",
    },
    {
        title: "Mô tả",
        dataIndex: "description",
    },
    {
        title: "Thao tác",
        width: "90px",
        render: (value, record) => (
            <div style={{ display: "flex", justifyContent: "center" }}>
                <Tooltip destroyTooltipOnHide placement="topLeft" title={"Chỉnh sửa"}>
                    <EditOutlined
                        style={{ color: '#09A863', marginRight: '10px' }}
                        onClick={() => {
                            handleEdit(record)
                        }}
                    />
                </Tooltip>
                <Popconfirm title="Bạn chắc chắn xóa?" cancelText="Hủy" okText="Đồng ý" onConfirm={() => handleConfirmDelete(record.id)}>
                    <DeleteOutlined style={{ color: "red" }} />
                </Popconfirm>
            </div>
        ),
    },
]

function TableTopic({ data, tableParams, handleTableChange }) {
    const [topicNewsList, setTopicNewList] = useState([])
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [curData, setCurData] = useState()
    const handleToggleModal = () => {
        setIsOpenModal(!isOpenModal)
    }
    const handleEdit = (record) => {
        setCurData(record)
        setIsOpenModal(true)
    }
    const handleGetNewData = (values) => {
        const newRecordId = values.id

        setTopicNewList(prevTopicNewsList => {
            const existingRecordIndex = prevTopicNewsList.findIndex(record => record.id === newRecordId)

            if (existingRecordIndex !== -1) {
                const updatedTopicNewsList = [...prevTopicNewsList]
                updatedTopicNewsList[existingRecordIndex] = values
                return updatedTopicNewsList
            } else {
                return [...prevTopicNewsList, values]
            }
        })
    }

    const handleConfirmDelete = (recordId) => {
        deleteTopic(recordId).then((res) => {
            const updateData = topicNewsList.filter(item => item.id !== recordId)
            setTopicNewList(updateData)
            toast.success("Xoá chủ đề thành công")
        }).catch(err => {
            console.log(err)
            toast.error("Xoá chủ đề thất bại")
        })

    }
    useEffect(() => {
        setTopicNewList(data)
    }, [data])
    return (
        <div>
            <Table
                columns={columns({ handleConfirmDelete, handleEdit })}
                dataSource={topicNewsList}
                bordered
                pagination={tableParams.pagination}
                onChange={handleTableChange}
            />
            <ModalAddTopic
                openModal={isOpenModal}
                handleModal={handleToggleModal}
                getNewData={handleGetNewData}
                curData={curData}
                isEdit={true}
            />
        </div>
    )
}

export default TableTopic