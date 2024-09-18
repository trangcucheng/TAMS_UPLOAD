import {
    Table,
    Input,
    Card,
    Tag,
    Popconfirm,
    Switch,
    Collapse,
    Spin,
    Select,
    Tooltip,
    Dropdown,
    Space
} from "antd"
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
    CardBody,
    CardTitle,
    Spinner,
} from "reactstrap"
import { Link, NavLink, useLocation, useNavigate, useParams } from "react-router-dom"
import { Plus, X } from "react-feather"
import {
    AppstoreAddOutlined,
    DeleteOutlined,
    DownCircleFilled,
    DownCircleOutlined,
    DownloadOutlined,
    DownOutlined,
    EditOutlined,
    LockOutlined,
    RightCircleOutlined,
    RightSquareOutlined,
    UnorderedListOutlined,
} from "@ant-design/icons"
import { AbilityContext } from '@src/utility/context/Can'
// import style from "../../../../assets/scss/index.module.scss"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import AvatarGroup from "@components/avatar-group"
import * as yup from "yup"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import classnames from "classnames"
import { toDateString, toDateTimeString } from "../../../utility/Utils"
import { deleteCheckingDocument, getCheckingDocument } from "../../../api/checking_document"
import ContentModal from "./modal/ContentModal"
import { getCheckingResult, getSimilarDocument, getTop3SimilarDocument } from "../../../api/checking_result"
import { getCourse } from "../../../api/course"
import { PAGE_DEFAULT, PER_PAGE_DEFAULT } from "../../../utility/constant"
import { downloadFileCheckingDocumentVersion, getDuplicateCheckingDocumentVersion, getSimilarityReport } from "../../../api/checking_document_version"

const CheckingResult = () => {
    const [loadingData, setLoadingData] = useState(false)
    const [loadingData2, setLoadingData2] = useState(false)
    const ability = useContext(AbilityContext)
    const selected = useRef()
    const MySwal = withReactContent(Swal)
    const [data, setData] = useState([])
    const [data2, setData2] = useState([])
    const [count, setCount] = useState(0)
    const [count2, setCount2] = useState(0)
    const [totalUser, setTotalUser] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerpage] = useState(10)
    const [courseId, setCourseId] = useState()
    const [search, setSearch] = useState("")
    const [isAdd, setIsAdd] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [isPer, setIsPer] = useState(false)
    const [isView, setIsView] = useState(false)
    const [listPerGroup, setListPerGroup] = useState([])
    const [permissionView, setPermissionView] = useState([])
    const [listAllPer, setListAllPer] = useState([])
    const [listPermissionSelected, setListPermissionSelected] = useState([])
    const [checkingDocumentSelected, setCheckingDocumentSelected] = useState()
    const [selectedCourse, setSelectedCourse] = useState()
    const [isLoadingDownload, setIsLoadingDownload] = useState(false)
    const [isLoadingReport, setIsLoadingReport] = useState(false)
    const [loadingId, setLoadingId] = useState(null)

    const [listCourse, setListCourse] = useState([])

    const location = useLocation()
    const navigate = useNavigate()

    const getAllDataPromises = async () => {
        const coursePromise = getCourse({ params: { page: PAGE_DEFAULT, perPage: PER_PAGE_DEFAULT, search: '' } })

        const promises = [coursePromise]
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
        results.map((res) => {
            if (res.status !== 'fulfilled') {
                setListCourse(null)
            }
        })
        const courses = courseRes?.data?.map((res) => {
            return {
                value: res.id,
                label: `${res.name}`
            }
        })
        setListCourse(courses)
    }

    const params = useParams()
    const getData = () => {
        setLoadingData(true)
        getDuplicateCheckingDocumentVersion(Number(params?.id))
            .then((res) => {
                const result = res?.data?.map(((item, index) => {
                    return { ...item, _id: item.id, key: index }
                }))
                setData(result)
                setCount(res?.total)
            })
            .catch((err) => {
                console.log(err)
            }).finally(() => {
                setLoadingData(false)
            })
    }

    const getDataSameCourse = (courseId) => {
        setLoadingData2(true)
        getSimilarDocument(Number(params?.id), {
            params: {
                courseId
            }
        })
            .then((res) => {
                const result = res?.data?.map(((item, index) => {
                    return { ...item, _id: item.id, key: index }
                }))
                setData2(result)
                setSelectedCourse(result[0].document.course.id)
                setCount2(res?.total)
            })
            .catch((err) => {
                console.log(err)
            }).finally(() => {
                setLoadingData2(false)
            })
    }

    useEffect(() => {
        getDataSameCourse(courseId)
    }, [params?.id, courseId])

    useEffect(() => {
        getAllDataPromises()
        getData()
    }, [params?.id])

    const handleModal = () => {
        setIsAdd(false)
        setIsEdit(false)
        setIsPer(false)
        setIsView(false)
        setCheckingDocumentSelected(null)
    }
    const CloseBtn = (
        <X className="cursor-pointer" size={15} onClick={handleModal} />
    )
    const handleViewUser = (role) => {
        setRoleSelected(role)
        setIsView(true)
    }
    const handleDelete = (key) => {
        deleteCheckingDocument(key)
            .then((res) => {
                MySwal.fire({
                    title: "Xóa kiểm tra tài liệu thành công",
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
                    handleModal()
                })
            })
            .catch((error) => {
                MySwal.fire({
                    title: "Xóa thất bại",
                    icon: "error",
                    customClass: {
                        confirmButton: "btn btn-danger",
                    },
                })
                console.log(error)
            })
    }

    const rowClassName = (record) => {
        if (record.similarity > 50) {
            return 'highlighted-row'
        }
        return ''
    }

    const handleButtonClick = (record) => {
        navigate(`/tams/detail-result/${record?.id}`, { state: record })
    }

    const handleButtonClick2 = (record) => {
        navigate(`/tams/detail-result2/${record?.id}`, { state: record })
    }

    const handleDownloadFile = (id) => {
        setIsLoadingDownload(true)
        setLoadingId(id)
        downloadFileCheckingDocumentVersion(id)
            .then(res => {
                const originalURL = window.URL.createObjectURL(new Blob([res]))
                const link = document.createElement('a')
                link.href = originalURL
                link.setAttribute('download', `Tài liệu kiểm tra.docx`)
                document.body.appendChild(link)
                link.click()
            })
            .catch(error => {
                console.log(error)
            }).finally(() => {
                setIsLoadingDownload(false)
                setLoadingId(null)
            })
    }

    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
            width: 30,
            align: "center",
            render: (text, record, index) => {
                if (record?.similarity >= 50) {
                    return (
                        <span style={{ color: 'red', fontWeight: '600' }}>{((currentPage - 1) * rowsPerPage) + index + 1}</span>
                    )
                } else if (record?.similarity >= 30 && record?.similarity < 50) {
                    return (
                        <span style={{ color: 'yellowgreen', fontWeight: '600' }}>{((currentPage - 1) * rowsPerPage) + index + 1}</span>
                    )
                } else {
                    return (
                        <span>{((currentPage - 1) * rowsPerPage) + index + 1}</span>
                    )
                }
            }
        },
        {
            title: "Tên tài liệu mẫu",
            dataIndex: "title",
            width: 500,
            align: "left",
            render: (text, record, index) => {
                if (record?.similarity >= 50) {
                    return (
                        <span style={{ whiteSpace: 'break-spaces', color: 'red', fontWeight: '600' }}>{record?.document?.title}</span>
                    )
                } else if (record?.similarity >= 30 && record?.similarity < 50) {
                    return (
                        <span style={{ color: 'yellowgreen', fontWeight: '600' }}>{record?.document?.title}</span>
                    )
                } else {
                    return (
                        <span>{record?.document?.title}</span>
                    )
                }
            }
        },
        {
            title: "Tác giả",
            dataIndex: "author",
            width: 180,
            align: "left",
            render: (text, record, index) => {
                if (record?.similarity >= 50) {
                    return (
                        <span style={{ whiteSpace: 'break-spaces', color: 'red', fontWeight: '600' }}>{record?.document?.author}</span>
                    )
                } else if (record?.similarity >= 30 && record?.similarity < 50) {
                    return (
                        <span style={{ color: 'yellowgreen', fontWeight: '600' }}>{record?.document?.author}</span>
                    )
                } else {
                    return (
                        <span>{record?.document?.author}</span>
                    )
                }
            }
        },
        {
            title: "Lĩnh vực",
            dataIndex: "course",
            width: 150,
            align: "left",
            render: (text, record, index) => {
                if (record?.similarity >= 50) {
                    return (
                        <span style={{ whiteSpace: 'break-spaces', color: 'red', fontWeight: '600' }}>{record?.document?.major?.name}</span>
                    )
                } else if (record?.similarity >= 30 && record?.similarity < 50) {
                    return (
                        <span style={{ color: 'yellowgreen', fontWeight: '600' }}>{record?.document?.major?.name}</span>
                    )
                } else {
                    return (
                        <span>{record?.document?.major?.name}</span>
                    )
                }
            }
        },
        {
            title: "Loại tài liệu",
            dataIndex: "documentType",
            width: 120,
            align: "center",
            render: (text, record, index) => {
                if (record?.similarity >= 50) {
                    return (
                        <span style={{ whiteSpace: 'break-spaces', color: 'red', fontWeight: '600' }}>{record?.document?.documentType?.name}</span>
                    )
                } else if (record?.similarity >= 30 && record?.similarity < 50) {
                    return (
                        <span style={{ color: 'yellowgreen', fontWeight: '600' }}>{record?.document?.documentType?.name}</span>
                    )
                } else {
                    return (
                        <span>{record?.document?.documentType?.name}</span>
                    )
                }
            }
        },
        {
            title: "Độ trùng lặp (%)",
            width: 120,
            align: "center",
            render: (text, record, index) => {
                if (record?.similarity >= 50) {
                    return (
                        <span style={{ whiteSpace: 'break-spaces', color: 'red', fontWeight: '600' }}>{record?.similarity}</span>
                    )
                } else if (record?.similarity >= 30 && record?.similarity < 50) {
                    return (
                        <span style={{ color: 'yellowgreen', fontWeight: '600' }}>{record?.similarity}</span>
                    )
                } else {
                    return (
                        <span>{record?.similarity}</span>
                    )
                }
            }
        },
        {
            title: "Thao tác",
            width: 100,
            align: "center",
            render: (record) => (
                // <div style={{ display: "flex", justifyContent: "center" }}>
                <>
                    {
                        isLoadingDownload === true && loadingId === record.id ? <Spinner color="#fff" style={{width: '14px', height: '14px', backgroundColor: '#fff'}} /> : <Tooltip placement="top" title="Download file">
                            <DownloadOutlined
                                id={`tooltip_download_${record._id}`}
                                style={{ color: "#09A863", cursor: "pointer" }}
                                onClick={() => handleDownloadFile(record.id)}
                            />
                        </Tooltip>
                    }
                </>
                // </div>
            ),
        },
    ]

    const handleChangeCourse = (value) => {
        if (value) {
            setCourseId(value)
        } else {
            setCourseId()
        }
    }

    const [expandedRowKeys, setExpandedRowKeys] = useState([])

    const onExpand = (expanded, record) => {
        setExpandedRowKeys(expanded ? [record.key] : [])
    }

    const handleReport = () => {
        setIsLoadingReport(true)
        getSimilarityReport({
            params: {
                checkingDocumentVersionId: Number(params.id)
            }
        })
            .then(res => {
                const originalURL = window.URL.createObjectURL(new Blob([res]))
                const link = document.createElement('a')
                link.href = originalURL
                link.setAttribute('download', `DS tài liệu trùng với phiên bản kiểm tra.excel`)
                document.body.appendChild(link)
                link.click()
            })
            .catch(error => {
                console.log(error)
            }).finally(() => {
                setIsLoadingReport(false)
            })
    }

    const items = [
        {
            label: 'Báo cáo DS trùng lặp theo khóa',
            key: '1',
            icon: <DownCircleFilled />,
        },
        {
            label: 'Báo cáo DS trùng lặp cao',
            key: '2',
            icon: <DownCircleOutlined />,
        }
    ]

    const menuProps = {
        items,
        onClick: handleReport,
    }

    return (
        <Fragment>
            <Card
                title="Kết quả kiểm tra tài liệu"
                style={{ backgroundColor: "white", width: "100%", height: "100%" }}
                extra={
                    <>

                    </>
                }
            >

                <Row>
                    <Col md="12" style={{ display: "flex", justifyContent: "flex-end", gap: 16 }}>
                        <Dropdown menu={menuProps}>
                            <Button color="primary">
                                <Space>
                                    Báo cáo
                                    {
                                        isLoadingReport === true ? <Spinner color="#fff" style={{width: '14px', height: '14px'}} /> : <DownOutlined />
                                    }
                                </Space>
                            </Button>
                        </Dropdown>
                        {/* {ability.can('create', 'PHAN_QUYEN_VAI_TRO') &&
                            <Button
                                onClick={handleReport}
                                color="primary"
                                className=""
                                style={{
                                    width: '120px',
                                    marginBottom: 0,
                                    padding: '8px 15px'
                                }}
                            >
                                Báo cáo {
                                    isLoadingReport === true ? <Spin /> : ''
                                }
                            </Button>
                        } */}
                        {ability.can('create', 'PHAN_QUYEN_VAI_TRO') &&
                            <Link to="/tams/checking-document">
                                <Button
                                    // onClick={(e) => setIsAdd(true)}
                                    color="primary"
                                    className=""
                                    style={{
                                        width: '100px',
                                        marginBottom: 0,
                                        // padding: '8px 15px'
                                    }}
                                    outline
                                >
                                    Quay lại
                                </Button>
                            </Link>
                        }
                    </Col>
                    <Col md="12" style={{ textAlign: 'center' }}>
                        <h5>Kết quả trùng lặp so với CSDL mẫu: <span style={{ color: 'red' }}>{location?.state?.checkingResult?.find(item => item.typeCheckingId === 1)?.similarityTotal}%</span></h5>
                    </Col>
                    <Col md="12">
                        <h6 style={{ textTransform: 'uppercase' }}>1. Danh sách các tài liệu mẫu có độ trùng lặp cao</h6>
                        <Row style={{ justifyContent: 'flex-end' }}>
                            <Col md="4" style={{ display: 'flex' }}>
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
                                // onChange={(e) => {
                                //     if (e.target.value === "") {
                                //         setSearch("")
                                //     }
                                // }}
                                // onKeyPress={(e) => {
                                //     if (e.key === "Enter") {
                                //         setSearch(e.target.value)
                                //         setCurrentPage(1)
                                //     }
                                // }}
                                />
                            </Col>
                        </Row>
                        {loadingData2 === true ? <Spin style={{ position: 'relative', left: '50%' }} /> : <Table
                            columns={columns}
                            dataSource={data2}
                            bordered
                            expandable={{
                                expandedRowRender: (record) => <ContentModal
                                    listSentenceByCheckingResult={record} />,
                                rowExpandable: (record) => record.name !== 'Not Expandable',
                                // expandRowByClick: true
                            }}
                            expandedRowKeys={expandedRowKeys}
                            onExpand={onExpand}
                            pagination={{
                                defaultPageSize: 30,
                                showSizeChanger: true,
                                pageSizeOptions: ["10", "20", "30"],
                                total: { count2 },
                                locale: { items_per_page: "/ trang" },
                                showSizeChanger: true,
                                showTotal: (total, range) => <span>Tổng số: {total}</span>,
                            }}
                        // rowClassName={rowClassName}
                        />}
                    </Col>
                    {
                        data && selectedCourse !== 1 ? <Col md="12">
                            <h6 style={{ textTransform: 'uppercase' }}>2. Kết quả trùng lặp với các tài liệu cùng đợt kiểm tra</h6>
                            {/* <Select options={listCourse} placeholder="Chọn đợt kiểm tra" className="mb-1" style={{ float: 'right', width: '200px' }} allowClear onChange={(value) => handleChangeCourse(value)} /> */}
                            {loadingData === true ? <Spin style={{ position: 'relative', left: '50%' }} /> : <Table
                                columns={columns}
                                dataSource={data}
                                bordered
                                expandable={{
                                    expandedRowRender: (record) => <ContentModal
                                        listSentenceByCheckingResult={record} />,
                                    rowExpandable: (record) => record.name !== 'Not Expandable',
                                    // expandRowByClick: true
                                }}
                                pagination={{
                                    defaultPageSize: 10,
                                    showSizeChanger: true,
                                    pageSizeOptions: ["10", "20", "30"],
                                    total: { count },
                                    locale: { items_per_page: "/ trang" },
                                    showSizeChanger: true,
                                    showTotal: (total, range) => <span>Tổng số: {total}</span>,
                                }}
                            // rowClassName={rowClassName}
                            />}
                        </Col> : <></>
                    }
                </Row>
            </Card>
        </Fragment>
    )
}
export default CheckingResult
