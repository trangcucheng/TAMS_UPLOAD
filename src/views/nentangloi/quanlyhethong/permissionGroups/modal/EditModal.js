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
import { toDateString } from "../../../../../utility/Utils"
import Select from "react-select"
import * as yup from "yup"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import classnames from "classnames"
import { createGroupPermission, deleteGroupPermission, getGroupPermission, updateGroupPermission } from "../../../../../api/permissionGroups"
import { MESSAGES, MESSAGES_MEAN } from "../../../../../utility/constant"
const EditModal = ({ open, handleModal, getData, infoEdit, currentPage, rowsPerPage, groupType }) => {
  if (!infoEdit) return
  const MySwal = withReactContent(Swal)
  useEffect(() => {
  }, [infoEdit])

  const CloseBtn = (
    <X className="cursor-pointer" size={15} onClick={handleModal} />
  )

  const SignupSchema = yup.object().shape({
    permissionGroupName: yup.string().required("Vui lòng nhập tên nhóm quyền").test('is-only-spaces', 'Tên nhóm quyền không được để rỗng', (value) => {
      return !/^\s+$/.test(value)
    }),
    permissionGroupType: yup.object({
      value: yup.string().required(),
      label: yup.string().required()
    }).required('Vui lòng chọn loại nhóm quyền'),
    description: yup.string(),
  })
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(SignupSchema) })

  // ** Hooks

  const handleReset = () => {
    reset({
      permissionGroupName: '',
      permissionGroupType: '',
      description: "",
    })
  }
  const callEdit = (data) => {
    const dataSubmit = {
      permissionGroupName: data.permissionGroupName ?? infoEdit?.permissionGroupName,
      permissionGroupType: data.permissionGroupType ? data.permissionGroupType.value : infoEdit?.permissionGroupType,
      description: data.description ?? infoEdit?.description,
      permissionGroupId: infoEdit?._id
    }
    updateGroupPermission(dataSubmit)
      .then((res) => {
        MySwal.fire({
          title: "Chỉnh sửa thành công",

          icon: "success",
          customClass: {
            confirmButton: "btn btn-success",
          },
        }).then((result) => {
          handleModal()
          if (currentPage === 1) {
            getData(1, rowsPerPage)
          } else {
            setCurrentPage(1)
          }
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
        <h4 className="modal-title">Chỉnh sửa nhóm quyền</h4>
      </ModalHeader>
      <ModalBody className="flex-grow-1">
        <Form onSubmit={handleSubmit(callEdit)}>
          <Row className="content-space-between">
            <div className="mb-1 col col-12">
              <Label className="form-label" for="permissionGroupName">
                Tên nhóm quyền<span className="redColor">(*)</span>
              </Label>
              <Controller
                id="permissionGroupName"
                name="permissionGroupName"
                defaultValue={infoEdit?.permissionGroupName}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Nhập tên nhóm quyền"
                    invalid={errors.permissionGroupName && infoEdit?.permissionGroupName === ''}
                    className={classnames({ "is-invalid": errors.permissionGroupName })}
                  />
                )}
              />
              {errors.permissionGroupName && (
                <FormFeedback>Vui lòng nhập tên nhóm quyền</FormFeedback>
              )}
            </div>
          </Row>
          <Row className="content-space-between">
            <div className="mb-1 col col-12">
              <Label className="form-label" for="permissionGroupType">
                Loại nhóm quyền<span className="redColor">(*)</span>
              </Label>
              <Controller
                id="react-select"
                control={control}
                name="permissionGroupType"
                defaultValue={groupType.find(
                  (x) => x.value === infoEdit?.permissionGroupType
                )}
                render={({ field }) => (
                  <Select
                    isClearable
                    options={groupType}
                    classNamePrefix="select"
                    className={classnames('react-select', { 'is-invalid': errors.permissionGroupType })}
                    {...field}
                    placeholder="Chọn loại nhóm quyền"
                  />
                )}
              />
              {errors.permissionGroupType && (
                <FormFeedback>Vui lòng chọn loại nhóm quyền</FormFeedback>
              )}
            </div>
          </Row>
          <Row className="content-space-between">
            <div className="mb-1 col col-12">
              <Label className="form-label" for="description">
                Ghi chú
              </Label>
              <Controller
                id="description"
                name="description"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Nhập ghi chú"
                    invalid={errors.description && true}
                    className={classnames({ "is-invalid": errors.description })}
                    defaultValue={infoEdit?.description}
                  />
                )}
              />
              {errors.description && (
                <FormFeedback>Vui lòng nhập ghi chú</FormFeedback>
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
              onClick={() => handleModal()}
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
