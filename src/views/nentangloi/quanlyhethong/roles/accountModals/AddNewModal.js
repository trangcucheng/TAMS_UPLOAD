import { Table, Input, Card, CardTitle, Tag, Popconfirm, Switch } from "antd"
import { useState, Fragment, useEffect, useRef } from "react"
import {
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Button,
  Row,
  Col,
  FormFeedback,
  UncontrolledTooltip,
} from "reactstrap"
import { Plus, X } from "react-feather"
import { DeleteOutlined, EditOutlined, LockOutlined } from "@ant-design/icons"
import style from "../../../../../assets/scss/index.module.scss"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { listAllUser, deleteUser, createUser, updateUser } from "../../../../../api/users"
import { toDateString } from "../../../../../utility/Utils"
import Select from "react-select"
import * as yup from "yup"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import classnames from "classnames"
import { MESSAGES, MESSAGES_MEAN } from "../../../../../utility/constant"
import { updateUserManyRole } from "../../../../../api/userRoles"
const AddNewModal = ({ open, handleModal, getData, listStatus, currentPage, rowsPerPage, roleSelected }) => {
  const [loading, setLoading] = useState(false)
  const MySwal = withReactContent(Swal)
  const [userGroupID_, setUserGroupID] = useState(null)
  const [isActive_, setIsActive] = useState(null)

  const SignupSchema = yup.object().shape({
    userName: yup.string().required("Vui lòng nhập tên đăng nhập").test('is-only-spaces', 'Vui lòng nhập đúng định dạng', (value) => {
      return /^[^\s\u0080-\uFFFF]+$/.test(value)
    }).max(256, 'Tên đăng nhập không được vượt quá 256 ký tự'),
    fullName: yup.string().required("Vui lòng nhập họ và tên").test('is-only-spaces', 'Họ và tên không được để trống', (value) => {
      return !/^\s+$/.test(value)
    }).max(256, 'Họ và tên không được vượt quá 256 ký tự'),
    identity: yup.string().matches(/^[0-9]+$/, "Vui lòng nhập đúng định dạng số").min(9, 'Vui lòng nhập 9 hoặc 12 số').max(12, 'Vui lòng nhập 9 hoặc 12 số'),
    passWord: yup.string().required("Vui lòng nhập mật khẩu"),
    passWord_: yup.string().required("Vui lòng nhập lại mật khẩu").oneOf([yup.ref("passWord"), null], "Mật khẩu không khớp"),
    isActive: yup.object({
      value: yup.number().required(),
      label: yup.string().required()
    }).required("Vui lòng chọn trạng thái hoạt động"),
    email: yup.string().email("Vui lòng nhập đúng định dạng email").required("Vui lòng nhập email")
  })
  // ** Hooks
  const {
    reset,
    control,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(SignupSchema) })

  const CloseBtn = (
    <X className="cursor-pointer" size={15} onClick={handleModal} />
  )

  const addNew = (data) => {
    setLoading(true)
    const dataSubmit = {
      ...data,
      identity: data.identity?.toString(),
      isActive: data.isActive?.value,
      userGroupID: data.userGroupID?.value.toString(),
    }
    delete dataSubmit.passWord_
    createUser(dataSubmit)
      .then((res) => {
        console.log(res)
        const id = res?._id
        const dataSubmit_ = {
          userID: id,
          roleIDArr: [roleSelected?.id],
          description: ''
        }
        updateUserManyRole(JSON.stringify(dataSubmit_)).then((res_) => {
          MySwal.fire({
            title: "Thêm mới thành công",
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
            setLoading(false)
            handleModal()
            reset()
          })
        }).catch((err_) => {
          console.log(err_)
          MySwal.fire({
            title: MESSAGES_MEAN[err_?.response?.data?.message] ?? "Thêm mới thất bại",
            icon: "error",
            customClass: {
              confirmButton: "btn btn-danger",
            },
          })
        })
      })
      .catch((err) => {
        MySwal.fire({
          title: MESSAGES_MEAN[err?.response?.data?.message] ?? "Thêm mới thất bại",
          icon: "error",
          customClass: {
            confirmButton: "btn btn-danger",
          },
        })
      })
    setLoading(false)
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
          <h2 className='mb-1'>Thêm mới tài khoản</h2>
        </div>
        <Form onSubmit={handleSubmit(addNew)}>
          <Row className="content-space-between">
            <div className="mb-1 col col-12">
              <Label className="form-label" for="fullName">
                Họ và tên<span className="redColor">(*)</span>
              </Label>
              <Controller
                id="fullName"
                name="fullName"
                defaultValue=""
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Nhập họ và tên"
                    invalid={errors.fullName && true}
                    className={classnames({ "is-invalid": errors.fullName })}
                  />
                )}
              />
              {errors.fullName && (
                <FormFeedback>{errors.fullName?.message}</FormFeedback>
              )}
            </div>
          </Row>
          <Row className="content-space-between">
            <div className="mb-1 col col-6">
              <Label className="form-label" for="userName">
                Tên đăng nhập<span className="redColor">(*)</span>
              </Label>
              <Controller
                id="userName"
                name="userName"
                defaultValue=""
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Nhập tên đăng nhập"
                    invalid={errors.userName && true}
                    className={classnames({ "is-invalid": errors.userName })}
                  />
                )}
              />
              {errors.userName && (
                <FormFeedback>{errors.userName?.message}</FormFeedback>
              )}
            </div>
            <div className="mb-1 col col-6">
              <Label className="form-label" for="identity">
                CMND/CCCD<span className="redColor">(*)</span>
              </Label>
              <Controller
                id="identity"
                name="identity"
                defaultValue=""
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Nhập CCCD/CMND"
                    invalid={errors.identity && true}
                    className={classnames({ "is-invalid": errors.identity })}
                  />
                )}
              />
              {errors.identity && (
                <FormFeedback>{errors.identity?.message}</FormFeedback>
              )}
            </div>
          </Row>
          <Row className="content-space-between">
            <div className="mb-1 col col-6">
              <Label className="form-label" for="passWord">
                Mật khẩu<span className="redColor">(*)</span>
              </Label>
              <Controller
                id="passWord"
                name="passWord"
                defaultValue=""
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Nhập mật khẩu"
                    type="passWord"
                    invalid={errors.passWord && true}
                    className={classnames({ "is-invalid": errors.passWord })}
                  />
                )}
              />
              {errors.passWord && (
                <FormFeedback>Vui lòng nhập mật khẩu</FormFeedback>
              )}
            </div>
            <div className="mb-1 col col-6">
              <Label className="form-label" for="passWord_">
                Nhập lại mật khẩu<span className="redColor">(*)</span>
              </Label>
              <Controller
                id="passWord_"
                name="passWord_"
                defaultValue=""
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="passWord"
                    placeholder="Nhập lại mật khẩu"
                    invalid={errors.passWord_ && true}
                    className={classnames({ "is-invalid": errors.passWord_ })}
                  />
                )}
              />
              {errors.passWord_ && (
                <FormFeedback>Vui lòng nhập lại mật khẩu</FormFeedback>
              )}
            </div>
          </Row>
          <Row className="content-space-between">
            <div className="mb-1 col col-6">
              <Label className="form-label" for="email">
                Email<span className="redColor">(*)</span>
              </Label>
              <Controller
                id="email"
                name="email"
                defaultValue=""
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Nhập email"
                    invalid={errors.email && true}
                    className={classnames({ "is-invalid": errors.email })}
                  />
                )}
              />
              {errors.email && (
                <FormFeedback>{errors.email?.message}</FormFeedback>
              )}
            </div>
            <div className="mb-1 col col-6">
              <Label className="form-label" for="react-select">
                Trạng thái hoạt động<span className="redColor">(*)</span>
              </Label>
              <Controller
                id="react-select"
                control={control}
                name="isActive"
                defaultValue={listStatus[0]}
                render={({ field }) => (
                  <Select
                    isClearable
                    options={listStatus}
                    classNamePrefix="select"
                    className={classnames('react-select', { 'is-invalid': errors.isActive })}
                    {...field}
                    placeholder="Chọn trạng thái"
                  />
                )}
              />
              {errors.isActive && (
                <FormFeedback>Vui lòng chọn trạng thái hoạt động</FormFeedback>
              )}
            </div>
          </Row>
          <Row className="content-space-between">
            <div className="mb-1 col col-6 buttonRight">
              <Button className="saveBtn" color="primary" type="submit" disabled={loading}>
                {loading ? <div className='loader'></div> : 'Lưu'}
              </Button>
            </div>
            <div className="mb-1 col col-6">
              <Button
                outline
                color="secondary"
                type="reset"
                className="cancelBtn"
                onClick={() => {
                  reset()
                  handleModal()
                }
                }
              >
                Hủy
              </Button>
            </div>
          </Row>
        </Form>
      </ModalBody>
    </Modal>
  )
}
export default AddNewModal
