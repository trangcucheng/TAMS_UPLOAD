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
import { getDetailUserById } from "../../../../../api/users"
import { toDateString } from "../../../../../utility/Utils"
import { yupResolver } from "@hookform/resolvers/yup"
import classnames from "classnames"
import { MESSAGES, MESSAGES_MEAN } from "../../../../../utility/constant"
import { updateUserManyRole } from "../../../../../api/userRoles"
import { getRole } from "../../../../../api/roles"
const PermissModal = ({ open, handleModal, getData, currentPage, rowsPerPage, infoEdit }) => {
  if (!infoEdit) return
  const [loading, setLoading] = useState(false)
  const [listUserRoles, setUserRoles] = useState([])
  const [listAllRole, setListAllRole] = useState([])

  const MySwal = withReactContent(Swal)
  useEffect(() => {
    getRole({
      params: {
        page: 1,
        limit: 500,
      },
    })
      .then((res) => {
        const { count, data } = res[0]
        const temp = data?.map((single, index) => {
          return {
            value: single._id,
            label: single.name,
          }
        })
        setListAllRole(temp)
      })
      .catch((err) => {
        console.log(err)
      })
    getDetailUserById({
      params: {
        userId: infoEdit?._id,
      },
    })
      .then((res) => {
        const temp = res.userRoles?.map((item, index) => {
          return item?._id
        })
        setUserRoles(temp)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [infoEdit])
  const handleModalPer = () => {
    handleModal()
    setUserRoles()
  }
  const CloseBtn = (
    <X className="cursor-pointer" size={15} onClick={handleModalPer} />
  )

  //   const _handleCheckRoleAction = (role) => {
  //     setUserRoles(pre => {
  //       const isChecked = listUserRoles.find(x => x === role._id)
  //       if (isChecked) {
  //         return listUserRoles.filter(x => x !== role._id)
  //       } else {
  //         return [
  //           ...pre,  
  //           role._id,
  //       ]
  //       }
  //     })
  //   }
  const handleChange = (e) => {
    setUserRoles(e)
  }
  const handleUpdateMany = () => {
    const dataSubmit = {
      userID: infoEdit?._id,
      roleIDArr: listUserRoles,
      description: ''
    }
    updateUserManyRole(JSON.stringify(dataSubmit)).then((res) => {
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
        style={{ color: '#09A863', borderBottom: '1px solid', backgroundColor: '#fff' }}
      >
        <h4 className="modal-title" style={{ color: '#09A863' }}
        >Phân quyền người dùng</h4>
      </ModalHeader>
      <ModalBody className="flex-grow-1" style={{}}>
        <Form style={{ marginTop: '1rem', marginBottom: '2rem' }}>
          <h5>Họ tên người dùng:</h5>
          <Input value={infoEdit?.fullName} readOnly style={{ marginBottom: '1.5rem' }} />
          <h5>Vai trò:</h5>
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="Chọn vai trò người dùng"
            value={listUserRoles}
            onChange={(e) => handleChange(e)}
            options={listAllRole}
          />
          {/* <table
          className="table-flush-spacing"
          responsive
          style={{ width: "100%" }}
        >
          <tbody>
            {listAllRole.map((role, index) => {
              return (
                <tr key={index} style={{height: '35px'}}>
                  <td
                    className="text-nowrap"
                    style={{ width: "30%", marginBottom: '2rem' }}
                  >
                    {role.name}
                  </td>
                  <td>
                    <div
                      className="form-check me-2"
                      key={role._id}
                      style={{ minWidth: "7rem" }}
                    >
                      <Input
                        type="checkbox"
                        style={{ cursor: "pointer", marginRight: "1rem", height: '20px'}}
                        className="action-cb"
                        id={`${role._id}`}
                        checked={listUserRoles?.find(x => x === role._id)}
                        onChange={(e) => _handleCheckRoleAction(role)
                        }
                      />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table> */}
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
export default PermissModal
