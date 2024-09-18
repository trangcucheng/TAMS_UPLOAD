// ** React Imports
// ** Reactstrap Imports
import { useNavigate, useParams } from "react-router-dom"
import {
    Col,
    FormFeedback,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalHeader,
    Row,
    Button,
    Spinner
} from "reactstrap"
import {
    Table,
    Spin
} from "antd"
import { useEffect, useState } from "react"
import { getListSentenceByCheckingResult } from "../../../../api/checking_result_by_word"

const ContentModalFromHTML = ({ open, docId, handleModal }) => {
    const params = useParams()
    const navigate = useNavigate()
    const [loadingData, setLoadingData] = useState(false)
    const [data, setData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerpage] = useState(10)
    const [count, setCount] = useState()


    const getData = () => {
        setLoadingData(true)
        getListSentenceByCheckingResult({
            params: {
                idDoc: docId,
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

    useEffect(() => {
        if (open) {
            getData()
        }
    }, [open, docId, params?.id])

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
        <Modal isOpen={open} toggle={handleModal} className='modal-dialog-top' style={{ maxWidth: '60%' }}>
            <ModalHeader className='bg-transparent' toggle={handleModal}></ModalHeader>
            <ModalBody className='px-sm-3 mx-50 pb-2' style={{ paddingTop: 0 }}>
                <div className='text-center mb-1'>
                    <h2 className='mb-1'>Danh sách các câu trùng với tài liệu</h2>
                </div>
                <Row tag='table' className='gy-1 pt-75'>
                    {loadingData === true ? <Spin /> : <Table
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
                </Row>
            </ModalBody>
        </Modal>
    )
}

export default ContentModalFromHTML