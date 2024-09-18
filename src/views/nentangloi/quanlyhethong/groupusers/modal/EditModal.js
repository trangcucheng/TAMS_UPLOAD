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
import { createGroupUser, deleteGroupUser, updateGroupUser } from "../../../../../api/groupusers"

const EditModal = ({ open, handleModal, getData, currentPage, rowsPerPage, infoEdit }) => {
  if (!infoEdit) return
  const MySwal = withReactContent(Swal)
  useEffect(() => {
  }, [infoEdit])

  const CloseBtn = (
    <X className="cursor-pointer" size={15} onClick={handleModal} />
  )

  const SignupSchema = yup.object().shape({
    groupName: yup.string().default(infoEdit?.groupName).test('is-only-spaces', 'Tên nhóm người dùng không được để rỗng', (value) => {
      return !/^\s+$/.test(value)
    }),
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
      groupName: '',
      description: "",
    })
  }
  const callEdit = (data) => {
    const dataSubmit = {
      groupName: data.groupName ?? infoEdit?.groupName,
      description: data.description ?? infoEdit?.description,
      userGroupId: infoEdit?._id
    }
    updateGroupUser(dataSubmit)
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
        <h4 className="modal-title">Chỉnh sửa nhóm người dùng</h4>
      </ModalHeader>
      <ModalBody className="flex-grow-1">
        <Form onSubmit={handleSubmit(callEdit)}>
          <Row className="content-space-between">
            <div className="mb-1 col col-12">
              <Label className="form-label" for="groupName">
                Tên nhóm người dùng<span className="redColor">(*)</span>
              </Label>
              <Controller
                id="groupName"
                name="groupName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Nhập tên nhóm người dùng"
                    invalid={errors.groupName && infoEdit?.groupName === ''}
                    className={classnames({ "is-invalid": errors.groupName })}
                    defaultValue={infoEdit?.groupName}
                  />
                )}
              />
              {errors.groupName && (
                <FormFeedback>Vui lòng nhập tên nhóm người dùng</FormFeedback>
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
            <Button className="me-1" color="primary" type="submit" className='saveBtn' style={{ marginRight: '1rem' }}>
              Lưu
            </Button>
            <Button
              outline
              color="secondary"
              type="reset"
              className="cancelBtn"
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
