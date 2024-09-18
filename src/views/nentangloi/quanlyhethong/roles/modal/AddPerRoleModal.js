import {
  Table,
  Input,
  Card,
  CardTitle,
  Tag,
  Popconfirm,
  Switch,
  Collapse,
  Select,
  Checkbox,
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
  createRoleWithManyPer
} from "../../../../../api/rolePermissions"
import { getPermission, listPerNotInRole } from "../../../../../api/permissions"
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
const listActions = [
  {
    id: "0",
    label: "Xem",
    value: "read",
  },
  {
    id: "1",
    label: "Thêm",
    value: "create",
  },
  {
    id: "2",
    label: "Sửa",
    value: "update",
  },
  {
    id: "3",
    label: "Xóa",
    value: "delete",
  },
  {
    id: "4",
    label: "Phê duyệt",
    value: "print",
  },
]
const AddNewModal = ({
  open,
  handleModal,
  getData,
  currentPage,
  rowsPerPage,
  roleSelected,
  listSubmit
}) => {
  const MySwal = withReactContent(Swal)
  const [listPermission, setListPermission] = useState()
  const [selectedPer, setSelectedPer] = useState()
  const [listActs, setListActs] = useState(['read'])
  useEffect(() => {
    listPerNotInRole({
      params: {
        page: 1,
        limit: 5000,
        roleID: roleSelected?._id
      },
    })
      .then((res) => {
        const { count, data } = res[0]
        const temp = data?.map((single, index) => {
          return {
            id: single._id,
            label: single.description,
            value: single.description,
            code: single.permissionCode
          }
        })
        setListPermission(temp)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])
  const CloseBtn = (
    <X className="cursor-pointer" size={15} onClick={handleModal} />
  )

  const handleUpdate = () => {
    const arr = listActs.map((act, index) => {
      listSubmit.push({
        permissionID: selectedPer?.id,
        actionContent: act,
        isActive: 1,
        roleID: roleSelected?._id
      })
    })

    const dataSubmit = {
      roleID: roleSelected?._id,
      isActive: 1,
      arrContent: listSubmit,
      actionTime: "2023-09-13T04:08:14.369Z",
    }
    updateRoleManyPer(dataSubmit)
      .then((res) => {
        MySwal.fire({
          title: "Thêm mới thành công",

          icon: "success",
          customClass: {
            confirmButton: "btn btn-success",
          },
        }).then((result) => {
          getData(1, 10)
          // handleModal()
          setListActs(['read'])
          setSelectedPer()
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
          <h2 className='mb-1'>Thêm mới quyền cho vai trò</h2>
        </div>
        <Form>
          <Row className="content-space-between">
            <div className="mb-1 col col-12">
              <Label className="form-label" for="name">
                Tên quyền<span className="redColor">(*)</span>
              </Label>
              <Select
                style={{
                  width: "100%",
                }}
                placeholder="Chọn tên quyền"
                mode="tags"
                filterOption={true}
                value={selectedPer}
                onChange={(e) => {
                  const index = e?.length - 1
                  setSelectedPer(listPermission.find((u) => u.value === e[index]))
                }}
                options={listPermission}
              />
            </div>
          </Row>
          <Row className="content-space-between">
            <div className="mb-1 col col-12">
              <Label className="form-label" for="description">
                Mã quyền<span className="redColor">(*)</span>
              </Label>
              <Input
                placeholder="Nhập mã quyền"
                value={selectedPer?.code}
                readOnly
              />
            </div>
          </Row>
          <Row className="content-space-between">
            <div className="mb-1 col col-12">
              <Label
                className="form-label"
                for="description"
                style={{ width: "100%" }}
              >
                Quyền hoạt động<span className="redColor">(*)</span>
              </Label>
              <div
                className="d-flex"
                style={{ flexWrap: "wrap" }}
              >
                {listActions.map((item, ind) => {
                  const isCheck = listActs?.find((x) => x === item.value)
                  return (
                    <div className="col col-4">
                      <Label for={item.value} style={{ marginRight: "1rem" }}>
                        {item.label}
                      </Label>
                      <Checkbox
                        key={ind}
                        checked={isCheck || false}
                        onChange={(e) => {
                          if (isCheck) {
                            setListActs((pre) => pre.filter((x) => x !== item.value)
                            )
                          } else {
                            setListActs((pre) => ([
                              ...pre,
                              item.value
                            ]))
                          }
                        }}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </Row>
          <div className="d-flex justify-content-center" style={{ marginTop: '1rem' }}>
            <Button className="me-1 saveBtn" color="primary" onClick={(e) => handleUpdate()}>
              Lưu{" "}
            </Button>
            <Button
              outline
              color="secondary"
              className="cancelBtn"
              type="reset"
              onClick={() => {
                handleModal()
                setSelectedPer()
              }
              }
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
