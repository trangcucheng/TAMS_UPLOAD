// ** React Imports
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
    Spinner
} from "reactstrap"

// ** Third Party Components
import { useForm, Controller } from 'react-hook-form'
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import Select from 'react-select'

// ** Utils

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import Swal from 'sweetalert2'
import { useEffect, useState } from "react"
import { detailCheckingDocument, editCheckingDocument } from "../../../../api/checking_document"
import { getCourse } from "../../../../api/course"
import classNames from "classnames"
import { detailCheckingDocumentVersion, editCheckingDocumentVersion, getCheckingDocumentVersion } from "../../../../api/checking_document_version"
import { PAGE_DEFAULT, PER_PAGE_DEFAULT } from "../../../../utility/constant"

const EditCheckingDocument = ({ open, handleModal, infoEdit, getData }) => {
    if (!infoEdit) return
    useEffect(() => {

    }, [infoEdit])
    // ** States
    const EditCheckingDocumentSchema = yup.object().shape({
        title: yup.string().required("Yêu cầu nhập tiêu đề"),
        author: yup.string().required("Yêu cầu nhập tác giả"),
        course: yup.object().required("Yêu cầu nhập đợt kiểm tra").nullable()
    })

    // ** Hooks
    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(EditCheckingDocumentSchema)
    })

    const [listCourse, setListCourse] = useState([])
    const [listCheckingDocumentVersion, setListCheckingDocumentVersion] = useState([])
    const [loadingEdit, setLoadingEdit] = useState(false)

    const getAllDataPromises = async () => {
        const coursePromise = getCourse({ params: { page: PAGE_DEFAULT, perPage: PER_PAGE_DEFAULT, search: '' } })
        const checkingDocumentVersionPromise = detailCheckingDocument(infoEdit?.id)

        const promises = [coursePromise, checkingDocumentVersionPromise]
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
        const checkingDocumentVersionRes = responseData[1]
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
        const checkingDocumentVersions = checkingDocumentVersionRes?.data?.checkingDocumentVersion
        setListCheckingDocumentVersion(checkingDocumentVersions)
        setListCourse(courses)
    }


    const handleCloseModal = () => {
        handleModal()
    }

    useEffect(() => {
        if (open) {
            getAllDataPromises()
        }
    }, [open])

    const onSubmit = (data) => {
        setLoadingEdit(true)
        editCheckingDocument(infoEdit?.id, {
            title: data.title,
            author: data.author,
            courseId: data.course.value,
            description: data.description
        }).then(result => {
            if (result.status === 'success') {
                const id = listCheckingDocumentVersion[listCheckingDocumentVersion.length - 1]?.id
                editCheckingDocumentVersion(id, {
                    checkingDocumentId: infoEdit?.id,
                    description: data.description
                })
                Swal.fire({
                    title: "Cập nhật kiểm tra tài liệu thành công",
                    text: "",
                    icon: "success",
                    customClass: {
                        confirmButton: "btn btn-success"
                    }
                })
            } else {
                Swal.fire({
                    title: "Cập nhật kiểm tra tài liệu thất bại",
                    text: "Vui lòng kiểm tra lại thông tin!",
                    icon: "error",
                    customClass: {
                        confirmButton: "btn btn-danger"
                    }
                })
            }
            getData()
            handleCloseModal()
        }).catch(error => {
            console.log(error)
        }).finally(() => {
            setLoadingEdit(false)
        })
    }
    return (
        <Modal isOpen={open} toggle={handleModal} className='modal-dialog-top modal-lg'>
            <ModalHeader className='bg-transparent' toggle={handleCloseModal}></ModalHeader>
            <ModalBody className='px-sm-3 mx-50 pb-2' style={{ paddingTop: 0 }}>
                <div className='text-center mb-1'>
                    <h2 className='mb-1'>Cập nhật tài liệu</h2>
                </div>
                <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
                    <Col xs={12}>
                        <Label className='form-label' for='title'>
                            Tiêu đề <span style={{ color: 'red' }}>(*)</span>
                        </Label>
                        <Controller
                            defaultValue={infoEdit?.title}
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
                            defaultValue={ infoEdit?.course && { value: infoEdit?.course?.id, label: infoEdit?.course?.name }}
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
                            defaultValue={infoEdit?.author}
                            name='author'
                            control={control}
                            render={({ field }) => (
                                <Input  {...field} id='author' placeholder='Nhập mô tả' invalid={errors.author && true} />
                            )}
                        />
                        {errors.author && <FormFeedback>{errors.author.message}</FormFeedback>}
                    </Col>
                    <Col xs={12}>
                        <Label className='form-label' for='description'>
                            Mô tả
                        </Label>
                        <Controller
                            defaultValue={infoEdit?.description}
                            name='description'
                            control={control}
                            render={({ field }) => (
                                <Input  {...field} id='description' placeholder='Nhập mô tả' invalid={errors.description && true} />
                            )}
                        />
                        {errors.description && <FormFeedback>{errors.description.message}</FormFeedback>}
                    </Col>
                    {/* <Col xs={12}>
                        <Label className='form-label' for='file'>
                            Tài liệu
                        </Label>
                        <Controller
                            defaultValue={infoEdit?.name}
                            name='file'
                            control={control}
                            render={({ field }) => (
                                <Input  {...field} id='file' placeholder='Chọn tài liệu' invalid={errors.file && true} />
                            )}
                        />
                        {errors.file && <FormFeedback>{errors.file.message}</FormFeedback>}
                    </Col> */}
                    <Col xs={12} className='text-center mt-2 pt-50'>
                        <Button type='submit' className='me-1' color='primary'>
                            {
                                loadingEdit === true ? <Spinner color="#fff" size="sm" /> : 'Cập nhật'
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

export default EditCheckingDocument