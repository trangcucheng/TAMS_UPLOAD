import { Table, Input, Card, CardTitle, Tag, Popconfirm, Form } from "antd"
import { useState, Fragment, useEffect, useRef, useContext } from "react"
import {
    Label,
    Modal,
    ModalHeader,
    ModalBody,
    Button,
    Row,
    Col,
    FormFeedback,
    UncontrolledTooltip,
} from "reactstrap"
import { Plus, X } from "react-feather"
import { DeleteOutlined, EditOutlined, LockOutlined } from "@ant-design/icons"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { createGender, deleteGender, getGender, updateGender } from "../../../../api/gender"

import { AbilityContext } from '@src/utility/context/Can'

const ThamSoCapNhat = () => {
    const ability = useContext(AbilityContext)
    const [form] = Form.useForm()

    const selected = useRef()
    const MySwal = withReactContent(Swal)
    // const [data, setData] = useState([])
    const [count, setCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [idEdit, setIdEdit] = useState()

    const [rowsPerPage, setRowsPerpage] = useState(10)
    const [action, setAction] = useState('Add')

    const [search, setSearch] = useState("")
    const [isAdd, setIsAdd] = useState(false)

    // const getData = () => {
    //     getGender({
    //         params: {
    //             page: currentPage,
    //             limit: rowsPerPage,
    //             ...(search && search !== "" && { search }),
    //         },
    //     })
    //         .then((res) => {
    //             console.log("res", res)
    //             setData(res.list)
    //             setCount(res.count)
    //         })
    //         .catch((err) => {
    //             console.log(err)
    //         })
    // }

    //FakeData
    const data = [
        {
            id: 1,
            name: 'Tên tham số',
            dateNumber: 8
        }
    ]
    useEffect(() => {
        // getData()
    }, [currentPage, rowsPerPage, search])

    const handleModal = () => {
        setIsAdd(false)
        // setIsEdit(false)
    }
    const CloseBtn = (
        <X className="cursor-pointer" size={15} onClick={handleModal} />
    )
    const handleEdit = (record) => {
        form.setFieldsValue({
            GenderID: idEdit,
            ...record
        })
        setAction('Edit')
        setIsAdd(true)
        setIdEdit(record.ID)
    }
    const onReset = () => {
        form.resetFields()
        handleModal()
    }
    const onFinish = (values) => {
        if (action === 'Add') {
            createGender({
                GenderName: values.GenderName,
                description: values.Description
            })
                .then((res) => {
                    MySwal.fire({
                        title: "Thêm mới thành công",

                        icon: "success",
                        customClass: {
                            confirmButton: "btn btn-success",
                        },
                    }).then((result) => {
                        getData()
                        form.resetFields()
                        handleModal()
                    })
                })
                .catch((err) => {
                    MySwal.fire({
                        title: "Thêm mới thất bại",
                        icon: "error",
                        customClass: {
                            confirmButton: "btn btn-danger",
                        },
                    })
                })
        } else {
            updateGender({
                GenderName: values.GenderName,
                description: values.Description,
                GenderID: idEdit
            })
                .then((res) => {
                    MySwal.fire({
                        title: "Chỉnh sửa thành công",

                        icon: "success",
                        customClass: {
                            confirmButton: "btn btn-success",
                        },
                    }).then((result) => {
                        handleModal()
                        getData()
                        form.resetFields()
                    })
                })
                .catch((err) => {
                    MySwal.fire({
                        title: "Chỉnh sửa thất bại",
                        icon: "error",
                        customClass: {
                            confirmButton: "btn btn-danger",
                        },
                    })
                })
        }

    }

    const handleDelete = (key) => {
        deleteGender({
            params: {
                GenderID: key,
            },
        })
            .then((res) => {
                MySwal.fire({
                    title: "Xóa tham số cập nhật, báo cáo dữ liệu thành công",
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
                    title: "Xóa tham số cập nhật, báo cáo dữ liệu thất bại",
                    icon: "error",
                    customClass: {
                        confirmButton: "btn btn-danger",
                    },
                })
                console.log(error)
            })
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
            title: "Tên tham số",
            dataIndex: "name",
            // align: 'center'
            // width: 250,
        },
        {
            title: "Số ngày",
            dataIndex: "dateNumber",
            width: "20%",
            align: "center",
        },
        {
            title: "Thao tác",
            width: 100,
            align: "center",
            render: (record) => (
                <div style={{ display: "flex", justifyContent: "space-around" }}>
                    {
                        ability.can('update', "DM_GIOI_TINH") && <>
                            <EditOutlined
                                id={`tooltip_edit${record.ID}`}
                                style={{ color: "#09A863", cursor: 'pointer' }}
                                onClick={(e) => handleEdit(record)}
                            />
                            <UncontrolledTooltip placement="top" target={`tooltip_edit${record.ID}`}>
                                Chỉnh sửa
                            </UncontrolledTooltip></>

                    }
                    {
                        ability.can('delete', "DM_GIOI_TINH") && <Popconfirm
                            title="Bạn chắc chắn xóa?"
                            onConfirm={() => handleDelete(record.ID)}
                            cancelText="Hủy"
                            okText="Đồng ý"
                        >
                            <DeleteOutlined style={{ color: "red", cursor: 'pointer' }} id={`tooltip_delete${record.ID}`} />
                            <UncontrolledTooltip placement="top" target={`tooltip_delete${record.ID}`}>
                                Xóa
                            </UncontrolledTooltip>
                        </Popconfirm>

                    }

                </div>
            ),
        },
    ]
    const showTotal = (count) => `Tổng số: ${count}`

    return (
        <Card
            title="Tham số cập nhật, báo cáo dữ liệu"
            style={{ backgroundColor: "white", width: "100%", height: "100%" }}
        >
            <Row style={{ justifyContent: "space-between" }}>

                <Col sm="4" style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Label
                        className=""
                        style={{
                            width: "100px",
                            fontSize: "14px",
                            height: "35px",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        Tìm kiếm
                    </Label>
                    <Input
                        type="text"
                        placeholder="Tìm kiếm"
                        style={{ height: "35px" }}
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
                <Col sm="7" style={{ display: "flex", justifyContent: "flex-end" }}>
                    {
                        ability.can('create', "DM_NGANH") && <Button
                            onClick={(e) => {
                                setAction('Add')
                                setIsAdd(true)
                            }}
                            color="primary"
                            style={{
                                marginBottom: 16,
                            }}
                        >
                            Thêm mới
                        </Button>
                    }

                </Col>
            </Row>
            <Table
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
            />

            {/* add modal */}
            <Modal
                isOpen={isAdd}
                toggle={handleModal}
                contentClassName="pt-0"
                autoFocus={false}
                className="modal-md"
            >
                <ModalHeader
                    className=""
                    toggle={handleModal}
                    close={CloseBtn}
                    tag="div"
                >
                    <h4 className="modal-title">{
                        action === 'Add' ? "Thêm mới tham số cập nhật, báo cáo dữ liệu" : "Chỉnh sửa tham số cập nhật, báo cáo dữ liệu"
                    } </h4>
                </ModalHeader>
                <ModalBody className="flex-grow-1">
                    <Form
                        form={form}
                        name="control-hooks"
                        onFinish={onFinish}
                        layout="vertical"
                    ><Row>

                            <div className=' col col-12'>
                                <Form.Item style={{ marginBottom: '4px' }}
                                    name="GenderName"
                                    label={
                                        <span>
                                            Tên tham số cập nhật, báo cáo dữ liệu<span className="redColor">(*)</span>
                                        </span>
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập tên tham số cập nhật, báo cáo dữ liệu'
                                        },
                                        {
                                            validator: (rule, value) => {
                                                if (value && value.trim() === '') {
                                                    return Promise.reject('Không hợp lệ')
                                                }
                                                return Promise.resolve()
                                            },
                                        },
                                    ]}
                                >
                                    <Input placeholder='Nhập tên tham số cập nhật, báo cáo dữ liệu' />
                                </Form.Item>
                            </div>
                            <div className=' col col-12'>
                                <Form.Item style={{ marginBottom: '4px' }}
                                    name="Description"
                                    label="Ghi chú"
                                >
                                    <Input placeholder='Nhập ghi chú' />
                                </Form.Item>

                            </div>
                        </Row>
                        <Form.Item style={{ display: 'flex', justifyContent: 'center', paddingTop: '15px' }}>
                            <Button color="primary"
                                className="addBtn" style={{ marginRight: '20px', width: '94px' }}>
                                Lưu
                            </Button>
                            <Button htmlType="button"
                                className="addBtn" onClick={onReset} style={{ width: '94px' }}>
                                Hủy
                            </Button>
                        </Form.Item>
                    </Form>
                </ModalBody>
            </Modal>
        </Card>
    )
}
export default ThamSoCapNhat 
