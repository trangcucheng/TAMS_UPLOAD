import {
  Table,
  Input,
  Card,
  CardTitle,
  Tag,
  Popconfirm,
  Switch,
  Collapse,
} from "antd"
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
  CardBody,
} from "reactstrap"
import { Link } from "react-router-dom"
import { Plus, X } from "react-feather"
import {
  AppstoreAddOutlined,
  DeleteOutlined,
  EditOutlined,
  LockOutlined,
} from "@ant-design/icons"
import style from "../../../../../assets/scss/index.module.scss"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { toDateString } from "../../../../../utility/Utils"
import AvatarGroup from "@components/avatar-group"
import Select from "react-select"
import * as yup from "yup"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import classnames from "classnames"
import {
  getRole,
  createRole,
  updateRole,
  deleteRole,
} from "../../../../../api/roles"
import { getGroupPermission } from "../../../../../api/permissionGroups"
import {
  getPerByRoleId,
  updateRoleManyPer,
} from "../../../../../api/rolePermissions"
import { getPermission } from "../../../../../api/permissions"
const listStatus = [
  {
    value: 1,
    label: "Đang hoạt động",
  },
  {
    value: 0,
    label: "Bị khóa",
  },
]

const EditModal = ({ open, handleModal, getData, currentPage, rowsPerPage, infoEdit }) => {
  if (!infoEdit) return
  const MySwal = withReactContent(Swal)

  useEffect(() => {
  }, [infoEdit])
  const SignupSchema = yup.object().shape({
    name: yup.string().required("Vui lòng nhập tên vai trò"),
    isActive: yup.object().shape({
      value: yup.number().required(),
      label: yup.string().required()
    }).required('Vui lòng chọn trạng thái hoạt động'),
    description: yup.string().required("Vui lòng nhập mã vai trò"),
  })

  // ** Hooks
  const {
    reset,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(SignupSchema) })
  const handleModal_ = () => {
    handleModal()
    reset()
  }
  const CloseBtn = (
    <X className="cursor-pointer" size={15} onClick={handleModal_} />
  )

  const editRole = (data) => {
    const dataSubmit = {
      ...data,
      roleId: infoEdit?._id,
      isActive: data?.isActive?.value,
    }
    updateRole(dataSubmit)
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
          handleModal_()
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
      toggle={handleModal_}
      autoFocus={false}
      className="modal-dialog-top modal-md"
    >
      <ModalHeader className='bg-transparent' toggle={handleModal_}>
      </ModalHeader>
      <ModalBody className='px-sm-3 mx-50 pb-2' style={{ paddingTop: 0 }}>
        <div className='text-center mb-1'>
          <h2 className='mb-1'>Chỉnh sửa vai trò</h2>
        </div>
        <Form onSubmit={handleSubmit(editRole)}>
          <Row className="content-space-between">
            <div className="mb-1 col col-12">
              <Label className="form-label" for="name">
                Tên vai trò<span className="redColor">(*)</span>
              </Label>
              <Controller
                id="name"
                name="name"
                control={control}
                defaultValue={infoEdit?.name}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder=""
                    invalid={errors.name && true}
                    className={classnames({
                      "is-invalid": errors.name,
                    })}
                  />
                )}
              />
              {errors.name && (
                <FormFeedback>Vui lòng nhập tên vai trò</FormFeedback>
              )}
            </div>
          </Row>
          <Row className="content-space-between">
            <div className="mb-1 col col-12">
              <Label className="form-label" for="description">
                Mã vai trò<span className="redColor">(*)</span>
              </Label>
              <Controller
                id="description"
                name="description"
                defaultValue=""
                control={control}
                defaultValue={infoEdit?.description}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Nhập mã vai trò"
                    invalid={errors.description && true}
                    className={classnames({
                      "is-invalid": errors.description,
                    })}
                  />
                )}
              />
              {errors.description && (
                <FormFeedback>Vui lòng nhập mã vai trò</FormFeedback>
              )}
            </div>
          </Row>
          <Row className="content-space-between">
            <div className="mb-1 col col-12">
              <Label className="form-label" for="react-select">
                Trạng thái hoạt động
                <span className="redColor">(*)</span>
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
                  />
                )}
              />
              {errors.isActive && (
                <FormFeedback>
                  Vui lòng chọn trạng thái hoạt động
                </FormFeedback>
              )}
            </div>
          </Row>
          <div className="d-flex justify-content-center">
            <Button className="me-1 saveBtn" color="primary" type="submit">
              Lưu
            </Button>
            <Button
              outline
              color="secondary"
              className="cancelBtn"
              type="reset"
              onClick={() => handleModal_()}
            >
              Hủy
            </Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  )
}
export default EditModal
