import { Table, Input, Card, CardTitle, Tag, Popconfirm, Switch, Select, Spin, Tooltip, DatePicker } from "antd"
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
    DropdownMenu,
    DropdownItem,
    DropdownToggle,
    UncontrolledButtonDropdown,
    UncontrolledDropdown
} from "reactstrap"
import { useSelector, useDispatch } from 'react-redux'

import { Plus, X, File } from "react-feather"
import { DeleteOutlined, EditOutlined, LockOutlined } from "@ant-design/icons"
// import style from "../../../../assets/scss/index.module.scss"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
// import Select from "react-select"
import * as yup from "yup"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import classnames from "classnames"
import { AbilityContext } from '@src/utility/context/Can'
import { deleteDocument, getDocument } from "../../../api/document_citation"
import { toDateString, toDateStringv2, toDateTimeString } from "../../../utility/Utils"
import { getCourse } from "../../../api/course"
import { getDocumentType } from "../../../api/document_type"
import { getMajor } from "../../../api/major"
import Flatpickr from "react-flatpickr"
import { Vietnamese } from "flatpickr/dist/l10n/vn.js"
import "@styles/react/libs/flatpickr/flatpickr.scss"
import dayjs from "dayjs"
import readXlsxFile from 'read-excel-file/web-worker'

const oneWeekAgo = new Date()
oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

const { RangePicker } = DatePicker

const Document = () => {
    const { listDataImport, selectedYear } = useSelector(state => state.ecommerce)
    const inputFile = useRef(null)
    const inputFolder = useRef(null)
    const [loadingData, setLoadingData] = useState(false)
    const ability = useContext(AbilityContext)
    const MySwal = withReactContent(Swal)
    const [data, setData] = useState([])
    const [count, setCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerpage] = useState(10)
    const [search, setSearch] = useState("")
    const [courseId, setCourseId] = useState()
    const [typeId, setTypeId] = useState()
    const [majorId, setMajorId] = useState()
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    const [isAdd, setIsAdd] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [info, setInfo] = useState()
    const [listImport, setListImport] = useState()
    const [listCourse, setListCourse] = useState([])
    const [listDocumentType, setListDocumentType] = useState([])
    const [listMajor, setListMajor] = useState([])
    const [modalImportFile, setModalImportFile] = useState(false)
    const [loading, setLoading] = useState(false)
    const [files, setFiles] = useState([])
    const [modalPreview, setModalPreview] = useState(false)
    const [fileExcel, setFileExcel] = useState()
    const [isAddExcel, setIsAddExcel] = useState(false)
    const handleModalAddExcel = () => {
        setIsAddExcel(!isAddExcel)
    }

    const getAllDataPromises = async () => {
        const coursePromise = getCourse({ params: { page: 1, perPage: 10, search: '' } })
        const documentTypePromise = getDocumentType({ params: { page: 1, perPage: 10, search: '' } })
        const majorPromise = getMajor({ params: { page: 1, perPage: 10, search: '' } })

        const promises = [coursePromise, documentTypePromise, majorPromise]
        const results = await Promise.allSettled(promises)
        const responseData = promises.reduce((acc, promise, index) => {
            if (results[index].status === 'fulfilled') {
                acc[index] = results[index].value
            } else {
                acc[index] = { error: results[index].reason }
            }
            return acc
        }, [])

        const courseRes = responseData[0]
        const documentTypeRes = responseData[1]
        const majorRes = responseData[2]
        results.map((res) => {
            if (res.status !== 'fulfilled') {
                setListCourse(null)
                setListDocumentType(null)
                setListMajor(null)
            }
        })
        const courses = courseRes?.data?.map((res) => {
            return {
                value: res.id,
                label: `${res.name}`
            }
        })
        const documentTypes = documentTypeRes?.data?.map((res) => {
            return {
                value: res.id,
                label: `${res.name}`
            }
        })
        const majors = majorRes?.data?.map((res) => {
            return {
                value: res.id,
                label: `${res.name}`
            }
        })
        setListCourse(courses)
        setListDocumentType(documentTypes)
        setListMajor(majors)
    }

    const getData = (page, limit, search, courseId, typeIds, majorIds, startDate, endDate) => {
        setLoadingData(true)
        getDocument({
            params: {
                page,
                perPage: limit,
                ...(search && search !== "" && { search }),
                ...(courseId && { courseId }),
                ...(typeIds && { typeIds }),
                ...(majorIds && { majorIds }),
                ...(startDate && { startDate }),
                ...(endDate && { endDate })
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
        if ((startDate && endDate) || (!startDate && !endDate)) {
            getData(currentPage, rowsPerPage, search, courseId, typeId, majorId, startDate, endDate)
        }
    }, [currentPage, rowsPerPage, search, courseId, typeId, majorId, startDate, endDate])

    useEffect(() => {
        getAllDataPromises()
    }, [])

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

    const handleDelete = (key) => {
        deleteDocument(key)
            .then((res) => {
                MySwal.fire({
                    title: "Xóa tài liệu thành công",
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
                    title: "Xóa tài liệu thất bại",
                    icon: "error",
                    customClass: {
                        confirmButton: "btn btn-danger",
                    },
                })
                console.log(error)
            })
    }

    const handleChangeCourse = (value) => {
        if (value) {
            setCourseId(value)
        } else {
            setCourseId()
        }
    }

    const handleChangeDocumentType = (value) => {
        if (value) {
            setTypeId(value.join(','))
        } else {
            setTypeId()
        }
    }

    const handleChangeMajor = (value) => {
        if (value) {
            setMajorId(value.join(','))
        } else {
            setMajorId()
        }
    }

    const handleChangeDate = (value) => {
        if (value) {
            setStartDate(toDateStringv2(value[0]))
            setEndDate(toDateStringv2(value[1]))
        } else {
            setStartDate()
            setEndDate()
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
            title: "Tiêu đề",
            dataIndex: "title",
            align: 'left',
            width: 500,
            render: (text, record, index) => (
                <span style={{ whiteSpace: 'break-spaces' }}>{record.title}</span>
            ),
        },
        {
            title: "Tác giả",
            dataIndex: "author",
            align: 'left',
            width: 200,
            render: (text, record, index) => (
                <span style={{ whiteSpace: 'break-spaces' }}>{record.author}</span>
            ),
        },
        {
            title: "Loại tài liệu",
            dataIndex: "documentType",
            align: 'left',
            width: 200,
            render: (text, record, index) => (
                <span style={{ whiteSpace: 'break-spaces' }}>{record?.documentType?.name}</span>
            ),
        },
        {
            title: "Lĩnh vực",
            dataIndex: "major",
            align: 'left',
            width: 200,
            render: (text, record, index) => (
                <span style={{ whiteSpace: 'break-spaces' }}>{record?.major?.name}</span>
            ),
        },
        {
            title: "Năm công bố",
            dataIndex: "publish_date",
            align: 'left',
            width: 150,
            render: (text, record, index) => (
                <span style={{ whiteSpace: 'break-spaces' }}>{toDateString(record?.publish_date)}</span>
            ),
        },
        {
            title: "Ngày tạo",
            dataIndex: "created_at",
            align: 'center',
            width: 150,
            render: (text, record, index) => (
                <span>{toDateTimeString(record.createdAt)}</span>
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
            title: "Thao tác",
            width: 100,
            align: "center",
            render: (record) => (
                <div style={{ display: "flex", justifyContent: "center" }}>
                    {ability.can('update', 'QL_KHO_TAI_LIEU_MAU') &&
                        <>
                            <Tooltip placement="top" title="Chỉnh sửa">
                                <EditOutlined
                                    // id={`tooltip_edit${record.ID}`}
                                    style={{ color: "#09A863", cursor: 'pointer', marginRight: '1rem' }}
                                    onClick={() => handleEdit(record)}
                                />
                            </Tooltip>
                        </>}
                    {ability.can('delete', 'QL_KHO_TAI_LIEU_MAU') &&
                        <Popconfirm
                            title="Bạn chắc chắn xóa?"
                            onConfirm={() => handleDelete(record.id)}
                            cancelText="Hủy"
                            okText="Đồng ý"
                        >
                            <Tooltip placement="top" title="Xóa">
                                <DeleteOutlined style={{ color: "red", cursor: 'pointer' }} id={`tooltip_delete${record.ID}`} />
                            </Tooltip>
                        </Popconfirm>}
                </div>
            ),
        },
    ]

    const currentYear = new Date().getFullYear()

    const handleChangeTime = (dates) => {
        if (dates) {
            setStartDate(dayjs(dates[0], 'YYYY-MM-DD'))
            setEndDate(dayjs(dates[1], 'YYYY-MM-DD'))
        } else {
            setStartDate(dayjs(`${currentYear}-01-01`))
            setEndDate(dayjs(`${currentYear}-12-31`))
        }
    }

    const handleImportFile = (e) => {
        const files = e.target.files[0]
        setFileExcel(files)
        readXlsxFile(files).then((rows) => {
            const temp = []
            rows.forEach((item, index) => {
                if (index > 0) {
                    temp.push(item)
                }
            })
            setListImport(temp)
            setModalImportFile(true)
        }).catch(error => {
            MySwal.fire({
                icon: "error",
                title: "Có lỗi xảy ra",
                text: "File không đúng định dạng, vui lòng chọn file định dạng excel và nhập đúng các cột",
                customClass: {
                    confirmButton: "btn btn-danger"
                }
            })
        })

    }
    const onImportFileClick = () => {
        // `current` points to the mounted file input element
        // inputFile.current.click()
        setIsAddExcel(true)
    }
    const onImportFolder = async () => {
        if (listDataImport?.length === 0 || !listDataImport) {
            MySwal.fire({
                icon: "warning",
                title: "Có lỗi xảy ra",
                text: "Vui lòng nhập file danh sách các tài liệu!",
                customClass: {
                    confirmButton: "btn btn-danger"
                }
            })
            return
        }
        setModalPreview(true)
        // const datasource = await fetchDataForExport(getAllDanhSach)
        // setDataSource(datasource.result.data)
        // `current` points to the mounted file input element
        inputFolder.current.click()
    }
    const onImportFileTemplate = async () => {
        const urlString = `${process.env.REACT_APP_URL_TAMS}/templates/file_nhap_mau.xlsx`
        const link = document.createElement('a')
        link.href = urlString
        link.setAttribute('download', 'file_nhap_mau.xlsx')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }
    const handleModalImportFile = () => setModalImportFile(!modalImportFile)
    const handleModalPreview = () => setModalPreview(!modalPreview)

    const handleFolderUpload = (event) => {
        const fileList = event.target.files
        const fileArray = Array.from(fileList)

        // Lưu trữ các file đã upload
        setFiles(fileArray)
    }
    return (
        <Card
            title="Danh sách tài liệu"
            style={{ backgroundColor: "white", width: "100%", height: "100%" }}
        >
            <input type='file' id='file' ref={inputFile} style={{ display: 'none' }} onChange={e => handleImportFile(e)} />
            {/* <input type='file' id='file' ref={inputFolder} style={{ display: 'none' }} multiple onChange={e => handleImportFileZip(e)} /> */}
            <input
                ref={inputFolder}
                type="file"
                webkitdirectory="true"
                multiple
                onChange={handleFolderUpload}
                style={{ display: 'none' }}
            />
            <Row style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", height: "40px" }} className="mb-1">
                <Col className="col col-2" style={{ display: "flex", justifyContent: "flex-end" }}>
                    <UncontrolledButtonDropdown style={{ width: "120px" }}>
                        <DropdownToggle color='secondary' caret outline>
                            <File size={15} />
                            <span className='align-middle ms-50'>Nhập tài liệu</span>
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem className='w-100' onClick={onImportFileTemplate}>
                                <span className='align-middle ms-50'>Tải file mẫu</span>
                            </DropdownItem>
                            <DropdownItem className='w-100' onClick={onImportFileClick}>
                                <span className='align-middle ms-50'>Nhập danh sách tài liệu từ file excel</span>
                            </DropdownItem>
                            {/* <DropdownItem className='w-100' onClick={onImportFolder}>
                                <span className='align-middle ms-50'>Tải tài liệu từ thư mục</span>
                            </DropdownItem> */}
                        </DropdownMenu>
                    </UncontrolledButtonDropdown>
                </Col>
                <Col className="col col-2" style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                        // className='ms-2' color='primary'
                        onClick={(e) => setIsAdd(true)}
                        color="primary"
                        className="ms-2"
                        style={{
                            width: '115px',
                            height: "40px",
                            // padding: "8px 15px!important"
                        }}
                    >
                        {/* <Plus size={15} className="mr-2" style={{ marginRight: "2px" }} /> */}
                        Thêm mới
                    </Button>
                </Col>
                {/* </Col> */}
            </Row>
            <Row>
                <Col sm="10" style={{ display: "flex" }}>
                    <Col sm="3" className="mr-1" style={{ display: "flex", justifyContent: "flex-end" }}>
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
                    <Col sm="3" className="mr-1" style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Select
                            placeholder="Chọn loại tài liệu"
                            className='mb-50 select-custom'
                            options={listDocumentType}
                            allowClear
                            mode="multiple"
                            onChange={(value) => handleChangeDocumentType(value)}
                        />
                    </Col>
                    <Col sm="3" className="mr-1" style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Select
                            placeholder="Chọn lĩnh vực"
                            className='mb-50 select-custom'
                            options={listMajor}
                            allowClear
                            mode="multiple"
                            onChange={(value) => handleChangeMajor(value)}
                        />
                    </Col>
                    <Col
                        sm="3"
                        style={{ display: "flex", justifyContent: "flex-start" }}
                    >
                        <Label
                            className=""
                            style={{
                                width: "90px",
                                fontSize: "14px",
                                height: "34px",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            Ngày tạo
                        </Label>
                        {/* <Flatpickr
                            style={{ padding: '0.35rem 1rem' }}
                            className="form-control invoice-edit-input date-picker mb-50"
                            options={{
                                mode: "range",
                                dateFormat: "d-m-Y", // format ngày giờ
                                locale: {
                                    ...Vietnamese
                                },
                                defaultDate: [oneWeekAgo, new Date()]
                            }}
                            placeholder="dd/mm/yyyy"
                            onChange={(value => handleChangeDate(value))}
                        /> */}
                        <RangePicker
                            style={{
                                width: "100%",
                                height: '80%'
                            }}
                            // defaultValue={[dayjs(`${currentYear}-01-01`), dayjs(`${currentYear}-12-31`)]}
                            format={"DD-MM-YYYY"}
                            allowClear={true}
                            onChange={handleChangeTime}
                        />
                    </Col>
                </Col>

            </Row>
            {
                loadingData === true ? <Spin style={{ position: 'relative', left: '50%' }} /> : <Table
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
            }

            <AddNewModal
                open={isAdd}
                handleModal={handleModal}
                getData={getData}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
            />
            <SelectCourseModal
                open={isAddExcel}
                handleModal={handleModalAddExcel}
                getData={getData}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
            // file
            />
            {
                info && <EditModal
                    open={isEdit}
                    handleModal={handleModal}
                    getData={getData}
                    infoEdit={info}
                    currentPage={currentPage}
                    rowsPerPage={rowsPerPage}
                />
            }
        </Card >
    )
}

const AddNewModal = React.lazy(() => import("./modal/AddNewModal"))
const EditModal = React.lazy(() => import("./modal/EditModal"))
const SelectCourseModal = React.lazy(() => import("./modal/modalSelectCourse"))

export default Document 
