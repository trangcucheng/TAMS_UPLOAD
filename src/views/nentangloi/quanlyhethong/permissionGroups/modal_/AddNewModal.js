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
import { createPermission, deletePermission, updatePermission } from "../../../../../api/permissions"

const AddNewModal = ({ open, currentPage, rowsPerPage, getData, listGroup, setCurrentPage, handleModal, record }) => {
  const MySwal = withReactContent(Swal)

  const SignupSchema = yup.object().shape({
    permissionCode: yup.string().required("Vui lòng nhập mã quyền"),
    desciption: yup.string()
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
    const dataSubmit = {
      ...data,
      permissionGroupID: record?._id,
    }
    createPermission(dataSubmit)
      .then((res) => {
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
          handleModal()
          reset()
        })
      })
      .catch((err) => {
        MySwal.fire({
          title: "Thêm mới thất bại",
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
          <h2 className='mb-1'>Thêm mới quyền</h2>
        </div>
        <Form onSubmit={handleSubmit(addNew)}>
          <Row className="content-space-between">
            <div className="mb-1 col col-12">
              <Label className="form-label" for="permissionGroup">
                Nhóm quyền<span className="redColor">(*)</span>
              </Label>
              <Controller
                id="permissionGroup"
                name="permissionGroup"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={record?.permissionGroupName}
                    className={classnames({ "is-invalid": errors.permissionCode })}
                    readOnly
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
              <Label className="form-label" for="permissionCode">
                Mã quyền<span className="redColor">(*)</span>
              </Label>
              <Controller
                id="permissionCode"
                name="permissionCode"
                defaultValue=""
                control={control}
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
                Ghi chú
              </Label>
              <Controller
                id="description"
                name="description"
                defaultValue=""
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Nhập ghi chú"
                    invalid={errors.description && true}
                    className={classnames({ "is-invalid": errors.description })}
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
export default AddNewModal