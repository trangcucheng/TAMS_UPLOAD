// ** React Imports
import React, { useEffect, useState, useRef } from "react"
import { useDispatch } from "react-redux"
// ** Reactstrap Imports
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
    Form,
    Spinner
} from "reactstrap"
import readXlsxFile from 'read-excel-file/web-worker'

// ** Third Party Components
import Select from 'react-select'
import { useForm, Controller } from 'react-hook-form'
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
// import { Select } from "antd"
// ** Utils

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import Swal from 'sweetalert2'
import { postCheckingDocument } from "../../../../api/checking_document"
import { getCourse } from "../../../../api/course"
import classNames from "classnames"
import { postCheckingDocumentVersion } from "../../../../api/checking_document_version"
import withReactContent from "sweetalert2-react-content"
import { postFromExcel } from "../../../../api/checking_document_version_by_word"
import ExcelJS from 'exceljs' // Import thư viện exceljs

const SelectCourseModal = ({ open, handleModal, getData }) => {
    const fileInputRef = useRef(null) // Tạo ref cho input file
    const folderInputRef = useRef(null) // Tạo ref cho input
    const [inputKey, setInputKey] = useState(Date.now()) // Quản lý key để reset input
    const distpatch = useDispatch()
    const AddFileExcelSchema = yup.object().shape({
        // file: yup.mixed().required("Yêu cầu chọn file").nullable().test(
        //     "is-not-empty",
        //     "Yêu cầu chọn file",
        //     value => value !== null && value !== ''
        // ),
        file: yup.mixed().required("Yêu cầu chọn file"),
        folder: yup.mixed().required("Vui lòng chọn thư mục"),
    })

    // ** Hooks
    const {
        reset,
        control,
        handleSubmit,
        getValues,
        setValue,
        formState: { errors }
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(AddFileExcelSchema)
    })
    const MySwal = withReactContent(Swal)

    // ** State
    const [fileExcel, setFileExcel] = useState()
    const [files, setFiles] = useState([])
    const [listCourse, setListCourse] = useState([])
    const [loadingAdd, setLoadingAdd] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [firstApiResult, setFirstApiResult] = useState(null)
    const [modalImportFile, setModalImportFile] = useState(false)
    const [listImport, setListImport] = useState()
    const handleModalImportFile = () => setModalImportFile(!modalImportFile)
    const [loading, setLoading] = useState(false)
    const [canSubmit, setCanSubmit] = useState(false)
    const [modalPreview, setModalPreview] = useState(false)

    const handleModalPreview = () => setModalPreview(!modalPreview)

    const handleCloseModal = () => {
        handleModal()
        reset()
    }

    const handleChangeFile = (event) => {
        event.preventDefault()

        const file = event.target.files[0]

        if (!file || !file.name.endsWith('.xlsx')) {
            MySwal.fire({
                icon: "error",
                title: "Có lỗi xảy ra",
                text: "Vui lòng chọn file định dạng Excel (.xlsx)",
                customClass: {
                    confirmButton: "btn btn-danger"
                }
            })
            return
        }

        if (fileExcel !== file) {
            setFileExcel(file) // Lưu file vào state
        }

        readXlsxFile(file).then((rows) => {
            const temp = rows.slice(4) // Cắt mảng từ hàng bắt đầu
            setListImport(temp) // Lưu danh sách sau khi xử lý
            setModalImportFile(true) // Mở modal hiển thị kết quả import
        }).catch(error => {
            MySwal.fire({
                icon: "error",
                title: "Có lỗi xảy ra",
                text: "File không đúng định dạng, vui lòng chọn file định dạng Excel và nhập đúng các cột",
                customClass: {
                    confirmButton: "btn btn-danger"
                }
            })
        })
        //     .finally(() => {
        //     if (fileInputRef.current) {
        //         fileInputRef.current.value = undefined // Reset giá trị input
        //     }
        // })
    }

    const onSubmit = (data) => {
        setLoadingAdd(true)
        const formData = new FormData()
        formData.append('excel', fileExcel)
        formData.append('courseId', 1)
        files?.map((file) => {
            formData.append('files', file)
        })
        postFromExcel(formData).then(result => {
            if (result.status === 'success') {
                getData()
                Swal.fire({
                    title: "Thêm mới tài liệu thành công",
                    // text: "Vui lòng thử lại sau!",
                    icon: "success",
                    customClass: {
                        confirmButton: "btn btn-success"
                    }
                })
            } else {
                Swal.fire({
                    title: "Thêm mới tài liệu thất bại",
                    text: "Vui lòng thử lại sau!",
                    icon: "error",
                    customClass: {
                        confirmButton: "btn btn-danger"
                    }
                })
            }
            setFileExcel(null)
            setFiles([])
            handleCloseModal()
        }).catch(error => {
            console.log(error)
        }).finally(() => {
            setLoadingAdd(false)
        })
    }

    const handleChangeFolder = (event) => {
        const fileList = event.target.files
        const fileArray = Array.from(fileList)

        setFiles(fileArray)

        // Hiện modal preview ở đây
        setModalPreview(true)

        // Reset lại input file
        if (folderInputRef.current) {
            folderInputRef.current.value = undefined // Reset giá trị input
        }
    }
    const handleClickInput = () => {
        // Reset giá trị của input file
        if (fileInputRef.current) {
            fileInputRef.current.value = null // Đặt giá trị về null để cho phép chọn lại tệp
        }
    }
    return (
        <Modal isOpen={open} toggle={handleCloseModal} className='modal-dialog-top modal-lg'>
            <ModalHeader className='bg-transparent' toggle={handleCloseModal}></ModalHeader>
            <ModalBody className='px-sm-3 mx-50 pb-2' style={{ paddingTop: 0 }}>
                <div className='text-center mb-1'>
                    <h2 className='mb-1'>Thông tin danh sách tài liệu</h2>
                </div>
                <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
                    <Col xs={12}>
                        <div className='d-flex justify-content-between'>
                            <Label className='form-label' for='file'>
                                Danh sách tài liệu <span style={{ color: 'red' }}>(*)</span>
                            </Label>
                            {/* {
                                listImport?.length > 0 && <small style={{ color: "#09a863", cursor: "pointer" }} onClick={() => setModalImportFile(true)}>Chi tiết tài liệu</small>
                            } */}
                        </div>
                        <Controller
                            name='file'
                            control={control}
                            defaultValue={undefined}
                            render={({ field }) => (
                                <Input {...field} id='file'
                                    type='file'
                                    value={undefined}
                                    placeholder='Chọn tài liệu'
                                    ref={fileInputRef}
                                    onClick={handleClickInput} // Khi người dùng nhấn vào, reset giá trị
                                    invalid={errors.file && true} onChange={(event) => {
                                        handleChangeFile(event)
                                        field.onChange(event)
                                    }} />
                            )}
                        />
                        {errors.file && <FormFeedback>{errors.file.message}</FormFeedback>}
                    </Col>
                    <Col xs={12}>
                        <div className='d-flex justify-content-between'>
                            <Label className='form-label' for='folder'>
                                Thư mục tài liệu <span style={{ color: 'red' }}>(*)</span>
                            </Label>
                            {/* {
                                files?.length > 0 && <small style={{ color: "#09a863", cursor: "pointer" }} onClick={() => setModalPreview(true)}>Chi tiết các tệp tải lên</small>
                            } */}
                        </div>
                        <Controller
                            name='folder'
                            control={control}
                            value={undefined}
                            render={({ field }) => (
                                <Input
                                    value={undefined}
                                    {...field}
                                    id='folder'
                                    type='file'
                                    webkitdirectory="true"
                                    directory=""
                                    multiple
                                    ref={folderInputRef} // Sử dụng ref để truy cập input
                                    placeholder='Chọn thư mục'
                                    invalid={errors.folder && true}
                                    onChange={(event) => {
                                        handleChangeFolder(event)
                                        field.onChange(event) // Gọi field.onChange để cập nhật form state
                                    }}
                                />
                            )}
                        />
                        {errors.folder && <FormFeedback>{errors.folder.message}</FormFeedback>}
                    </Col>
                    {/* <span style={{ color: 'red' }}>
                        {successMessage}
                    </span> */}
                    <Col xs={12} className='text-center mt-2 pt-50'>
                        <Button type='submit' name='add' className='me-1' color='primary'>
                            {
                                loadingAdd === true ? <Spinner color="#fff" size="sm" /> : 'Thêm'
                            }
                        </Button>
                        <Button type='reset' color='secondary' outline onClick={handleCloseModal}>
                            Hủy
                        </Button>
                    </Col>
                </Row>
            </ModalBody>
            {
                listImport && <ImportModal open={modalImportFile} handleModal={handleModalImportFile} listImport={listImport} fileInputRef={fileInputRef} ></ImportModal>
            }
            {
                listImport && files && <PreviewModal open={modalPreview} getData={getData} handleModal={handleModalPreview} listImport={listImport} files={files} setFiles={setFiles}></PreviewModal>
            }
        </Modal >
    )
}
const ImportModal = React.lazy(() => import("./ImportModal"))
const PreviewModal = React.lazy(() => import("./PreviewModal"))
export default SelectCourseModal