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
import { AbilityContext } from '@src/utility/context/Can'
import style from "../../../../assets/scss/index.module.scss"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { toDateString } from "../../../../utility/Utils"
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
  listAllRoleUserCount,
} from "../../../../api/roles"
import {
  listAllUser,
  getListUserByRole
} from "../../../../api/users"
import { getGroupPermission } from "../../../../api/permissionGroups"
import {
  getPerByRoleId,
  getAllRolePer,
  updateRoleManyPer,
} from "../../../../api/rolePermissions"
import { getPermission } from "../../../../api/permissions"
import ListPermission from './detail'
import PermissModal from './modal/PermissModal'

const ListRoles = () => {
  const ability = useContext(AbilityContext)
  const selected = useRef()
  const MySwal = withReactContent(Swal)
  const [data, setData] = useState([])
  const [count, setCount] = useState(0)
  const [totalUser, setTotalUser] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerpage] = useState(100)
  const [search, setSearch] = useState("")
  const [isAdd, setIsAdd] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isPer, setIsPer] = useState(false)
  const [isView, setIsView] = useState(false)
  const [listPerGroup, setListPerGroup] = useState([])
  const [permissionView, setPermissionView] = useState([])
  const [listAllPer, setListAllPer] = useState([])
  const [listPermissionSelected, setListPermissionSelected] = useState([])
  const [roleSelected, setRoleSelected] = useState()
  const [listAllRole, setListAllRole] = useState([])

  const getData = (page, limit, search) => {
    getRole({
      params: {
        page,
        limit,
        ...(search && search !== "" && { search }),
      },
    })
      .then((res) => {
        const { count, data } = res[0]
        setCount(count[0]?.count ?? 0)
        if (res) {
          const data_ = data?.map((role, index) => {
            return {
              ...role,
              key: index,
              totalUsers: role.countUser ?? 0,
              users: [
                {
                  size: "sm",
                  title: "Nguyễn Quốc Khánh",
                  img: require("@src/assets/images/avatars/4.png").default,
                },
                {
                  size: "sm",
                  title: "Nguyễn Quốc Đại",
                  img: require("@src/assets/images/avatars/3.png").default,
                },
              ],
            }
          })
          setData(data_)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const getInfo = () => {
    getAllRolePer({
      params: {
        page: 1,
        limit: 5000,
      },
    })
      .then((res) => {
        const { count, data } = res[0]
        setListPermissionSelected(data)
      })
      .catch((err) => {
        console.log(err)
      })
    getGroupPermission({
      params: {
        page: 1,
        limit: 500,
      },
    })
      .then((res) => {
        const { count, data } = res[0]
        setListPerGroup(data ?? [])
      })
      .catch((err) => {
        console.log(err)
      })
    getPermission({
      params: {
        page: 1,
        limit: 5000,
      },
    })
      .then((res) => {
        const { count, data } = res[0]
        setListAllPer(data ?? [])
      })
      .catch((err) => {
        console.log(err)
      })
  }
  useEffect(() => {
    getInfo()
    getData(currentPage, rowsPerPage, search)
    listAllRoleUserCount()
      .then(res => {
        if (res) {
          const data_ = res?.map((role, index) => {
            return {
              id: role._id,
              name: role.name,
              totalUsers: role.userCount,
              title: role.name,
              // permission: role.tenChucnang ? JSON.parse(role.tenChucnang) : [],
              users: [
                {
                  size: 'sm',
                  title: 'Nguyễn Quốc Khánh',
                  //img: require('@src/assets/images/avatars/4.png').default
                },
                {
                  size: 'sm',
                  title: 'Nguyễn Quốc Đại',
                  //img: require('@src/assets/images/avatars/3.png').default
                }
              ]
            }
          })
          setListAllRole(data_)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }, [currentPage, rowsPerPage, search, roleSelected])

  const handleModal = () => {
    setIsAdd(false)
    setIsEdit(false)
    setIsPer(false)
    setIsView(false)
    setRoleSelected(null)
  }
  const CloseBtn = (
    <X className="cursor-pointer" size={15} onClick={handleModal} />
  )
  const handleEdit = (record) => {
    setRoleSelected(record)
    setIsEdit(true)
  }
  const handleViewUser = (role) => {
    setRoleSelected(role)
    setIsView(true)
  }
  const handleDelete = (key) => {
    deleteRole(key)
      .then((res) => {
        MySwal.fire({
          title: "Xóa vai trò thành công",
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
      .catch((error) => {
        MySwal.fire({
          title: "Xóa thất bại",
          icon: "error",
          customClass: {
            confirmButton: "btn btn-danger",
          },
        })
        console.log(error)
      })
  }

  const _handleSelectAll = (e) => {
    let listPermitFormat = []
    if (e.target.checked) {
      rolesArr.map((item) => {
        listPermitFormat = listPermitFormat.concat(item.actions)
      })
    }
    setListPermissionSelected(listPermitFormat)
  }

  const _handleCheckRoleAction = (e, act, permission, role) => {
    setListPermissionSelected((pre) => {
      const isChecked = listPermissionSelected.find(
        (per) => per.permissionID === permission._id &&
          per.roleID === role?._id &&
          per.actionContent === act.value
      )
      if (isChecked) {
        if (act.value === 'read') {
          return listPermissionSelected.filter(
            (per) => !(per.permissionID === permission._id &&
              per.roleID === role?._id)
          )
        }
        return listPermissionSelected.filter(
          (per) => !(per.permissionID === permission._id &&
            per.roleID === role?._id &&
            per.actionContent === act.value)
        )
      } else {
        if (act.value !== 'read') {
          const isChecked_ = listPermissionSelected.find(
            (per) => per.permissionID === permission._id &&
              per.roleID === role?._id &&
              per.actionContent === 'read'
          )
          if (isChecked_) {
            return [
              ...pre,
              {
                permissionID: permission._id,
                roleID: role._id,
                actionContent: act.value,
                isActive: 1,
              }
            ]
          } else {
            return [
              ...pre,
              {
                permissionID: permission._id,
                roleID: role._id,
                actionContent: 'read',
                isActive: 1,
              },
              {
                permissionID: permission._id,
                roleID: role._id,
                actionContent: act.value,
                isActive: 1,
              },
            ]
          }
        }
        return [
          ...pre,
          {
            permissionID: permission._id,
            roleID: role._id,
            actionContent: act.value,
            isActive: 1,
          },
        ]
      }
    })
  }

  const _renderRoleItem = (act, ind, permission, role) => {
    const permissionData = listPermissionSelected?.find(
      (lstPer) => lstPer.permissionID === permission._id &&
        lstPer.actionContent === act.value &&
        lstPer.roleID === role?._id
    )
    return (
      <div className="form-check me-2" key={ind} style={{ minWidth: "6rem" }}>
        <Input
          type="checkbox"
          style={{ cursor: "pointer", marginRight: "1rem" }}
          className="action-cb"
          id={`${permission._id}_${act.id}`}
          checked={permissionData || false}
          onChange={(e) => _handleCheckRoleAction(e, act, permission, role)}
        />
        <Label
          className="form-check-label"
          style={{ cursor: "pointer", fontSize: "0.875rem" }}
          for={`${permission._id}_${act.id}`}
        >
          {act.label}
        </Label>
      </div>
    )
  }
  const handlePer = (role) => {
    setRoleSelected(role)
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
      title: "Tên vai trò",
      dataIndex: "name",
      // align: 'center'
      // width: 250,
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
      title: "Mã vai trò",
      dataIndex: "description",
      align: 'center',
      width: 200,
    },
    {
      title: "Thao tác",
      width: 100,
      align: "center",
      render: (record) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          {ability.can('update', 'PHAN_QUYEN_VAI_TRO') &&
            <>
              <EditOutlined
                id={`tooltip_edit_${record._id}`}
                style={{ color: "#09A863", cursor: "pointer", marginRight: '1rem' }}
                onClick={(e) => handleEdit(record)}
              />
              <UncontrolledTooltip placement="top" target={`tooltip_edit_${record._id}`}
              >
                Chỉnh sửa
              </UncontrolledTooltip>
            </>}
          {/* { ability.can('update', 'PHAN_QUYEN_VAI_TRO') && 
                            <>
            <AppstoreAddOutlined
              id={`tooltip_per_${record._id}`}
              style={{ color: "#09A863", cursor: "pointer" }}
              onClick={(e) => handlePer(record)}
            />
            <UncontrolledTooltip placement="top" target={`tooltip_per_${record._id}`}>
              Phân quyền
            </UncontrolledTooltip></>} */}
          {ability.can('delete', 'PHAN_QUYEN_VAI_TRO') &&
            <Popconfirm
              title="Bạn chắc chắn xóa?"
              onConfirm={() => handleDelete(record._id)}
              cancelText="Hủy"
              okText="Đồng ý"
            >
              <DeleteOutlined
                style={{ color: "red", cursor: "pointer" }}
                id={`tooltip_delete_${record._id}`}
              />
              <UncontrolledTooltip placement="top" target={`tooltip_delete_${record._id}`}>
                Xóa
              </UncontrolledTooltip>
            </Popconfirm>}
        </div>
      ),
    },
  ]

  const handleUpDateManyPer = () => {
    const listSelected = listPermissionSelected.filter(x => x.roleID === roleSelected._id)
    const arr = listSelected.map((per, index) => {
      if (per.roleID === roleSelected._id) {
        return {
          permissionID: per.permissionID,
          actionContent: per.actionContent,
        }
      }
    })
    const dataSubmit = {
      roleID: roleSelected?._id,
      isActive: 1,
      arrContent: arr,
      actionTime: "2023-09-13T04:08:14.369Z",
    }
    updateRoleManyPer(dataSubmit)
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
          title: "Chỉnh sửa thất bại",
          icon: "error",
          customClass: {
            confirmButton: "btn btn-danger",
          },
        })
      })
  }
  const showTotal = (count) => `Tổng số: ${count}`

  return (
    <Fragment>
      <Card
        title="Phân quyền vai trò người dùng"
        style={{ backgroundColor: "white", width: "100%", height: "100%", marginBottom: '1rem' }}
      >
        <Row>
          <Col md="12">
            <Row>
              {listAllRole?.map((role, index) => {
                if (role._id !== "6500e98851b67437e9184da1") {
                  return (
                    <Col key={index} xl={3} md={3} sm={6}>
                      <Card
                        style={{
                          marginBottom: "1rem",
                          backgroundColor: "white",
                          padding: '0px'
                        }}
                        className="role-card"
                      >
                        <CardBody style={{ padding: "1rem" }}>
                          <div className="d-flex justify-content-between">
                            <span>{`Tổng cộng: ${role.totalUsers} nhân sự`}</span>
                          </div>
                          <div className="d-flex justify-content-between align-items-end pt-25">
                            <div className="role-heading">
                              <h4 className="fw-bolder">{role.name}</h4>
                              <Link
                                to="/"
                                className="role-edit-modal"
                                onClick={(e) => {
                                  e.preventDefault()
                                  handleViewUser(role)
                                }}
                              >
                                <p className="fw-bolder">Chi tiết</p>
                              </Link>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  )
                }
              })}
            </Row>
          </Col>
        </Row>
      </Card>
      <Card
        title="Danh sách vai trò người dùng"
        style={{ backgroundColor: "white", width: "100%", height: "100%" }}
      >
        <Row>
          <Col md="12">
            <Row style={{ justifyContent: "space-between" }}>
              <Col
                sm="4"
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
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
              {ability.can('create', 'PHAN_QUYEN_VAI_TRO') &&
                <Col
                  sm="7"
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
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
              expandable={{
                expandedRowRender: (record) => <PermissModal
                  roleSelected={record} />,
                rowExpandable: (record) => record.name !== 'Not Expandable',
              }}
              pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "30"],
                total: { count },
                locale: { items_per_page: "/ trang" },
                showSizeChanger: true,
                showTotal: (total, range) => <span>Tổng số: {total}</span>,
              }}
            />
            <AddNewModal
              open={isAdd}
              handleModal={handleModal}
              getData={getData}
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
            />
            {
              <EditModal
                open={isEdit}
                handleModal={handleModal}
                getData={getData}
                infoEdit={roleSelected}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
              />
            }
            {
              <ListUsersModal
                open={isView}
                setIsView={setIsView}
                roleSelected={roleSelected}
              />
            }
          </Col>
        </Row>
      </Card>
    </Fragment>
  )
}
const AddNewModal = React.lazy(() => import("./modal/AddNewModal"))
const EditModal = React.lazy(() => import("./modal/EditModal"))
const ListUsersModal = React.lazy(() => import("./modal/ListUsersModal"))
export default ListRoles
