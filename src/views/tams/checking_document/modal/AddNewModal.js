// ** React Imports
import { useEffect, useState } from "react"
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

// ** Third Party Components
import Select from 'react-select'
import { useForm, Controller } from 'react-hook-form'
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'

// ** Utils

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import Swal from 'sweetalert2'
import { postCheckingDocument } from "../../../../api/checking_document"
import { getCourse } from "../../../../api/course"
import classNames from "classnames"
import { postCheckingDocumentVersion } from "../../../../api/checking_document_version"

const AddNewCheckingDocument = ({ open, handleModal, getData }) => {
    const AddNewCheckingDocumentSchema = yup.object().shape({
        file: yup.mixed().required("Yêu cầu chọn file").nullable().test(
            "is-not-empty",
            "Yêu cầu chọn file",
            value => value !== null && value !== ''
        ),
        title: yup.string().required("Yêu cầu nhập tiêu đề"),
        author: yup.string().required("Yêu cầu nhập tác giả"),
        course: yup.object().required("Yêu cầu nhập đợt kiểm tra").nullable()
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
        resolver: yupResolver(AddNewCheckingDocumentSchema)
    })

    // ** State
    const [file, setFile] = useState()
    const [listCourse, setListCourse] = useState([])
    const [loadingAdd, setLoadingAdd] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')

    const getAllDataPromises = async () => {
        const coursePromise = getCourse({ params: { page: 1, perPage: 10, search: '' } })

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
        // const courses2 = [{value: 1, label: 'Đợt kiểm tra độc lập'}, ...courses]
        setListCourse(courses)
    }

    useEffect(() => {
        if (open) {
            getAllDataPromises()
        }
    }, [open])

    const handleCloseModal = () => {
        handleModal()
        reset()
    }

    const handleChangeFile = (event) => {
        const file = event.target.files[0]
        setFile(file)
    }

    const onSubmit = (data) => {
        setLoadingAdd(true)
        postCheckingDocument({
            title: data.title,
            author: data.author,
            courseId: data.course.value,
            description: data.description ?? ""
        }).then(result => {
            if (result.status === 'success') {
                setSuccessMessage(`Thêm mới ${file.name} thành công!!!`)
                getData()
                setTimeout(() => setSuccessMessage(''), 2000)
                const formData = new FormData()
                formData.append('file', file)
                if (data.description) {
                    formData.append('description', data.description)
                }
                formData.append('checkingDocumentId', result?.data?.id)
                postCheckingDocumentVersion(formData).then(result => {
                    if (result.status === 'success') {
                        Swal.fire({
                            title: "Thêm mới kiểm tra tài liệu thành công",
                            text: "",
                            icon: "success",
                            customClass: {
                                confirmButton: "btn btn-success"
                            }
                        })
                    }
                    // getData()
                })
            } else {
                Swal.fire({
                    title: "Thêm mới kiểm tra tài liệu thất bại",
                    text: "Vui lòng thử lại sau!",
                    icon: "error",
                    customClass: {
                        confirmButton: "btn btn-danger"
                    }
                })
            }
            setValue('title', '')
            setValue('author', '')
            setValue('description', '')
            setValue('file', '')
        }).catch(error => {
            console.log(error)
        }).finally(() => {
            setLoadingAdd(false)
        })
    }

    return (
        <Modal isOpen={open} toggle={handleModal} className='modal-dialog-top modal-lg'>
            <ModalHeader className='bg-transparent' toggle={handleCloseModal}></ModalHeader>
            <ModalBody className='px-sm-3 mx-50 pb-2' style={{ paddingTop: 0 }}>
                <div className='text-center mb-1'>
                    <h2 className='mb-1'>Thông tin tài liệu kiểm tra</h2>
                </div>
                <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
                    <Col xs={12}>
                        <Label className='form-label' for='title'>
                            Tiêu đề <span style={{ color: 'red' }}>(*)</span>
                        </Label>
                        <Controller
                            control={control}
                            name='title'
                            render={({ field }) => {
                                return (
                                    <Input
                                        {...field}
                                        id='title'
                                        placeholder='Nhập tiêu đề'
                                        invalid={errors.title && true}
                                    />
                                )
                            }}
                        />
                        {errors.title && <FormFeedback>{errors.title.message}</FormFeedback>}
                    </Col>
                    <Col xs={12}>
                        <Label className='form-label' for='course'>
                            Đợt kiểm tra <span style={{ color: 'red' }}>(*)</span>
                        </Label>
                        <Controller
                            id='react-select'
                            name='course'
                            control={control}
                            render={({ field }) => (
                                <Select
                                    placeholder="Chọn đợt kiểm tra"
                                    classNamePrefix='select'
                                    name='clear'
                                    options={listCourse}
                                    isClearable
                                    className={classNames('react-select', { 'is-invalid': errors.course && true })}
                                    {...field}
                                />)}
                        />
                        {errors.course && <FormFeedback>{errors.course.message}</FormFeedback>}
                    </Col>
                    <Col xs={12}>
                        <Label className='form-label' for='author'>
                            Tác giả <span style={{ color: 'red' }}>(*)</span>
                        </Label>
                        <Controller
                            name='author'
                            control={control}
                            render={({ field }) => (
                                <Input {...field} id='author' placeholder='Nhập tác giả' invalid={errors.author && true} />
                            )}
                        />
                        {errors.author && <FormFeedback>{errors.author.message}</FormFeedback>}
                    </Col>
                    <Col xs={12}>
                        <Label className='form-label' for='description'>
                            Mô tả
                        </Label>
                        <Controller
                            name='description'
                            control={control}
                            render={({ field }) => (
                                <Input {...field} id='description' placeholder='Nhập mô tả' invalid={errors.description && true} />
                            )}
                        />
                    </Col>
                    <Col xs={12}>
                        <Label className='form-label' for='file'>
                            Tài liệu <span style={{ color: 'red' }}>(*)</span>
                        </Label>
                        <Controller
                            name='file'
                            control={control}
                            render={({ field }) => (
                                <Input {...field} id='file' type='file' placeholder='Chọn tài liệu' invalid={errors.file && true} onChange={(event) => {
                                    handleChangeFile(event)
                                    field.onChange(event)
                                }} />
                            )}
                        />
                        {errors.file && <FormFeedback>{errors.file.message}</FormFeedback>}
                    </Col>
                    <span style={{ color: 'red' }}>
                        {successMessage}
                    </span>
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
        </Modal>
    )
}

export default AddNewCheckingDocument