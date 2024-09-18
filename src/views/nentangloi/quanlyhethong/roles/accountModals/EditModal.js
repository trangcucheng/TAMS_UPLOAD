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

const EditModal = ({ open, handleModal, listGroup, listStatus, getData, infoEdit, currentPage, rowsPerPage }) => {
  if (!infoEdit) return
  const MySwal = withReactContent(Swal)
  const [userGroupID_, setUserGroupID] = useState(null)
  const [isActive_, setIsActive] = useState(null)

  useEffect(() => {

  }, [infoEdit])

  const SignupSchema = yup.object().shape({
    userName: yup.string().required("Vui lòng nhập tên đăng nhập").test('is-only-spaces', 'Vui lòng nhập đúng định dạng', (value) => {
      return /^[^\s\u0080-\uFFFF]+$/.test(value)
    }).max(256, 'Tên đăng nhập không được vượt quá 256 ký tự'),
    fullName: yup.string().required("Vui lòng nhập họ và tên").test('is-only-spaces', 'Họ và tên không được để trống', (value) => {
      return !/^\s+$/.test(value)
    }).max(256, 'Họ và tên không được vượt quá 256 ký tự'),
    identity: yup.string().matches(/^[0-9]+$/, "Vui lòng nhập đúng định dạng số").min(9, 'Vui lòng nhập 9 hoặc 12 số').max(12, 'Vui lòng nhập 9 hoặc 12 số'),
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

  const editUser = (data) => {
    delete data.passWord_
    delete data.passWord
    const dataSubmit = {
      ...data,
      userId: infoEdit._id,
      isActive: data.isActive?.value,
      userGroupID: data.userGroupID?.value,
    }
    updateUser(dataSubmit)
      .then((res) => {
        MySwal.fire({
          title: "Chỉnh sửa thành công",

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
          handleModal()
          reset()
        })
      })
      .catch((err) => {
        MySwal.fire({
          title: "Chỉnh sửa thất bại",
          icon: "error",
          customClass: {
            confirmButton: "btn btn-danger",
          },
        })
      })
  }

  return (
    <Modal
      isOpen={open}
      toggle={handleModal}
      contentClassName="pt-0"
      autoFocus={false}
      className="modal-md"
    >
      <ModalHeader
        className=""
        toggle={handleModal}
        close={CloseBtn}
        tag="div"
      >
        <h4 className="modal-title">Chỉnh sửa tài khoản</h4>
      </ModalHeader>
      <ModalBody className="flex-grow-1">
        <Form onSubmit={handleSubmit(editUser)}>
          <Row className="content-space-between">
            <div className="mb-1 col col-12">
              <Label className="form-label" for="fullName">
                Họ và tên<span className="redColor">(*)</span>
              </Label>
              <Controller
                id="fullName"
                name="fullName"
                defaultValue={infoEdit?.fullName}
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
                control={control}
                defaultValue={infoEdit?.userName}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder=""
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
                control={control}
                defaultValue={infoEdit?.identity}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder=""
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
          {/* <Row className="content-space-between">
          <div className="mb-1 col col-6">
            <Label className="form-label" for="passWord">
              Mật khẩu<span className="redColor">(*)</span>
            </Label>
            <Controller
              id="passWord"
              name="passWord"
              control={control}
              defaultValue={infoEdit?.passWord}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder=""
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
              control={control}
              defaultValue={infoEdit?.passWord}
              render={({ field }) => (
                <Input
                  {...field}
                  type="passWord"
                  placeholder=""
                  invalid={errors.passWord_ && true}
                  className={classnames({ "is-invalid": errors.passWord_ })}
                />
              )}
            />
            {errors.passWord_ && (
              <FormFeedback>Vui lòng nhập lại mật khẩu</FormFeedback>
            )}
          </div>
        </Row> */}
          <Row className="content-space-between">
            <div className="mb-1 col col-6">
              <Label className="form-label" for="email">
                Email<span className="redColor">(*)</span>
              </Label>
              <Controller
                id="email"
                name="email"
                defaultValue={infoEdit?.email}
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
                defaultValue={listStatus.find(
                  (x) => x.value === infoEdit?.isActive
                )}
                render={({ field }) => (
                  <Select
                    isClearable
                    options={listStatus}
                    classNamePrefix="select"
                    className={classnames("react-select")}
                    {...field}
                    placeholder="Chọn trạng thái"

                  // onChange={(e) => {
                  //   setIsActive(e.value)
                  // }}
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
              <Button className="saveBtn" color="primary" type="submit">
                Lưu
              </Button>
            </div>
            <div className="mb-1 col col-6">
              <Button
                outline
                className="cancelBtn"
                color="secondary"
                type="reset"
                onClick={() => handleModal()}
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
export default EditModal
