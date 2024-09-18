import { Table, Input, Card, CardTitle, Tag, Popconfirm, Switch, Spin, Select, Tooltip } from "antd"
import React, { useState, Fragment, useEffect, useRef, useContext } from "react"
import {
    Label,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    Button,
    Row,
    Col,
    FormFeedback,
    UncontrolledTooltip,
} from "reactstrap"
import { Plus, X } from "react-feather"
import { BarsOutlined, DeleteOutlined, EditOutlined, LockOutlined, UnlockOutlined } from "@ant-design/icons"
// import style from "../../../../assets/scss/index.module.scss"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
// import Select from "react-select"
import * as yup from "yup"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import classnames from "classnames"
import { AbilityContext } from '@src/utility/context/Can'
import { deleteCourse, getCourse, toggleActiveCourse } from "../../../api/course"
import { toDateString, toDateTimeString } from "../../../utility/Utils"
import { useNavigate } from "react-router-dom"
const LIST_STATUS = [
    {
        value: 1,
        label: "Đang tiến hành"
    },
    {
        value: 2,
        label: "Bị khóa"
    }
]
const Course = () => {
    const navigate = useNavigate()
    const [loadingData, setLoadingData] = useState(false)
    const ability = useContext(AbilityContext)
    const MySwal = withReactContent(Swal)
    const [data, setData] = useState([])
    const [count, setCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerpage] = useState(10)
    const [search, setSearch] = useState("")
    const [isActive, setIsActive] = useState()
    const [isAdd, setIsAdd] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [info, setInfo] = useState()
    const getData = (page, limit, search, isActive) => {
        setLoadingData(true)
        getCourse({
            params: {
                page,
                perPage: limit,
                ...(search && search !== "" && { search }),
                ...(isActive && isActive !== undefined && isActive !== null && { isActive }),
            },
        })
            .then((res) => {
                setData(res?.data)
                setCount(res?.pagination?.totalRecords)
            })
            .catch((err) => {
                console.log(err)
            }).finally(() => {
                setLoadingData(false)
            })
    }
    useEffect(() => {
        getData(currentPage, rowsPerPage, search, isActive)
    }, [currentPage, rowsPerPage, search, isActive])

    const handleModal = () => {
        setIsAdd(false)
        setIsEdit(false)
        setInfo(null)
        // handleReset()
    }
    const CloseBtn = (
        <X className="cursor-pointer" size={15} onClick={handleModal} />
    )
    const handleEdit = (record) => {
        setInfo(record)
        setIsEdit(true)
    }

    const handleSupervisor = (record) => {
        navigate(`/tams/checking-document`, { state: record })
    }

    const handleDelete = (key) => {
        deleteCourse(key)
            .then((res) => {
                MySwal.fire({
                    title: "Xóa đợt kiểm tra thành công",
                    icon: "success",
                    customClass: {
                        confirmButton: "btn btn-success",
                    },
                }).then((result) => {
                    if (currentPage === 1) {
                        getData(1, rowsPerPage)
                    } else {
                        setCurrentPage(1)
                    }
                })
            })
            .catch((error) => {
                MySwal.fire({
                    title: "Xóa đợt kiểm tra thất bại",
                    icon: "error",
                    customClass: {
                        confirmButton: "btn btn-danger",
                    },
                })
                console.log(error)
            })
    }

    const handleIsActive = (id) => {
        toggleActiveCourse(id).then(result => {
            if (result.status === 'success') {
                MySwal.fire({
                    title: "Thay đổi trạng thái thành công",
                    icon: "success",
                    customClass: {
                        confirmButton: "btn btn-success",
                    },
                })
            } else {
                MySwal.fire({
                    title: "Thay đổi trạng thái thất bại",
                    icon: "error",
                    customClass: {
                        confirmButton: "btn btn-danger",
                    },
                })
            }
            getData()
        }).catch(error => {
            console.log(error)
        })
    }

    const handleChangeStatus = (value) => {
        if (value) {
            setIsActive(value)
        } else {
            setIsActive()
        }
    }

    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
            width: 30,
            align: "center",
            render: (text, record, index) => (
                <span>{((currentPage - 1) * rowsPerPage) + index + 1}</span>
            ),
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            align: 'center',
            width: 150,
            render: (text, record, index) => (
                <span>{toDateTimeString(record.createdAt)}</span>
            ),
        },
        {
            title: "Tên đợt kiểm tra",
            dataIndex: "name",
            align: 'left',
            width: 380,
            render: (text, record, index) => (
                <span style={{ whiteSpace: 'break-spaces' }}>{record.name}</span>
            ),
        },
        {
            title: "Ngày kiểm tra",
            dataIndex: "date",
            align: 'center',
            width: 150,
            render: (text, record, index) => (
                <span>{toDateString(record.date)}</span>
            ),
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            align: 'left',
            width: 200,
            render: (text, record, index) => (
                <span style={{ whiteSpace: 'break-spaces' }}>{record.description}</span>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "isActive",
            width: 100,
            align: "center",
            render: (text, record, index) => {
                if (record?.isActive === 1) {
                    return <Tag color="success">Đang tiến hành</Tag>
                } else return <Tag color="error">Đã khóa</Tag>
            },
        },
        {
            title: "Thao tác",
            width: 100,
            align: "center",
            render: (record) => (
                <div style={{ display: "flex", justifyContent: "center" }}>
                    {
                        ability.can('update', 'TAI_KHOAN') &&
                        <Popconfirm
                            title={`${record.isActive === 1 ? "Bạn chắc chắn khóa đợt kiểm tra này?" : "Bạn chắc chắn mở đợt kiểm tra này?"}`}
                            onConfirm={() => handleIsActive(record.id)}
                            cancelText="Hủy"
                            okText="Đồng ý"
                        >
                            {
                                record.isActive === 1 ? <Tooltip placement="top" title="Khóa đợt kiểm tra">
                                    <LockOutlined
                                        style={{ color: "red", cursor: 'pointer', marginRight: '1rem' }}
                                    />
                                </Tooltip> : <Tooltip placement="top" title="Mở khóa đợt kiểm tra">
                                    <UnlockOutlined
                                        style={{ color: "#09A863", cursor: 'pointer', marginRight: '1rem' }}
                                    />
                                </Tooltip>
                            }
                        </Popconfirm>
                    }
                    {ability.can('update', 'DOT_KIEM_TRA') &&
                        <>

                            <Tooltip placement="top" title="Kiểm tra trong khóa" >
                                <BarsOutlined
                                    style={{ color: "#09A863", cursor: 'pointer', marginRight: '1rem' }}
                                    onClick={(e) => handleSupervisor(record)}
                                />
                            </Tooltip>
                        </>}
                    {ability.can('update', 'DOT_KIEM_TRA') &&
                        <>
                            <Tooltip placement="top" title="Chỉnh sửa" >
                                <EditOutlined
                                    style={{ color: "#09A863", cursor: 'pointer', marginRight: '1rem' }}
                                    onClick={(e) => handleEdit(record)}
                                />
                            </Tooltip>
                        </>}
                    {ability.can('delete', 'DOT_KIEM_TRA') &&
                        <Popconfirm
                            title="Bạn chắc chắn xóa?"
                            onConfirm={() => handleDelete(record.id)}
                            cancelText="Hủy"
                            okText="Đồng ý"
                        >
                            <Tooltip placement="top" title="Xóa" >
                                <DeleteOutlined style={{ color: "red", cursor: 'pointer' }} />
                            </Tooltip>
                        </Popconfirm>}
                </div>
            ),
        },
    ]

    return (
        <Card
            title="Danh sách đợt kiểm tra"
            style={{ backgroundColor: "white", width: "100%", height: "100%" }}
        >
            <Row style={{ justifyContent: "space-between" }}>
                <Col sm="8" style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Col sm="6" style={{ display: "flex", justifyContent: "space-between", marginRight: "1rem" }}>
                        <Label
                            className=""
                            style={{
                                width: "100px",
                                fontSize: "14px",
                                height: "34px",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            Tìm kiếm
                        </Label>
                        <Input
                            type="text"
                            placeholder="Tìm kiếm"
                            style={{ height: "34px" }}
                            onChange={(e) => {
                                if (e.target.value === "") {
                                    setSearch("")
                                }
                            }}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    setSearch(e.target.value)
                                    setCurrentPage(1)
                                }
                            }}
                        />
                    </Col>
                    <Col sm="6" style={{ display: "flex", justifyContent: "space-between" }}>
                        <Label
                            className=""
                            style={{
                                width: "150px",
                                fontSize: "14px",
                                height: "34px",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            Lọc theo trạng thái
                        </Label>
                        <Select
                            placeholder="Chọn trạng thái"
                            className='mb-50 select-custom flex-1'
                            options={LIST_STATUS}
                            allowClear
                            onChange={(value) => handleChangeStatus(value)}
                        />
                    </Col>
                </Col>
                {ability.can('create', 'DOT_KIEM_TRA') &&
                    <Col sm="4" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            onClick={(e) => setIsAdd(true)}
                            color="primary"
                            className="addBtn"
                            style={{
                                width: '100px',
                            }}
                        >
                            Thêm mới
                        </Button>
                    </Col>
                }
            </Row>
            {loadingData === true ? <Spin style={{ position: 'relative', left: '50%' }} /> : <Table
                columns={columns}
                dataSource={data}
                bordered
                pagination={{
                    current: currentPage,
                    pageSize: rowsPerPage,
                    defaultPageSize: rowsPerPage,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "20", "30", '100'],
                    total: count,
                    locale: { items_per_page: "/ trang" },
                    showTotal: (total, range) => <span>Tổng số: {total}</span>,
                    onShowSizeChange: (current, pageSize) => {
                        setCurrentPage(current)
                        setRowsPerpage(pageSize)
                    },
                    onChange: (pageNumber) => {
                        setCurrentPage(pageNumber)
                    }
                }}
            />}

            <AddNewModal
                open={isAdd}
                handleModal={handleModal}
                getData={getData}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
            />
            {
                <EditModal
                    open={isEdit}
                    handleModal={handleModal}
                    getData={getData}
                    infoEdit={info}
                    currentPage={currentPage}
                    rowsPerPage={rowsPerPage}
                />
            }
        </Card>
    )
}

const AddNewModal = React.lazy(() => import("./modal/AddNewModal"))
const EditModal = React.lazy(() => import("./modal/EditModal"))
export default Course 
