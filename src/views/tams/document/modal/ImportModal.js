// ** React Imports
import React, { useEffect, useState } from 'react'
import { Table, Tooltip, Popconfirm } from "antd"
// ** Third Party Components
import Flatpickr from 'react-flatpickr'
import { User, Briefcase, Mail, Calendar, DollarSign, X } from 'react-feather'
import DataTable from 'react-data-table-component'
import { useDispatch } from 'react-redux'
// ** Reactstrap Imports
import { Modal, Input, Label, Button, ModalHeader, ModalBody, InputGroup, InputGroupText, Alert } from 'reactstrap'
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"
// import responseResultHelper from '../../../utils/reponsive'
// import { ACTION_METHOD_TYPE } from '../../../utils/constant'
// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
// import { TaoNhieuHoSoDangKi } from '../../../../api/hoSoDangKi'
import { toDateString } from '../../../../utility/Utils'
// import { kiemTraTruong, taoNhieuTruongDaiHoc, taoTruongDaiHoc } from '../../../../api/truongDaiHoc'
// import { kiemTraNganh, taoNganhDaiHoc, taoNhieuNganhDaiHoc } from '../../../../api/nganhDaiHoc'
import { setListDataImport } from '../../../apps/ecommerce/store'
import dayjs from "dayjs"
const ImportModal = ({ open, getData, handleModal, listImport, fileInputRef }) => {
    if (!listImport && (listImport.length = 0)) {
        if (fileInputRef.current) {
            fileInputRef.current.value = undefined
        }
    }
    // ** State
    // ** Custom close btn
    // const [listTDH, setListTDH] = useState(listTDHda)
    // const [listNganh, setListNganh] = useState(listNganhda)
    const dispatch = useDispatch()
    const [isEdit, setIsEdit] = useState(false)
    const [info, setInfo] = useState()
    const [listErr, setListErr] = useState([])
    const [dataImport, setDataImport] = useState([])
    const [disabled, setDisable] = useState(true)
    const listColumn = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

    const handleModal_ = () => {
        // setDataImport([])
        handleModal()
    }
    const columnsErr = [
        {
            title: 'Lỗi',
            minWidth: '100px',
            render: (text, record, index) => (
                <span>{record?.loi}</span>
            ),

        },
        {
            title: 'Vị trí',
            minWidth: '200px',
            // selector: row => row.Vitri,
            render: (text, record, index) => (
                <span>{record?.Vitri}</span>
            ),
        },
    ]
    const handleModalEditDetail = () => {
        setIsEdit(false)
        setInfo(null)
        // handleReset()
        setDataImport([])
    }
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
    const columnsData = [
        {
            title: 'STT',
            dataIndex: 'index',
            width: "70px",
            align: "center",
            // selector: row => row.index,

        },
        {
            title: 'Tiêu đề', // bắt buộc
            dataIndex: 'title',
            maxWidth: '10px',
            // selector: row => row.title,

        },
        {
            title: 'Tác giả', // bắt buộc
            minWidth: '100px',
            dataIndex: 'author',
            // selector: row => row.author,
        },
        {
            title: 'Đồng tác giả',
            maxWidth: '100px',
            dataIndex: 'coAuthor',
            // selector: row => row.coAuthor,
        },
        {
            title: 'Cán bộ hướng dẫn',
            minWidth: '150px',
            dataIndex: 'supervisor',
            // selector: row => row.supervisor,
        },
        {
            title: 'Nguồn tài liệu', // bắt buộc
            minWidth: '150px',
            dataIndex: 'source',
            // selector: row => row.source,
        },
        {
            title: 'Loại tài liệu', // bắt buộc
            maxWidth: '50px',
            dataIndex: 'documentType',
            // selector: row => row.documentType,
        },
        {
            title: 'Lĩnh vực', // bắt buộc
            minWidth: '100px',
            dataIndex: 'major',
            // selector: row => row.major,
        },
        {
            title: 'Năm xuất bản',
            minWidth: '100px',
            // selector: row => dayjs(row.publish_date).format('DD-MM-YYYY'),
            render: (text, record, index) => (
                <span>{dayjs(record.publish_date).format('DD-MM-YYYY')}</span>
            ),
        },
        {
            title: 'Nơi xuất bản',
            minWidth: '100px',
            dataIndex: 'publish_place',
            // selector: row => row.publish_place,
        },
        {
            title: 'Mô tả',
            minWidth: '100px',
            dataIndex: 'description',
            // selector: row => row.description,
        },
        {
            title: 'Tên file', // bắt buộc
            minWidth: '100px',
            dataIndex: 'fileName',
            // selector: row => row.fileName,
        },
        // {
        //     title: "Thao tác",
        //     width: 100,
        //     align: "center",
        //     render: (record) => (
        //         <div style={{ display: "flex", justifyContent: "center" }}>
        //             <Tooltip placement="top" title="Chỉnh sửa">
        //                 <EditOutlined
        //                     style={{ color: "#09A863", cursor: 'pointer', marginRight: '1rem' }}
        //                     onClick={() => handleEdit(record)}
        //                 />
        //             </Tooltip>
        //             <Popconfirm
        //                 title="Bạn chắc chắn xóa?"
        //                 onConfirm={() => handleDelete(record.id)}
        //                 cancelText="Hủy"
        //                 okText="Đồng ý"
        //             >
        //                 <Tooltip placement="top" title="Xóa">
        //                     <DeleteOutlined style={{ color: "red", cursor: 'pointer' }} id={`tooltip_delete${record.ID}`} />
        //                 </Tooltip>
        //             </Popconfirm>
        //         </div>
        //     ),
        // },
    ]
    const CloseBtn = <X className='cursor-pointer' size={15} onClick={handleModal_} />
    const chunk = (arr, size) => Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => arr.slice((i * size), (size * (i + 1))))

    //
    // list các trường lỗi
    const checkErr = (listImport1) => {
        const data = []
        const temp = []
        const listTruong = []
        const listNganh = []
        listImport1?.forEach((row, index) => {
            //kiểm tra stt
            const infoOneRow = {
                index: '',
                title: '',
                author: '',
                coAuthor: '',
                supervisor: '',
                source: '',
                documentType: '',
                major: '',
                publish_date: '',
                publish_place: '',
                description: '',
                filetitle: ''
            }
            infoOneRow.soTT = index + 1
            if (row[0] === null) {
                temp.push({
                    loi: 'STT không được để trống',
                    Vitri: `${listColumn[0]}${index + 2}`
                })
            } else {
                infoOneRow.index = row[0]
                // infoOneRow.fileAnh = `${row[0]}.jpg`
            }
            // kiểm tra tiêu đề
            if (row[1] === null) {
                temp.push({
                    loi: 'Tiêu đề không được để trống',
                    Vitri: `${listColumn[1]}${index + 2}`
                })
            } else {
                infoOneRow.title = row[1]
            }
            // Kiểm tra tác giả
            if (row[2] === null) {
                temp.push({
                    loi: 'Tên tác giả không được để trống',
                    Vitri: `${listColumn[2]}${index + 2}`
                })
            } else {
                infoOneRow.author = row[2]
            }
            if (row[3] !== null) {
                infoOneRow.coAuthor = row[3]
            }
            if (row[4] !== null) {
                infoOneRow.supervisor = row[4]
            }
            // Kiểm tra nguồn tài liệu
            if (row[5] === null) {
                temp.push({
                    loi: 'Nguồn tài liệu không được để trống',
                    Vitri: `${listColumn[5]}${index + 2}`
                })
            } else {
                infoOneRow.source = row[5]
            }
            // Kiểm tra loại tài liệu
            if (row[6] === null) {
                temp.push({
                    loi: 'Loại tài liệu không được để trống',
                    Vitri: `${listColumn[6]}${index + 2}`
                })
            } else {
                infoOneRow.source = row[6]
            }
            // Kiểm tra lĩnh vực
            if (row[7] !== null) {
                infoOneRow.supervisor = row[7]
            }
            if (row[8] !== null) {
                infoOneRow.publish_date = row[8]
            }
            if (row[9] !== null) {
                infoOneRow.publish_place = row[9]
            }
            if (row[10] !== null) {
                infoOneRow.description = row[10]
            }
            if (row[11] === null) {
                temp.push({
                    loi: 'Tên file tài liệu không được để trống',
                    Vitri: `${listColumn[11]}${index + 2}`
                })
            } else {
                infoOneRow.fileName = row[11]
            }
            data.push(infoOneRow)
        })
        if (temp.length === 0) {
            const dataTemp = data.map((item, index) => {
                return {...item, id: index + 1}
            })
            setDisable(false)
            setDataImport(dataTemp)
            return {
                key: "data",
                value: data
            }
        }
        return {
            key: "errors",
            value: temp
        }
    }
    useEffect(() => {
        const { key, value } = checkErr(listImport)
        console.log(key, value)
        if (key === "data") {

            if (value?.length === 0) {
                setDisable(true)
            } else {
                setDisable(false)
                console.log("đâu")
                setDataImport(value)
            }
        }
        if (key === "errors") {
            setListErr(value)
        }
        // if (errs?.key === "data" && errs?.value?.length === 0) {
        // }
    }, [listImport])

    return (
        <Modal
            isOpen={open}
            toggle={handleModal_}
            contentClassName='pt-0'
            className='modal-xl'
        >
            <ModalHeader className='mb-1' toggle={handleModal_}>
                <h5 className='modal-title'>Danh sách tài liệu</h5>
                {
                    listImport?.length === 0 ? <span style={{ color: 'red' }}>File nhập rỗng! Vui lòng kiểm tra lại</span> : (listErr.length > 0 ? <span style={{ color: 'red' }}>File nhập có lỗi! Vui lòng kiểm tra lại</span> : <span style={{ color: 'green' }}>File đúng định dạng! Vui lòng kiểm tra lại thông tin trước khi lưu</span>)
                }
            </ModalHeader>
            {
                listErr.length > 0 ? < div className='' style={{ marginRight: '20px', marginLeft: '20px', height: '700px', overflow: 'auto' }}>
                    <Table
                        // noHeader
                        // striped
                        // className='react-dataTable'
                        bordered
                        columns={columnsErr}
                        dataSource={listErr}
                    />
                </div> : (
                    dataImport.length > 0 && <div className='' style={{ marginRight: '20px', marginLeft: '20px', height: '700px', overflow: 'auto' }}>
                        <Table
                            // noHeader
                            // striped
                            // className='react-dataTable'
                            bordered
                            columns={columnsData}
                            dataSource={dataImport}
                        />
                    </div>
                )
            }
            <ModalBody className='flex-grow-1'>
                <Button className='me-1' color='primary' disabled={disabled} onClick={handleModal_}>
                    Xác nhận
                </Button>
                {/* <Button color='secondary' onClick={handleModal} outline>
                    Hủy
                </Button> */}
            </ModalBody>
            {
                info && <EditModal
                    open={isEdit}
                    handleModal={handleModalEditDetail}
                    // getData={getData}
                    infoEdit={info}
                // currentPage={currentPage}
                // rowsPerPage={rowsPerPage}
                />
            }
        </Modal >
    )
}
const EditModal = React.lazy(() => import("./modalDetail/EditModalDetail"))

export default ImportModal
