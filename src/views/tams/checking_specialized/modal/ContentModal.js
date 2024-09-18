import {
    Table,
    Input,
    Card,
    CardTitle,
    Tag,
    Popconfirm,
    Switch,
    Collapse,
    Checkbox,
    Spin,
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
} from "reactstrap"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Plus, X } from "react-feather"
import {
    AppstoreAddOutlined,
    DeleteOutlined,
    EditOutlined,
    LockOutlined,
    AppstoreOutlined

} from "@ant-design/icons"
import { AbilityContext } from "@src/utility/context/Can"
//   import style from "../../../../../assets/scss/index.module.scss"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
//   import { toDateString, integerToRoman } from "../../../../../utility/Utils"
import AvatarGroup from "@components/avatar-group"
import Select from "react-select"
import * as yup from "yup"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import classnames from "classnames"
import { deleteCheckingDocumentVersion, getCheckingDocumentVersion } from "../../../../api/checking_document_version"
import { detailCheckingDocument } from "../../../../api/checking_document"
import { getListSentenceByCheckingResult } from "../../../../api/checking_result_by_word"

const ContentModal = ({ listSentenceByCheckingResult }) => {
    const params = useParams()
    const [loadingData, setLoadingData] = useState(false)
    const navigate = useNavigate()
    const MySwal = withReactContent(Swal)
    const [listPerGroup, setListPerGroup] = useState([])
    const [permissionView, setPermissionView] = useState([])
    const [listAllPer, setListAllPer] = useState([])
    const [data, setData] = useState([])
    const [listSubmit, setListSubmit] = useState()
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerpage] = useState(10)
    const [count, setCount] = useState()
    const [search, setSearch] = useState()
    const [isAdd, setIsAdd] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [checkingDocumentVersionSelected, setCheckingDocumentVersionSelected] = useState()

    const getData = () => {
        setLoadingData(true)
        getListSentenceByCheckingResult({
            params: {
                idDoc: listSentenceByCheckingResult?.documentId,
                idCheckDoc: params?.id,
                type: 1
            }
        })
            .then((res) => {
                setData(res.data)
                setCount(res?.total)
            })
            .catch((err) => {
                console.log(err)
            }).finally(() => {
                setLoadingData(false)
            })
    }
    const handleModal = () => {
        setIsAdd(false)
        setIsEdit(false)
        setCheckingDocumentVersionSelected(null)
    }

    const handleEdit = (record) => {
        setCheckingDocumentVersionSelected(record)
        setIsEdit(true)
    }

    const handleResult = (record) => {
        navigate(`/tams/checking-result/${record?.id}`)
    }

    useEffect(() => {
        getData()
    }, [listSentenceByCheckingResult])

    const handleDelete = (record) => {
        deleteCheckingDocumentVersion(record?.id)
            .then((res) => {
                MySwal.fire({
                    title: "Xóa thành công",

                    icon: "success",
                    customClass: {
                        confirmButton: "btn btn-success",
                    },
                }).then((result) => {
                    getData()
                })
            })
            .catch((err) => {
                console.log(err)
                MySwal.fire({
                    title: "Xóa thất bại",
                    text: "Có lỗi xảy ra!",
                    icon: "error",
                    customClass: {
                        confirmButton: "btn btn-danger",
                    },
                }).then((result) => {
                    getData()
                })
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
            title: "Các câu trong tài liệu kiểm tra",
            dataIndex: "checkingDocumentSentence",
            align: "left",
            width: 500,
            render: (text, record, index) => (
                <span>{record?.checkingDocumentSentence?.content}</span>
            ),
        },
        {
            title: "Các câu trong tài liệu mẫu",
            dataIndex: "sentenceOrCheckingDocumentSentence_sententce",
            align: "left",
            width: 500,
            render: (text, record, index) => (
                <span>{record?.sentenceOrCheckingDocumentSentence_sententce?.content}</span>
            ),
        },
        {
            title: "Độ tương đồng",
            dataIndex: "content",
            align: "center",
            width: 100,
            render: (text, record, index) => (
                <span>{(record?.similarity * 100).toFixed(2)}%</span>
            ),
        }
    ]

    return (
        <Card
            title={`Danh sách các câu trùng`}
            style={{ backgroundColor: "white", width: "100%", height: "100%" }}
        >
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
        </Card>
    )
}
export default ContentModal

