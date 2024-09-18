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
import Flatpickr from "react-flatpickr"

// ** Utils

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import { Vietnamese } from "flatpickr/dist/l10n/vn.js"
import "@styles/react/libs/flatpickr/flatpickr.scss"
import Swal from 'sweetalert2'
import { convertDateString, toDateStringv2 } from "../../../../utility/Utils"
import { editCourse } from "../../../../api/course"
import { useEffect, useState } from "react"
import { Spin } from "antd"

const EditCourse = ({ open, handleModal, infoEdit, getData }) => {
    if (!infoEdit) return
    useEffect(() => {

    }, [infoEdit])
    // ** States
    const EditCourseSchema = yup.object().shape({
        name: yup.string().required("Yêu cầu nhập tên đợt kiểm tra")
    })

    // ** Hooks
    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(EditCourseSchema)
    })

    const [picker, setPicker] = useState(new Date(infoEdit?.date))
    const [isChangeDate, setIsChangeDate] = useState(false)
    const [loadingEdit, setLoadingEdit] = useState(false)

    const handleChangeDate = (date) => {
        if (date) {
            setPicker(date[0])
        }
        setIsChangeDate(true)
    }

    const onSubmit = data => {
        if (!isChangeDate) {
            setLoadingEdit(true)
            editCourse(infoEdit?.id, {
                date: infoEdit?.date,
                name: data.name,
                description: data.description
            }).then(result => {
                if (result.status === 'success') {
                    Swal.fire({
                        title: "Cập nhật đợt kiểm tra thành công",
                        text: "",
                        icon: "success",
                        customClass: {
                            confirmButton: "btn btn-success"
                        }
                    })
                } else {
                    Swal.fire({
                        title: "Cập nhật đợt kiểm tra thất bại",
                        text: "Vui lòng kiểm tra lại thông tin!",
                        icon: "error",
                        customClass: {
                            confirmButton: "btn btn-danger"
                        }
                    })
                }
                getData()
                handleModal()
            }).catch(error => {
                Swal.fire({
                    title: "Cập nhật đợt kiểm tra thất bại",
                    text: `Có lỗi xảy ra - ${error.message}!`,
                    icon: "error",
                    customClass: {
                        confirmButton: "btn btn-danger"
                    }
                })
            }).finally(() => {
                setLoadingEdit(false)
            })
        } else {
            setLoadingEdit(true)
            editCourse(infoEdit?.id, {
                date: toDateStringv2(picker),
                name: data.name,
                description: data.description
            }).then(result => {
                if (result.status === 'success') {
                    Swal.fire({
                        title: "Cập nhật đợt kiểm tra thành công",
                        text: "",
                        icon: "success",
                        customClass: {
                            confirmButton: "btn btn-success"
                        }
                    })
                } else {
                    Swal.fire({
                        title: "Cập nhật đợt kiểm tra thất bại",
                        text: "Có lỗi xảy ra, vui lòng thử lại sau",
                        icon: "error",
                        customClass: {
                            confirmButton: "btn btn-danger"
                        }
                    })
                }
                getData()
                handleModal()
            }).catch(error => {
                console.log(error)
            }).finally(() => {
                setLoadingEdit(false)
            })
        }
    }

    return (
        <Modal isOpen={open} toggle={handleModal} className='modal-dialog-top modal-md'>
            <ModalHeader className='bg-transparent' toggle={handleModal}></ModalHeader>
            <ModalBody className='px-sm-3 mx-50 pb-2' style={{ paddingTop: 0 }}>
                <div className='text-center mb-1'>
                    <h2 className='mb-1'>Cập nhật đợt kiểm tra</h2>
                </div>
                <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
                    <Col xs={12}>
                        <Label className='form-label' for='name'>
                            Tên đợt kiểm tra <span style={{ color: 'red' }}>(*)</span>
                        </Label>
                        <Controller
                            defaultValue={infoEdit?.name ?? ''}
                            control={control}
                            name='name'
                            render={({ field }) => {
                                return (
                                    <Input
                                        {...field}
                                        id='name'
                                        placeholder='Nhập tên đợt kiểm tra'
                                        invalid={errors.name && true}
                                    />
                                )
                            }}
                        />
                        {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
                    </Col>
                    <Col xs={12}>
                        <Label className='form-label' for='date'>
                            Thời gian <span style={{ color: 'red' }}>(*)</span>
                        </Label>
                        <Controller
                            control={control}
                            name='date'
                            render={() => {
                                return (
                                    <Flatpickr
                                        className="form-control invoice-edit-input date-picker"
                                        options={{
                                            dateFormat: "d-m-Y", // format ngày giờ
                                            locale: {
                                                ...Vietnamese
                                            }
                                        }}
                                        placeholder="dd/mm/yyyy"
                                        onChange={handleChangeDate}
                                        defaultValue={convertDateString(infoEdit?.date).toUTCString()}
                                    />

                                )
                            }}
                        />
                        {errors.date && <FormFeedback>{errors.date.message}</FormFeedback>}
                    </Col>
                    <Col xs={12}>
                        <Label className='form-label' for='description'>
                            Mô tả
                        </Label>
                        <Controller
                            defaultValue={infoEdit?.description ?? ''}
                            name='description'
                            control={control}
                            render={({ field }) => (
                                <Input {...field} id='description' placeholder='Nhập mô tả' invalid={errors.description && true} />
                            )}
                        />
                    </Col>
                    <Col xs={12} className='text-center mt-2 pt-50'>
                        <Button type='submit' className='me-1' color='primary'>
                            {
                                loadingEdit === true ? <Spinner color="#fff" size="sm" /> : 'Cập nhật'
                            }
                        </Button>
                        <Button type='reset' color='secondary' outline onClick={handleModal}>
                            Hủy
                        </Button>
                    </Col>
                </Row>
            </ModalBody>
        </Modal>
    )
}

export default EditCourse