import { useState, useContext, Fragment, useRef } from 'react'
import classnames from 'classnames'
import { useForm, Controller } from "react-hook-form"
import { Link, useHistory } from 'react-router-dom'
import InputPasswordToggle from '@components/input-password-toggle'
import { getHomeRouteForLoggedInUser, isObjEmpty } from '@utils'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Plus, X } from "react-feather"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

import {
    Alert,
    Row,
    Col,
    CardTitle,
    FormText,
    Form,
    Input,
    FormGroup,
    Label,
    CustomInput,
    Button,
    UncontrolledTooltip,
    Badge,
    Card,
    Modal,
    ModalHeader,
    ModalBody,
    FormFeedback
} from 'reactstrap'
import Spinner from '@components/spinner/Loading-spinner'
/** Constants */
/** API */
import { changePass } from '../../../../../api/authentication'

const ChangePass = ({ open, handleModal, infoEdit }) => {
    const MySwal = withReactContent(Swal)
    const [pass, setPass] = useState({
        newPassword: '',
        newPassword_: ''
    })

    const [loading, setLoading] = useState(false)
    const SignupSchema = yup.object().shape({
        newPassword: yup.string().required('Mật khẩu là bắt buộc'),
        newPassword_: yup.string().required('Mật khẩu xác nhận là bắt buộc')
            .oneOf([yup.ref('newPassword'), null], 'Mật khẩu không khớp')
    })
    const {
        reset,
        control,
        handleSubmit,
        setValue,
        clearErrors,
        formState: { errors }
    } = useForm({ mode: "onChange", resolver: yupResolver(SignupSchema) })


    const userData = JSON.parse(localStorage.getItem('userData'))
    const CloseBtn = (
        <X className="cursor-pointer" size={15} onClick={handleModal} />
    )
    const onSubmit = async (data) => {
        return MySwal.fire({
            title: "Bạn có chắc chắn muốn đổi mật khẩu không?",
            text: "Kiểm tra kỹ trước khi đổi!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Tiếp tục",
            cancelButtonText: "Hủy",
            customClass: {
                confirmButton: "btn btn-success exportFileBtn mr-1",
                cancelButton: "btn btn-secondary exportFileBtn",
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
                setLoading(true)
                const dataSubmit = {
                    newPassword: data.newPassword,
                    userID: infoEdit?._id
                }
                changePass(dataSubmit).then(response => {
                    MySwal.fire({
                        icon: "success",
                        title: "Đổi mật khẩu thành công!",
                        customClass: {
                            confirmButton: "btn btn-success"
                        }
                    })
                    setLoading(false)
                    reset()
                    handleModal()
                })
                    .catch((error) => {
                        MySwal.fire({
                            icon: "error",
                            title: error.response?.data?.message || "Đổi mật khẩu thất bại!",
                            text: "Vui lòng thử lại",
                            customClass: {
                                confirmButton: "btn btn-danger"
                            }
                        })
                        handleModal()
                    })
                setLoading(false)
            }
        })
    }

    return (
        <Modal
            isOpen={open}
            toggle={handleModal}
            autoFocus={false}
            className="modal-dialog-top modal-md"
        >
            <ModalHeader className='bg-transparent' toggle={handleModal}>
            </ModalHeader>
            <ModalBody className='px-sm-3 mx-50 pb-2' style={{ paddingTop: 0 }}>
                <div className='text-center mb-1'>
                    <h2 className='mb-1'>Thay đổi mật khẩu</h2>
                </div>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row className="content-space-between">
                        <div className="mb-1 col col-12">
                            <Label for='newPassword' className="form-label">Mật khẩu mới<span className="redColor">(*)</span></Label>
                            <Controller
                                id="newPassword"
                                name="newPassword"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type='password'
                                        name='newPassword'
                                        id='newPassword'
                                        invalid={errors.newPassword && true}
                                        className={classnames({ "is-invalid": errors.newPassword })}
                                        placeholder='Nhập mật khẩu mới tại đây'
                                    />
                                )}
                            />
                            {errors && errors.newPassword && <FormFeedback color="danger">Vui lòng nhập mật khẩu mới</FormFeedback>}
                        </div>
                    </Row>
                    <Row className="content-space-between">
                        <div className="mb-1 col col-12">
                            <Label for='newPassword_' className="form-label">Nhập lại mật khẩu mới<span className="redColor">(*)</span></Label>
                            <Controller
                                id="newPassword_"
                                name="newPassword_"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type='password'
                                        name='newPassword_'
                                        id='newPassword_'
                                        invalid={errors.newPassword_ && true}
                                        className={classnames({ "is-invalid": errors.newPassword_ })}
                                        placeholder='Nhập lại mật khẩu mới tại đây'
                                    />
                                )}
                            />
                            {errors && errors.newPassword_ && <FormFeedback color="danger" >Mật khẩu mới không khớp</FormFeedback>}
                        </div>
                    </Row>
                    <Row className="justify-content-center">
                        <Button className="saveBtn" color="primary" type="submit">
                            <span style={{ color: "#fff" }}>Lưu</span>
                        </Button>
                    </Row>
                </Form>
            </ModalBody>
        </Modal >
    )

}

export default ChangePass
