// ** React Imports
import { useState } from 'react'
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
    Button
} from "reactstrap"

// ** Third Party Components
import Select from 'react-select'
import { useForm, Controller } from 'react-hook-form'
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import {
    Spin
} from 'antd'
// ** Utils

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import Swal from 'sweetalert2'
import { postSystemParameter } from '../../../../../api/system_parameter'

const AddNewParameter = ({ open, handleModal, getData }) => {
    // ** States
    const AddNewParameterSchema = yup.object().shape({
        name: yup.string().required("Yêu cầu nhập tên tham số"),
        code: yup.string().required("Yêu cầu nhập mã tham số"),
        value: yup.string().required("Yêu cầu nhập giá trị tham số"),
    })

    // ** Hooks
    const {
        reset,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(AddNewParameterSchema)
    })

    // ** State
    const [loadingAdd, setLoadingAdd] = useState(false)

    const handleCloseModal = () => {
        handleModal()
        reset()
    }

    const onSubmit = (data) => {
        // Lấy nút submit đã được nhấn
        setLoadingAdd(true)
        postSystemParameter(data).then(result => {
            if (result.status === 'success') {
                Swal.fire({
                    title: "Thêm mới tham số thành công",
                    text: "",
                    icon: "success",
                    customClass: {
                        confirmButton: "btn btn-success"
                    }
                })
            } else {
                Swal.fire({
                    title: "Thêm mới tham số thất bại",
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
            Swal.fire({
                title: "Thêm mới tham số thất bại",
                text: `Có lỗi xảy ra - ${error.message}!`,
                icon: "error",
                customClass: {
                    confirmButton: "btn btn-danger"
                }
            })
        }).finally(() => {
            setLoadingAdd(false)
        })
    }
    return (
        <Modal isOpen={open} toggle={handleModal} className='modal-dialog-top modal-md'>
            <ModalHeader className='bg-transparent' toggle={handleCloseModal}></ModalHeader>
            <ModalBody className='px-sm-3 mx-50 pb-2' style={{ paddingTop: 0 }}>
                <div className='text-center mb-1'>
                    <h2 className='mb-1'>Thêm mới tham số hệ thống</h2>
                </div>
                <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
                    <Col xs={12}>
                        <Label className='form-label' for='name'>
                            Tên tham số <span style={{ color: 'red' }}>(*)</span>
                        </Label>
                        <Controller
                            control={control}
                            name='name'
                            render={({ field }) => {
                                return (
                                    <Input
                                        {...field}
                                        id='name'
                                        placeholder='Nhập tên tham số'
                                        invalid={errors.name && true}
                                    />
                                )
                            }}
                        />
                        {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
                    </Col>
                    <Col xs={12}>
                        <Label className='form-label' for='code'>
                            Mã tham số <span style={{ color: 'red' }}>(*)</span>
                        </Label>
                        <Controller
                            control={control}
                            name='code'
                            render={({ field }) => {
                                return (
                                    <Input
                                        {...field}
                                        id='code'
                                        placeholder='Nhập mã tham số'
                                        invalid={errors.code && true}
                                    />
                                )
                            }}
                        />
                        {errors.code && <FormFeedback>{errors.code.message}</FormFeedback>}
                    </Col>
                    <Col xs={12}>
                        <Label className='form-label' for='value'>
                            Giá trị tham số <span style={{ color: 'red' }}>(*)</span>
                        </Label>
                        <Controller
                            control={control}
                            name='value'
                            render={({ field }) => {
                                return (
                                    <Input
                                        {...field}
                                        id='value'
                                        placeholder='Nhập giá trị tham số'
                                        invalid={errors.value && true}
                                    />
                                )
                            }}
                        />
                        {errors.value && <FormFeedback>{errors.value.message}</FormFeedback>}
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
                    <Col xs={12} className='text-center mt-2 pt-50'>
                        <Button type='submit' name="add" className='me-1' color='primary'>
                            {
                                loadingAdd === true ? <Spin className="spin" /> : 'Thêm'
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

export default AddNewParameter