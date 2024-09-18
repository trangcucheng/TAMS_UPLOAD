import { Table, Input, Card, CardTitle, Tag, Popconfirm, Switch } from "antd"
import React, { useState, Fragment, useEffect, useRef, useContext } from "react"
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
import {
  DeleteOutlined,
  EditOutlined,
  LockOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons"
import style from "../../../../assets/scss/index.module.scss"
import Swal from "sweetalert2"
import { AbilityContext } from '@src/utility/context/Can'
import withReactContent from "sweetalert2-react-content"
import {
  listAllUser,
  deleteUser,
  createUser,
  updateUser,
  getDetailUserById,
} from "../../../../api/users"
import { listAllOrganization } from "../../../../api/organizations"
import { toDateString } from "../../../../utility/Utils"
import Select from "react-select"
import * as yup from "yup"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import classnames from "classnames"
import { getGroupUser } from "../../../../api/groupusers"
import { getRole } from "../../../../api/roles"
import PurePanel from "antd/es/tooltip/PurePanel"
import { updateUserManyRole } from "../../../../api/userRoles"
import { selectThemeColors } from '@utils'

const ListUserRoles = () => {
  const MySwal = withReactContent(Swal)
  // const [data, setData] = useState([])
  const ability = useContext(AbilityContext)
  const [selected, setSelected] = useState()
  const [data, setData] = useState()
  const [count, setCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerpage] = useState(10)
  const [search, setSearch] = useState("")
  const [isAdd, setIsAdd] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [userGroupID_, setUserGroupID] = useState(null)
  const [isActive_, setIsActive] = useState(null)
  const [listGroup, setListGroup] = useState([])
  const [listUserRoles, setUserRoles] = useState([])
  const [isPer, setIsPer] = useState(false)
  const [listAllRole, setListAllRole] = useState([])
  const [info, setInfo] = useState(null)
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
  const getData = (page, limit, search) => {
    listAllUser({
      params: {
        page,
        limit,
        ...(search && search !== "" && { search }),
      },
    })
      .then((res) => {
        const { count, data } = res[0]
        setData(data)
        setCount(count[0]?.count)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  useEffect(() => {
    getGroupUser({
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
            label: single.groupName,
          }
        })
        setListGroup(temp)
      })
      .catch((err) => {
        console.log(err)
      })
    getRole({
      params: {
        page: 1,
        limit: 500,
      },
    })
      .then((res) => {
        const { count, data } = res[0]
        setListAllRole(data)
      })
      .catch((err) => {
        console.log(err)
      })
    getData(currentPage, rowsPerPage, search)
  }, [currentPage, rowsPerPage, search])

  const handleLock = (id) => {
    console.log(id)
  }

  const SignupSchema = yup.object().shape({
    userName: selected?.userName ? yup.string().default(selected?.userName) : yup.string().required("Vui lòng nhập tên đăng nhập"),
    identity: selected?.identity ? yup
      .number().typeError('Vui lòng nhập đúng định dạng số')
      .default(selected?.identity) : yup.number().typeError('Vui lòng nhập đúng định dạng số').required("Vui lòng nhập số CCCD/CMND"),
    passWord: selected?.passWord ? yup.string().default(selected?.passWord) : yup.string().required("Vui lòng nhập mật khẩu"),
    passWord_: selected?.passWord ? yup.string().oneOf([yup.ref("passWord"), null], "Mật khẩu không khớp") : yup.string().required("Vui lòng nhập lại mật khẩu").oneOf([yup.ref("passWord"), null], "Mật khẩu không khớp"),
    isActive: selected?.isActive ? yup.number() : yup.number().required("Vui lòng chọn trạng thái hoạt động"),
    userGroupID: selected?.userGroupID ? yup.string() : yup.string().required("Vui lòng chọn nhóm người dùng"),
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

  const handleModal = () => {
    setIsAdd(false)
    setIsEdit(false)
    setIsPer(false)
    setUserRoles()
  }
  const CloseBtn = (
    <X className="cursor-pointer" size={15} onClick={handleModal} />
  )
  const selectedRe = useRef()
  const handleEdit = (record) => {
    selectedRe.current = record
    setInfo(record)
    setIsEdit(true)
  }

  const handleDelete = (key) => {
    deleteUser(key)
      .then((res) => {
        MySwal.fire({
          title: "Xóa người dùng thành công",
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
        })
      })
      .catch((error) => {
        MySwal.fire({
          title: "Xóa tài khoản thất bại",
          icon: "error",
          customClass: {
            confirmButton: "btn btn-danger",
          },
        })
        console.log(error)
      })
  }

  const handlePer = (record) => {
    setSelected(record)
    getDetailUserById({
      params: {
        userId: record._id,
      },
    })
      .then((res) => {
        const temp = res.userRoles?.map((item, index) => {
          return item._id
        })
        setUserRoles(temp)
      })
      .catch((err) => {
        console.log(err)
      })
    setIsPer(true)
  }
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      width: 30,
      align: "center",
      render: (text, record, index) => (
        <span>{((currentPage - 1) * rowsPerPage) + index + 1}</span>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      width: "10%",
      align: "center",
      render: (text, record, index) => (
        <span>{toDateString(record.createdAt)}</span>
      ),
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "userName",
      // align: 'center'
      // width: 250,
    },
    {
      title: "Số CMND/CCCD",
      dataIndex: "identity",
      width: "30%",
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      width: "20%",
      align: "center",
      render: (text, record, index) => {
        if (record.isActive === 1) {
          return <Tag color="success">Đang hoạt động</Tag>
        } else return <Tag color="error">Bị khóa</Tag>
      },
    },
    {
      title: "Thao tác",
      width: 100,
      align: "center",
      render: (record) => (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {ability.can('update', 'PHAN_QUYEN_NGUOI_DUNG') &&
            <>
              <EditOutlined
                id={`tooltip_edit${record._id}`}
                style={{ color: "#09A863", cursor: "pointer" }}
                onClick={(e) => handleEdit(record)}
              />
              <UncontrolledTooltip placement="top" target={`tooltip_edit${record._id}`}>
                Chỉnh sửa
              </UncontrolledTooltip>
            </>}
          {ability.can('update', 'PHAN_QUYEN_NGUOI_DUNG') &&
            <>
              <AppstoreAddOutlined
                id={`tooltip_per${record._id}`}
                style={{ color: "#09A863", cursor: "pointer" }}
                onClick={(e) => handlePer(record)}
              />
              <UncontrolledTooltip placement="top" target={`tooltip_per${record._id}`}>
                Phân quyền
              </UncontrolledTooltip>
            </>}
          {ability.can('delete', 'PHAN_QUYEN_NGUOI_DUNG') &&
            <Popconfirm
              title="Bạn chắc chắn xóa?"
              onConfirm={() => handleDelete(record._id)}
              cancelText="Hủy"
              okText="Đồng ý"
            >
              <DeleteOutlined
                style={{ color: "red", cursor: "pointer" }}
                id={`tooltip_delete${record._id}`}
              />
              <UncontrolledTooltip placement="top" target={`tooltip_delete${record._id}`}>
                Xóa
              </UncontrolledTooltip>
            </Popconfirm>}
        </div>
      ),
    },
  ]

  const showTotal = (count) => `Tổng số: ${count}`
  const _handleCheckRoleAction = (role) => {
    setUserRoles(pre => {
      const isChecked = listUserRoles.find(x => x === role._id)
      if (isChecked) {
        return listUserRoles.filter(x => x !== role._id)
      } else {
        return [
          ...pre,
          role._id,
        ]
      }
    })
  }
  const handleUpdateMany = () => {
    const listRole = Array.from(listUserRoles, x => x.roleID)
    const dataSubmit = {
      userID: selected?._id,
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
        handleModal()
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
    <Card
      title="Phân quyền người dùng"
      style={{ backgroundColor: "white", width: "100%", height: "100%" }}
    >
      <Row style={{ justifyContent: "space-between" }}>

        <Col sm="4" style={{ display: "flex", justifyContent: "flex-end" }}>
          <Label
            className=""
            style={{
              width: "100px",
              fontSize: "14px",
              height: "34px",
              display: "flex",
              alignItems: "center",
            }}
          >
            Tìm kiếm
          </Label>
          <Input
            type="text"
            placeholder="Tìm kiếm"
            style={{ height: "34px" }}
            onChange={(e) => {
              if (e.target.value === "") {
                setSearch("")
              }
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                setSearch(e.target.value)
                setCurrentPage(1)
              }
            }}
          />
        </Col>
        {ability.can('create', 'PHAN_QUYEN_NGUOI_DUNG') &&
          <Col sm="7" style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={(e) => setIsAdd(true)}
              color="primary"
              className="addBtn"
              style={{
                width: '100px',
              }}
            >
              Thêm mới
            </Button>
          </Col>}
      </Row>
      <Table
        columns={columns}
        dataSource={data}
        bordered
        pagination={{
          current: currentPage,
          pageSize: rowsPerPage,
          defaultPageSize: rowsPerPage,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "30", '100'],
          total: count,
          locale: { items_per_page: "/ trang" },
          showTotal: (total, range) => <span>Tổng số: {total}</span>,
          onShowSizeChange: (current, pageSize) => {
            setCurrentPage(current)
            setRowsPerpage(pageSize)
          },
          onChange: (pageNumber) => {
            setCurrentPage(pageNumber)
          }
        }}
      />
      {/* Permiss modal */}
      <Modal
        isOpen={isPer}
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
          <h4 className="modal-title">Phân quyền tài khoản người dùng {selected?.userName}</h4>
        </ModalHeader>
        <ModalBody className="flex-grow-1" style={{ maxHeight: "480px", overflowY: "scroll" }}>
          <Form onSubmit={handleSubmit()}>
            <h5>Danh sách vai trò người dùng</h5>
            <table
              className="table-flush-spacing"
              responsive
              style={{ width: "100%" }}
            >
              <tbody>
                {listAllRole.map((role, index) => {
                  return (
                    <tr key={index} style={{ height: '35px' }}>
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
                            style={{ cursor: "pointer", marginRight: "1rem", height: '20px' }}
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
            </table>
          </Form>
        </ModalBody>
        <div className="d-flex justify-content-center" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
          <Button className="me-1" color="primary"
            onClick={() => {
              handleUpdateMany()
            }}
          >
            Cập nhật
          </Button>
          <Button
            outline
            color="secondary"
            type="reset"
            onClick={() => handleModal()}
          >
            Hủy
          </Button>
        </div>
      </Modal>
      <AddNewModal
        open={isAdd}
        handleModal={handleModal}
        listGroup={listGroup}
        listStatus={listStatus}
        getData={getData}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
      />
      {
        <EditModal
          open={isEdit}
          handleModal={handleModal}
          listGroup={listGroup}
          listStatus={listStatus}
          getData={getData}
          infoEdit={info}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
        />
      }
    </Card>
  )
}

const AddNewModal = React.lazy(() => import("./modal/AddNewModal"))
const EditModal = React.lazy(() => import("./modal/EditModal"))
export default ListUserRoles
