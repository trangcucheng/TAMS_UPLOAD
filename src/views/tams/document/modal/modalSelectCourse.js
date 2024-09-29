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
import readXlsxFile from 'read-excel-file'

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
        // file: yup.mixed().required("Yêu cầu chọn file"),
        // folder: yup.mixed().required("Vui lòng chọn thư mục"),
        file: yup.mixed(),
        folder: yup.mixed()
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
    const [listImport, setListImport] = useState([])
    const handleModalImportFile = () => setModalImportFile(!modalImportFile)
    const [loading, setLoading] = useState(false)
    const [canSubmit, setCanSubmit] = useState(false)
    const [modalPreview, setModalPreview] = useState(false)

    const handleModalPreview = () => setModalPreview(!modalPreview)

    const getAllDataPromises = async () => {
        try {
            const coursePromise = getCourse({ params: { page: 1, perPage: 10, search: '' } })
            const promises = [coursePromise]
            const results = await Promise.allSettled(promises)

            // Tạo mảng để lưu trữ các course thành công
            const courses = []

            results.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    // Xử lý kết quả thành công
                    const courseRes = result.value
                    const formattedCourses = courseRes?.data?.map((res) => ({
                        value: res.id,
                        label: `${res.name}`,
                    }))

                    courses.push(...formattedCourses)
                } else {
                    console.error(`Lỗi trong promise ${index}:`, result.reason)
                }
            })

            // Chỉ gọi setListCourse một lần sau khi hoàn tất xử lý
            setListCourse(
                courses.sort((a, b) => {
                    if (a.value === 1) return -1 // Đưa phần tử có id = 1 lên đầu
                    if (b.value === 1) return 1 // Đưa phần tử có id = 1 lên đầu
                    return 0 // Giữ nguyên thứ tự của các phần tử còn lại
                })
            )
        } catch (error) {
            console.error('Lỗi khi gọi API:', error)
            setListCourse(null)
        }
    }

    // useEffect(() => {
    //     if (open) {
    //         getAllDataPromises()
    //     }
    // }, [open])
    const handleCloseModal = () => {
        handleModal()
        reset()
    }

    const handleChangeFile = async (event) => {
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
    
        // Tạo biến tạm thời để lưu file trước khi set vào state
        const selectedFile = file
    
        setFileExcel(selectedFile) // Lưu file vào state
    
        // Đọc file và xử lý sau đó
        readXlsxFile(selectedFile).then((rows) => {
            const temp = rows.slice(3) // Cắt mảng từ hàng bắt đầu
    
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
    }

    // Sử dụng useEffect để mở modal
    useEffect(() => {
        if (listImport.length > 0) {
            setModalImportFile(true)// Mở modal nếu có dữ liệu
        }
    }, [listImport]) // Chạy khi listImport thay đổi

    const onSubmit = (data) => {
        setLoadingAdd(true)
        const formData = new FormData()
        formData.append('excel', fileExcel)
        formData.append('courseId', 1)

        // Nếu files là mảng, hãy sử dụng forEach để thêm vào formData
        files?.forEach((file) => {
            formData.append('files', file)
        })

        // Kiểm tra hàm postFromExcel để đảm bảo không có lỗi import
        postFromExcel(formData)
            .then((result) => {
                if (result.status === 'success') {
                    getData()
                    Swal.fire({
                        title: "Thêm mới tài liệu thành công",
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
            })
            .catch((error) => {
                console.error(error)
            })
            .finally(() => {
                setLoadingAdd(false)
                setFileExcel(null) // Sử dụng giá trị thích hợp
                setFiles([])       // Sử dụng giá trị thích hợp
                handleCloseModal()
                setListImport([]) // Sử dụng giá trị thích hợp để reset
            })
    }

    const handleChangeFolder = (event) => {
        const fileList = event.target.files
        const fileArray = Array.from(fileList)

        // Kiểm tra xem fileArray có khác với files hiện tại không
        if (JSON.stringify(fileArray) !== JSON.stringify(files)) {
            setFiles(fileArray)
        }
    }
    // Sử dụng useEffect để mở modal
    useEffect(() => {
        if (files.length > 0) {
            setModalPreview(true)
        }
    }, [files]) // Chạy khi listImport thay đổi

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
                            {
                                listImport?.length > 0 && <small style={{ color: "#09a863", cursor: "pointer" }} onClick={() => setModalImportFile(true)}>Chi tiết tài liệu</small>
                            }
                        </div>
                        <Controller
                            name='file'
                            control={control}
                            value={undefined}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id='file'
                                    type='file'
                                    placeholder='Chọn tài liệu'
                                    ref={fileInputRef}
                                    value={undefined}
                                    invalid={errors.file && true}
                                    onChange={(event) => {
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
                            {
                                files?.length > 0 && <small style={{ color: "#09a863", cursor: "pointer" }} onClick={() => setModalPreview(true)}>Chi tiết các tệp tải lên</small>
                            }
                        </div>
                        <Controller
                            name='folder'
                            control={control}
                            value={undefined} s
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id='folder'
                                    type='file'
                                    value={undefined}
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
                modalImportFile && <ImportModal open={modalImportFile} handleModal={handleModalImportFile} listImport={listImport} fileInputRef={fileInputRef} ></ImportModal>
            }
            {
                modalPreview && <PreviewModal open={modalPreview} getData={getData} handleModal={handleModalPreview} listImport={listImport} files={files} setFiles={setFiles}></PreviewModal>
            }
        </Modal>
    )
}
const ImportModal = React.lazy(() => import("./ImportModal"))
const PreviewModal = React.lazy(() => import("./PreviewModal"))
export default SelectCourseModal