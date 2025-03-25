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
import { postDocumentType } from "../../../../api/document_type"

const AddNewDocumentType = ({ open, handleModal, getData }) => {
    // ** States
    const AddNewDocumentTypeSchema = yup.object().shape({
        name: yup.string().required("Yêu cầu nhập tên loại tài liệu")
    })

    // ** Hooks
    const {
        reset,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(AddNewDocumentTypeSchema)
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
        postDocumentType(data).then(result => {
            if (result.status === 'success') {
                Swal.fire({
                    title: "Thêm mới loại tài liệu thành công",
                    text: "",
                    icon: "success",
                    customClass: {
                        confirmButton: "btn btn-success"
                    }
                })
            } else {
                Swal.fire({
                    title: "Thêm mới loại tài liệu thất bại",
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
                title: "Thêm mới loại tài liệu thất bại",
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
                    <h2 className='mb-1'>Thêm mới loại tài liệu</h2>
                </div>
                <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
                    <Col xs={12}>
                        <Label className='form-label' for='name'>
                            Tên loại tài liệu <span style={{ color: 'red' }}>(*)</span>
                        </Label>
                        <Controller
                            control={control}
                            name='name'
                            render={({ field }) => {
                                return (
                                    <Input
                                        {...field}
                                        id='name'
                                        placeholder='Nhập tên loại tài liệu'
                                        invalid={errors.name && true}
                                    />
                                )
                            }}
                        />
                        {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
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

export default AddNewDocumentType