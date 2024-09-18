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
import { getGroupPermission } from "../../../../../api/permissionGroups"
import { getPermission, createPermission, deletePermission, updatePermission } from "../../../../../api/permissions"
import { MESSAGES, MESSAGES_MEAN } from "../../../../../utility/constant"
const EditModal = ({ open, currentPage, rowsPerPage, getData, listGroup, infoEdit, setCurrentPage, handleModal }) => {
  if (!infoEdit) return
  const MySwal = withReactContent(Swal)

  useEffect(() => {

  }, [infoEdit])

  const SignupSchema = yup.object().shape({
    permissionCode: yup.string().required("Vui lòng nhập mã quyền"),
    permissionGroupID: yup.object().shape({
      value: yup.string().required(),
      label: yup.string().required()
    }).required('Vui lòng chọn phân hệ'),
    description: yup.string().required('Vui lòng nhập tên quyền')
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

  const editPermission = (data) => {
    const dataSubmit = {
      permissionId: infoEdit?._id,
      permissionCode: data.permissionCode ?? infoEdit?.permissionCode,
      permissionGroupID: data.permissionGroupID?.value.toString(),
      description: data.description ?? infoEdit?.description
    }
    updatePermission(dataSubmit)
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
        })
      })
      .catch((err) => {
        MySwal.fire({
          title: MESSAGES_MEAN[err?.response?.data?.message] ?? "Chỉnh sửa thất bại",
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
      autoFocus={false}
      className="modal-dialog-top modal-md"
    >
      <ModalHeader className='bg-transparent' toggle={handleModal}>
      </ModalHeader>
      <ModalBody className='px-sm-3 mx-50 pb-2' style={{ paddingTop: 0 }}>
        <div className='text-center mb-1'>
          <h2 className='mb-1'>Chỉnh sửa quyền</h2>
        </div>
        <Form onSubmit={handleSubmit(editPermission)}>
          <Row className="content-space-between">
            <div className="mb-1 col col-12">
              <Label className="form-label" for="permissionCode">
                Mã quyền<span className="redColor">(*)</span>
              </Label>
              <Controller
                id="permissionCode"
                name="permissionCode"
                control={control}
                defaultValue={infoEdit?.permissionCode}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Nhập mã quyền"
                    invalid={errors.permissionCode && true}
                    className={classnames({ "is-invalid": errors.permissionCode })}
                  />
                )}
              />
              {errors.permissionCode && (
                <FormFeedback>Vui lòng nhập mã quyền</FormFeedback>
              )}
            </div>
          </Row>
          <Row className="content-space-between">
            <div className="mb-1 col col-12">
              <Label className="form-label" for="description">
                Tên quyền<span className="redColor">(*)</span>
              </Label>
              <Controller
                id="description"
                name="description"
                control={control}
                defaultValue={infoEdit?.description}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Nhập tên quyền"
                    invalid={errors.description && true}
                    className={classnames({ "is-invalid": errors.description })}
                  />
                )}
              />
              {errors.description && (
                <FormFeedback>Vui lòng nhập tên quyền</FormFeedback>
              )}
            </div>
          </Row>
          <Row className="content-space-between">
            <div className="mb-1 col col-12">
              <Label className="form-label" for="react-select">
                Chọn phân hệ<span className="redColor">(*)</span>
              </Label>
              <Controller
                id="react-select"
                control={control}
                name="permissionGroupID"
                defaultValue={listGroup.find(x => x.label === infoEdit?.permissionGroupName)}
                render={({ field }) => (
                  <Select
                    isClearable
                    options={listGroup}
                    classNamePrefix="select"
                    className={classnames('react-select', { 'is-invalid': errors.permissionGroupID })}
                    {...field}
                    placeholder="Chọn phân hệ"
                  />
                )}
              />
              {errors.permissionGroupID && (
                <FormFeedback>Vui lòng chọn phân hệ</FormFeedback>
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