import { Table, Input, Card, CardTitle, Tag, Popconfirm, Switch, Select } from "antd"
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
import { yupResolver } from "@hookform/resolvers/yup"
import classnames from "classnames"
import { MESSAGES, MESSAGES_MEAN } from "../../../../../utility/constant"
import { createManyPermission, getPermissionNoGroup } from "../../../../../api/permissions"
const AddNewModal = ({ open, handleModal, getData, currentPage, rowsPerPage, infoEdit }) => {
  if (!infoEdit) return
  const [loading, setLoading] = useState(false)
  const [listSelected, setListSelected] = useState([])
  const [listPerNo, setListPerNo] = useState([])

  const MySwal = withReactContent(Swal)
  const getData_ = () => {
    getPermissionNoGroup({
      params: {
        page: 1,
        limit: 500,
      },
    })
      .then((res) => {
        const { count, data } = res[0]
        setListPerNo(data)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  useEffect(() => {
    getData_()
  }, [infoEdit])
  const handleModalPer = () => {
    handleModal()
  }
  const CloseBtn = (
    <X className="cursor-pointer" size={15} onClick={handleModalPer} />
  )
  const _handleCheckRoleAction = (per) => {
    setListSelected((pre) => [
      ...pre,
      per?._id
    ])
  }
  const handleUpdateMany = () => {
    const dataSubmit = {
      permissionGroupID: infoEdit?._id,
      permissionIDArr: listSelected,
    }
    createManyPermission(JSON.stringify(dataSubmit)).then((res) => {
      MySwal.fire({
        title: "Cập nhật thành công",

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
        getData_()
        handleModalPer()
      })
    })
      .catch((err) => {
        MySwal.fire({
          title: "Cập nhật thất bại",
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
      toggle={handleModalPer}
      contentClassName="pt-0"
      autoFocus={false}
      className="modal-md"
      style={{ backgroundColor: '#fff' }}
    >
      <ModalHeader
        className=""
        toggle={handleModalPer}
        close={CloseBtn}
        tag="div"
        style={{ color: '#09A863', backgroundColor: '#fff' }}
      >
        <h4 className="modal-title"
        >Thêm quyền cho nhóm quyền</h4>
      </ModalHeader>
      <ModalBody className="flex-grow-1" style={{ maxHeight: '480px' }}>
        <Form style={{ marginBottom: '2rem' }}>
          <h5>Tên nhóm quyền:</h5>
          <Input value={infoEdit?.permissionGroupName} readOnly style={{ marginBottom: '1.5rem' }} />
          <h5>Chọn danh sách quyền:</h5>
          <table
            className="table-flush-spacing"
            responsive
            style={{ width: "100%" }}
          >
            <tbody>
              {listPerNo.map((per, index) => {
                return (
                  <tr key={index} style={{ height: '35px' }}>
                    <td
                      className="text-nowrap"
                      style={{ width: "30%", marginBottom: '2rem' }}
                    >
                      {per.permissionCode} - {per.description}
                    </td>
                    <td>
                      <div
                        className="form-check me-2"
                        key={per._id}
                        style={{ minWidth: "7rem" }}
                      >
                        <Input
                          type="checkbox"
                          style={{ cursor: "pointer", marginRight: "1rem", height: '20px' }}
                          className="action-cb"
                          id={`${per._id}`}
                          // checked={listUserRoles?.find(x => x === per._id)}
                          onChange={(e) => _handleCheckRoleAction(per)
                          }
                        />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Form>
      </ModalBody>
      <div className="d-flex justify-content-center" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
        <Button className="me-1 saveBtn" color="primary"
          onClick={() => {
            handleUpdateMany()
          }}
        >
          Lưu
        </Button>
        <Button
          outline
          className="cancelBtn"
          color="secondary"
          type="reset"
          onClick={() => handleModalPer()}
        >
          Hủy
        </Button>
      </div>
    </Modal>
  )
}
export default AddNewModal
