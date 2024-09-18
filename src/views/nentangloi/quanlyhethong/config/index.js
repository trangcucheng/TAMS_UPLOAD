// import { useState, useContext, Fragment, useRef } from "react"
// import classnames from "classnames"
// import { useForm } from "react-hook-form"
// import { Link, useHistory } from "react-router-dom"
// import InputPasswordToggle from "@components/input-password-toggle"
// import { getHomeRouteForLoggedInUser, isObjEmpty } from "@utils"
// import Swal from "sweetalert2"
// import withReactContent from "sweetalert2-react-content"
// import {
//     Alert,
//     Row,
//     Col,
//     CardTitle,
//     FormText,
//     Form,
//     Input,
//     FormGroup,
//     Label,
//     CustomInput,
//     Button,
//     UncontrolledTooltip,
//     Badge,
//     Card,
// } from "reactstrap"
// import Spinner from "@components/spinner/Loading-spinner"
// /** Constants */
// /** API */
// import { changePass } from "../../../../api/users"
// // import '@styles/base/pages/page-auth.scss'

// const ChangePass = (props) => {
//     const MySwal = withReactContent(Swal)
//     const [pass, setPass] = useState({
//         newPassword: "",
//         newPassword_: "",
//     })

//     const [loading, setLoading] = useState(false)
//     // otp
//     const {
//         register,
//         formState: { errors },
//         handleSubmit,
//         reset,
//     } = useForm()
//     const userData = JSON.parse(localStorage.getItem("userData"))

//     const onSubmit = async (data) => {
//         return MySwal.fire({
//             title: "Bạn có chắc chắn muốn đổi mật khẩu không?",
//             text: "Kiểm tra kỹ trước khi đổi!",
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonText: "Tiếp tục",
//             cancelButtonText: "Hủy",
//             customClass: {
//                 confirmButton: `btn btn-primary mr-1`,
//                 cancelButton: "btn btn-outline-dark",
//             },
//             buttonsStyling: false,
//         }).then(function (result) {
//             if (result.value) {
//                 setLoading(true)
//                 const dataSubmit = {
//                     userID: userData?._id,
//                     oldPassword: data.oldPassword,
//                     newPassword: data.newPassword_,
//                 }
//                 changePass(dataSubmit)
//                     .then((response) => {
//                         if (response?.status === false) {
//                             MySwal.fire({
//                                 icon: "error",
//                                 title: response?.message || "Đổi mật khẩu thất bại!",
//                                 text: "Vui lòng thử lại",
//                                 customClass: {
//                                     confirmButton: "btn btn-danger",
//                                 },
//                             })
//                         } else {
//                             MySwal.fire({
//                                 icon: "success",
//                                 title: "Đổi mật khẩu thành công!",
//                                 //   
//                                 customClass: {
//                                     confirmButton: "btn btn-success",
//                                 },
//                             })
//                             setLoading(false)
//                             reset()
//                             setPass({
//                                 newPassword: "",
//                                 newPassword_: "",
//                             })
//                         }
//                     })
//                     .catch((error) => {
//                         MySwal.fire({
//                             icon: "error",
//                             title: "Đổi mật khẩu thất bại!",
//                             text: "Vui lòng thử lại",
//                             customClass: {
//                                 confirmButton: "btn btn-danger",
//                             },
//                         })
//                     })
//                 setLoading(false)
//             }
//         })
//     }

//     return (
//         <Card style={{ minHeight: "75vh", backgroundColor: "white" }}>
//             <CardTitle
//                 style={{
//                     marginTop: "20px",
//                     textAlign: "center",
//                 }}
//             >
//                 <h3 style={{ color: "#09a863" }}>Cấu hình tham số hệ thống</h3>
//             </CardTitle>
//             <Form
//                 className="auth-login-form mt-1"
//                 style={{
//                     width: "50%",
//                     margin: "auto",
//                     padding: "20px",
//                     border: "1px solid #ccc",
//                     borderRadius: "5px",
//                     backgroundColor: "#fffaff",
//                 }}
//                 onSubmit={handleSubmit(onSubmit)}
//             >
//                 <FormGroup className="customMb2">
//                     <Label for="oldPassword" className="labelForm">
//                         Mức độ trùng lặp đánh giá đạo văn (%)<span className="redColor">(*)</span>
//                     </Label>
//                     <input
//                         type="text"
//                         name="oldPassword"
//                         id="oldPassword"
//                         className={`${classnames({
//                             "is-invalid": errors.oldPassword,
//                         })} inputForm`}
//                         {...register("oldPassword", { required: true })}
//                         placeholder="Nhập mức độ"
//                     />
//                     {errors && errors.oldPassword && (
//                         <FormText color="danger">Vui lòng nhập mức độ</FormText>
//                     )}
//                 </FormGroup>
//                 {/* <FormGroup className="customMb2">
//                     <Label for="newPassword" className="labelForm">
//                         Mật khẩu mới<span className="redColor">(*)</span>
//                     </Label>
//                     <input
//                         type="password"
//                         name="newPassword"
//                         id="newPassword"
//                         className={`${classnames({
//                             "is-invalid": errors.newPassword,
//                         })}} inputForm`}
//                         {...register("newPassword", { required: true })}
//                         placeholder="Nhập mật khẩu mới tại đây"
//                         onBlur={(e) => {
//                             setPass({
//                                 ...pass,
//                                 newPassword: e.target.value,
//                             })
//                         }}
//                     />
//                     {errors && errors.newPassword && (
//                         <FormText color="danger">Vui lòng nhập mật khẩu mới</FormText>
//                     )}
//                 </FormGroup>
//                 <FormGroup>
//                     <Label for="newPassword_" className="labelForm">
//                         Nhập lại mật khẩu mới<span className="redColor">(*)</span>
//                     </Label>
//                     <input
//                         type="password"
//                         name="newPassword_"
//                         id="newPassword_"
//                         className={`${classnames({
//                             "is-invalid": errors.newPassword_,
//                         })}} inputForm`}
//                         {...register("newPassword_", { required: true })}
//                         placeholder="Nhập lại mật khẩu mới tại đây"
//                         value={pass.newPassword_}
//                         onChange={(e) => {
//                             setPass({
//                                 ...pass,
//                                 newPassword_: e.target.value,
//                             })
//                         }}
//                     />
//                     {pass.newPassword_ !== "" &&
//                         pass.newPassword_ !== pass.newPassword && (
//                             <FormText color="danger">Mật khẩu mới không khớp</FormText>
//                         )}
//                 </FormGroup> */}
//                 {/* <FormGroup style={{ textAlign: "center", marginBottom: '2rem' }}> */}
//                 <Button.Ripple
//                     type="submit"
//                     color="#09a863"
//                     style={{
//                         backgroundColor: "#09a863",
//                         display: 'flex',
//                         margin: 'auto'
//                     }}
//                     disabled={loading}
//                 >
//                     {loading ? (
//                         <div className="loader"></div>
//                     ) : (
//                         <span style={{ color: "#fff" }}>Lưu thay đổi</span>
//                     )}
//                 </Button.Ripple>
//                 {/* </FormGroup> */}
//             </Form>
//         </Card>
//     )
// }

// export default ChangePass

import React, { useEffect, useState } from 'react'
import { Form, Input, InputNumber, Popconfirm, Table, Tooltip, Typography, Card } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Check, X } from 'react-feather'
import { Button, Col } from 'reactstrap'
import AddNewParameter from './modal/AddNewModal'
import { deleteSystemParameter, editSystemParameter, getSystemParameter } from '../../../../api/system_parameter'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
// const originData = [
//     {
//         key: 1,
//         name: 'Ngưỡng trùng lặp câu',
//         code: `THRESHOLDSENTENCE`,
//         value: 20,
//         description: `Dùng cho việc phân loại các tài liệu có câu trùng nhiều`,
//     },
//     {
//         key: 2,
//         name: 'Ngưỡng trùng lặp văn bản',
//         code: `THRESHOLDTEXT`,
//         value: 30,
//         description: `Dùng cho các văn bản có độ trùng lặp cao`,
//     },
//     {
//         key: 3,
//         name: 'Độ dài câu so sánh',
//         code: `COMPAREDLENGTH`,
//         value: 100,
//         description: `Ngưỡng thấp nhất số ký tự của một câu đem ra so sánh`,
//     },
//     {
//         key: 4,
//         name: 'Có bỏ qua câu trích dẫn hay không',
//         code: `STATUSQUOTE`,
//         value: 32,
//         description: `Phần trăm trùng lặp có tính cả câu trích dẫn hay không`,
//     },
//     {
//         key: 5,
//         name: 'Họ tên người ký',
//         code: `SIGNATURENAME`,
//         value: 32,
//         description: `Tên của người chịu trách nhiệm cho quá trình kiểm tra`,
//     },
//     {
//         key: 6,
//         name: 'Chức vụ người ký',
//         code: `SIGNATUREPOSITION`,
//         value: 32,
//         description: `Chức vụ của người chịu trách nhiệm cho quá trình kiểm tra`,
//     }
// ]

const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `Vui lòng nhập ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    )
}
const App = () => {
    const MySwal = withReactContent(Swal)
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerpage] = useState(10)
    const [form] = Form.useForm()
    const [data, setData] = useState([])
    const [count, setCount] = useState()
    const [editingKey, setEditingKey] = useState('')
    const [isHidden, setIsHidden] = useState(false)
    const [modalParameter, setModalParameter] = useState(false)

    const getData = () => {
        getSystemParameter().then(res => {
            setData(res.data)
        })
    }

    useEffect(() => {
        getData()
    }, [])

    const isEditing = (record) => record.key === editingKey
    const edit = (record) => {
        const editValue = form.setFieldsValue({
            name: record.name,
            code: record.code,
            value: record.value,
            description: record.description,
            ...record
        })
        setEditingKey(record.key)
        setIsHidden(true)
    }
    const cancel = () => {
        setEditingKey('')
        setIsHidden(false)
    }
    const save = async (id) => {
        editSystemParameter(id, {
            name: form.getFieldValue('name'),
            code: form.getFieldValue('code'),
            value: form.getFieldValue('value'),
            description: form.getFieldValue('description')
        }).then(result => {
            if (result.status === 'success') {
                Swal.fire({
                    title: "Cập nhật tham số thành công",
                    text: "",
                    icon: "success",
                    customClass: {
                        confirmButton: "btn btn-success"
                    }
                })
            } else {
                Swal.fire({
                    title: "Cập nhật tham số thất bại",
                    text: "Vui lòng kiểm tra lại thông tin!",
                    icon: "error",
                    customClass: {
                        confirmButton: "btn btn-danger"
                    }
                })
            }
            getData()
        }).catch(error => {
            Swal.fire({
                title: "Cập nhật tham số thất bại",
                text: `Có lỗi xảy ra - ${error.message}!`,
                icon: "error",
                customClass: {
                    confirmButton: "btn btn-danger"
                }
            })
        })
    }

    const handleDelete = (id) => {
        deleteSystemParameter(id)
            .then((res) => {
                MySwal.fire({
                    title: "Xóa tham số thành công",
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
                    title: "Xóa tham số thất bại",
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
            title: 'Tên tham số',
            dataIndex: 'name',
            width: '30%',
            editable: true,
        },
        {
            title: 'Tên viết tắt',
            dataIndex: 'code',
            align: 'center',
            width: '15%',
            editable: true,
        },
        {
            title: 'Giá trị',
            dataIndex: 'value',
            align: 'center',
            width: '10%',
            editable: true,
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            width: '35%',
            editable: true,
        },
        {
            title: 'Thao tác',
            dataIndex: 'action',
            align: 'center',
            width: '25%',
            render: (_, record) => {
                const editable = isEditing(record)
                return (
                    <>
                        {
                            editable ? (
                                <span>
                                    <Typography.Link
                                        onClick={() => {
                                            save(record.id)
                                        }}
                                        style={{
                                            marginInlineEnd: 8,
                                        }}
                                    >
                                        <Tooltip placement='top' title='Lưu'>
                                            <Check style={{ color: "#09A863", cursor: 'pointer' }} />
                                        </Tooltip>
                                    </Typography.Link>
                                    <Popconfirm title="Bạn có chắc chắn muốn hủy không?" onConfirm={cancel}>
                                        <Tooltip placement='top' title='Không lưu'>
                                            <a><X style={{ color: "red", cursor: 'pointer' }} /></a>
                                        </Tooltip>
                                    </Popconfirm>
                                </span>
                            ) : (
                                <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                                    <Tooltip placement='top' title='Chỉnh sửa'>
                                        <EditOutlined
                                            style={{ color: "#09A863", cursor: 'pointer', marginRight: '12px' }}
                                        />
                                    </Tooltip>
                                </Typography.Link>
                            )
                        }
                        {
                            !editable && data.length >= 1 ? (
                                <Popconfirm title="Bạn có chắc chắn muốn xóa không?" onConfirm={() => {
                                    handleDelete(record.id)
                                }}>
                                    <a><DeleteOutlined style={{ color: "red", cursor: 'pointer' }} /></a>
                                </Popconfirm>
                            ) : null
                        }
                    </>
                )
            },
        },
    ]
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        }
    })

    const handleModal = () => {
        setModalParameter(false)
    }

    return (
        <>
            <Card
                title="Cấu hình tham số hệ thống"
                style={{ backgroundColor: "white", width: "100%", height: "100%" }}
            >
                <Form form={form} component={false}>
                    <Col md="12" style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button
                            onClick={() => setModalParameter(true)}
                            color="primary"
                            style={{
                                width: '100px',
                                marginBottom: '10px',
                                padding: '8px 15px'
                            }}
                        >
                            Thêm mới
                        </Button>
                    </Col>
                    <Table
                        components={{
                            body: {
                                cell: EditableCell,
                            },
                        }}
                        bordered
                        dataSource={data}
                        columns={mergedColumns}
                        rowClassName="editable-row"
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
                </Form>
            </Card>
            <AddNewParameter open={modalParameter} handleModal={handleModal} getData={getData} />
        </>
    )
}
export default App