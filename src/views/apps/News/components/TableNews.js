import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { Eye, LogIn } from 'react-feather'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Table, Tooltip, Popconfirm, Col, Row, Tag } from 'antd'
import { deleteNews } from '../../../../api/dashboardNews'
import toast from 'react-hot-toast'
import ModalAddNews from './ModalAddNews'
import ModalChangeStatus from './ModalChangeStatus'
const columns = ({ handleConfirmDelete, handleEdit, handleToggleModalChangeStatus }) => [
    {
        title: "STT",
        width: 30,
        align: "center",
        render: (value, record, index) => index + 1,
    },
    {
        title: "Tiêu đề",
        dataIndex: "newsTitle",
    },
    {
        title: "Chủ đề",
        dataIndex: "newsType",
        align: "center",
        render: (value) => {
            return value?.newsType
        }
    },
    {
        title: "Ảnh",
        dataIndex: "image",
        align: "center",
        render: (value) => {
            return <img src={value} style={{ height: "70px" }} />
        }
    },
    {
        title: "Nội dung",
        dataIndex: "newsContent",
        render: (text) => {
            return text?.length > 40 ? `${text.slice(0, 40)}...` : text
        }
    },
    {
        title: "Tác giả",
        dataIndex: "userUpload",
        width: 200,
    },
    {
        title: "Đường dẫn",
        dataIndex: "newsLink",
        align: "center",
        render: (text) => {
            return <a href={text}>Đường dẫn</a>
        }
    },
    {
        title: "Trạng thái",
        dataIndex: "newsState",
        align: "center",
        render: (value) => {
            const state = value?.state
            const nameState = value?.description
            let color = ""
            switch (state) {
                case "pending":
                    color = "warning"
                    break
                case "approved":
                    color = "success"
                    break
                case "cancel":
                    color = "error"
                    break
                default:
                    color = "default"
            }
            return <Tag color={color}>{nameState}</Tag>
        },
    },
    {
        title: "Mô tả",
        dataIndex: "description",
        align: "center",
    },
    {
        title: "Ngày tạo",
        dataIndex: "dateUpload",
        align: "center",
        width: 100,
        render: (text) => {
            return moment.utc(text).local().format('DD-MM-YYYY ')
        }
    },
    {
        title: "Thao tác",
        width: "90px",
        render: (value, record) => (
            <div style={{ display: "flex", justifyContent: "center" }}>
                <Tooltip destroyTooltipOnHide placement="topLeft" title={"Chuyển trạng thái"}>
                    <LogIn
                        style={{
                            color: "#09A863",
                            marginRight: "10px",
                            height: "16px",
                            width: "16px",
                            cursor: "pointer",
                        }}
                        onClick={() => {
                            handleToggleModalChangeStatus(record)
                        }}
                    />
                </Tooltip>
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

                        }}
                    />
                </Tooltip>
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

function TableNews({ data, tableParams, handleTableChange }) {
    const [isChangeStatus, setIsChangeStatus] = useState('')
    const [newsList, setNewsList] = useState([])
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [curData, setCurData] = useState()
    const handleConfirmDelete = (recordId) => {
        deleteNews(recordId).then((res) => {
            const updateNewsList = newsList.filter(item => item.id !== recordId)
            setNewsList(updateNewsList)
            toast.success("Xoá tin tức thành công")
        }).catch(err => {
            console.log(err)
            toast.error("Xoá tin tức thất bại")
        })

    }

    const handleToggleModal = () => {
        setIsOpenModal(!isOpenModal)
    }
    const handleEdit = (record) => {
        setCurData(record)
        setIsOpenModal(true)
    }
    const handleToggleModalChangeStatus = (record) => {
        setCurData(record)
        setIsChangeStatus(!isChangeStatus)
    }
    const handleGetNewData = (values) => {
        const newRecordId = values.id

        setNewsList(prevNewsList => {
            const existingRecordIndex = prevNewsList.findIndex(record => record.id === newRecordId)

            if (existingRecordIndex !== -1) {
                const updatedNewsList = [...prevNewsList]
                updatedNewsList[existingRecordIndex] = values
                return updatedNewsList
            } else {
                return [...prevNewsList, values]
            }
        })
    }
    useEffect(() => {
        setNewsList(data)
    }, [data])

    return (
        <div>
            <Table
                columns={columns({ handleConfirmDelete, handleEdit, handleToggleModalChangeStatus })}
                dataSource={newsList}
                bordered
                pagination={tableParams.pagination}
                onChange={handleTableChange}
                rowKey="id"
            />
            <ModalAddNews
                openModal={isOpenModal}
                handleModal={handleToggleModal}
                getNewData={handleGetNewData}
                curData={curData}
                isEdit={true}
            />
            <ModalChangeStatus
                openModal={isChangeStatus}
                getNewData={handleGetNewData}
                handleModal={handleToggleModalChangeStatus}
                curData={curData}
            />
        </div>
    )
}

export default TableNews