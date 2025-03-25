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
    Button
} from "reactstrap"

// ** Third Party Components
import { useForm, Controller } from 'react-hook-form'
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import { Spin } from 'antd'

// ** Utils

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import Swal from 'sweetalert2'
import { editDocumentSource } from "../../../../api/document_source"
import { useEffect, useState } from "react"

const EditDocumentSource = ({ open, handleModal, infoEdit, getData }) => {
    if (!infoEdit) return 
    useEffect(() => {

    }, [infoEdit])
    // ** States
    const EditDocumentSourceSchema = yup.object().shape({
        name: yup.string().required("Yêu cầu nhập tên nguồn tài liệu")
    })

    const [loadingEdit, setLoadingEdit] = useState(false)

    // ** Hooks
    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(EditDocumentSourceSchema)
    })

    const onSubmit = data => {
        setLoadingEdit(true)
        editDocumentSource(infoEdit?.id, {
            name: data.name,
            description: data.description
        }).then(result => {
            if (result.status === 'success') {
                Swal.fire({
                    title: "Cập nhật nguồn tài liệu thành công",
                    text: "",
                    icon: "success",
                    customClass: {
                        confirmButton: "btn btn-success"
                    }
                })
            } else {
                Swal.fire({
                    title: "Cập nhật nguồn tài liệu thất bại",
                    text: "Vui lòng kiểm tra lại thông tin!",
                    icon: "error",
                    customClass: {
                        confirmButton: "btn btn-danger"
                    }
                })
            }
            handleModal()
            getData()
        }).catch(error => {
            Swal.fire({
                title: "Cập nhật nguồn tài liệu thất bại",
                text: `Có lỗi xảy ra - ${error.message}!`,
                icon: "error",
                customClass: {
                    confirmButton: "btn btn-danger"
                }
            })
        }).finally(() => {
            setLoadingEdit(false)
        })
    }
    return (
        <Modal isOpen={open} toggle={handleModal} className='modal-dialog-top modal-md'>
            <ModalHeader className='bg-transparent' toggle={handleModal}></ModalHeader>
            <ModalBody className='px-sm-3 mx-50 pb-2' style={{ paddingTop: 0 }}>
                <div className='text-center mb-1'>
                    <h2 className='mb-1'>Cập nhật nguồn tài liệu</h2>
                </div>
                <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
                    <Col xs={12}>
                        <Label className='form-label' for='name'>
                            Tên nguồn tài liệu <span style={{ color: 'red' }}>(*)</span>
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
                                        placeholder='Nhập tên nguồn tài liệu'
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
                                loadingEdit === true ? <Spin className="spin" /> : 'Cập nhật'
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

export default EditDocumentSource