import { Table, Input, Card, CardTitle, Tag, Popconfirm, Switch, Tooltip } from "antd"
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
import { AppstoreAddOutlined, DeleteOutlined, EditOutlined, LockOutlined, EyeOutlined, SettingOutlined, UserAddOutlined } from "@ant-design/icons"
import style from "../../../../assets/scss/index.module.scss"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import {
  listAllUser,
  deleteUser,
  createUser,
  updateUser,
  activeLockUser
} from "../../../../api/users"

import { listAllOrganization } from "../../../../api/organizations"
import { toDateString } from "../../../../utility/Utils"
import Select from "react-select"
import * as yup from "yup"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import classnames from "classnames"
import { getGroupUser } from "../../../../api/groupusers"
import { AbilityContext } from '@src/utility/context/Can'

const ListAccounts = () => {
  const MySwal = withReactContent(Swal)
  const [data, setData] = useState([])
  const [count, setCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerpage] = useState(10)
  const [search, setSearch] = useState("")
  const [isAdd, setIsAdd] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isPer, setIsPer] = useState(false)
  const [userGroupID_, setUserGroupID] = useState(null)
  const [isActive_, setIsActive] = useState(null)
  const [listGroup, setListGroup] = useState([])
  const [showChangePass, setShowChangePass] = useState(false)
  const [showUpdateAcc, setShowUpdateAcc] = useState(false)
  const [info, setInfo] = useState()
  const ability = useContext(AbilityContext)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const handleDetailModal = () => {
    setIsModalVisible(!isModalVisible)
  }
  const [infoAccount, setInfoAccount] = useState({})

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
    // getGroupUser({
    //   params: {
    //     page: 1,
    //     limit: 500,
    //   },
    // })
    //   .then((res) => {
    //     const { count, data} = res[0]
    //     const temp = data?.map((single, index) => {
    //       return {
    //         value: single._id,
    //         label: single.groupName,
    //       }
    //     })
    //     setListGroup(temp)
    //   })
    //   .catch((err) => {
    //     console.log(err)
    //   })
    getData(currentPage, rowsPerPage, search)
  }, [currentPage, rowsPerPage, search])


  // ** Hooks
  const handleModal = () => {
    setIsAdd(false)
    setIsEdit(false)
    setIsPer(false)
    setShowUpdateAcc(false)
    setInfo(null)
  }
  const CloseBtn = (
    <X className="cursor-pointer" size={15} onClick={handleModal} />
  )
  const handleEdit = (record) => {
    setInfo(record)
    setIsEdit(true)
  }

  const handlePer = (record) => {
    setInfo(record)
    setIsPer(true)
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
  const handleLock = (record) => {
    activeLockUser({
      userId: record?._id
    })
      .then((res) => {
        MySwal.fire({
          title: record?.isActive === 1 ? "Khóa người dùng thành công" : "Mở khóa người dùng thành công",
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
          title: record?.isActive === 1 ? "Khóa người dùng thất bại" : "Mở khóa người dùng thất bại",
          icon: "error",
          customClass: {
            confirmButton: "btn btn-danger",
          },
        })
        console.log(error)
      })
  }
  const userData = JSON.parse(localStorage.getItem("userData"))
  const handleChangePassModal = () => {
    setShowChangePass(!showChangePass)
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
      align: "center",
      render: (text, record, index) => (
        <span>{toDateString(record.createdAt)}</span>
      ),
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      // align: 'center'
      width: "200px",
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "userName",
      // align: 'center'
      width: "120px",
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "100px"
    },
    {
      title: "CMND/CCCD",
      dataIndex: "identity",
      align: "center",
      width: "80px"
    },
    // {
    //   title: "Vai trò",
    //   dataIndex: "identity",
    //   width: 200,
    //   render: (text, record, index) => {
    //     const roleArr = record.role?.map((role_, index) => {
    //       return role_.roleName
    //     }
    //     )
    //     return <span>{roleArr.join(', ')}</span>
    //   },
    // },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      align: "center",
      render: (text, record, index) => {
        if (record.isActive === 1) {
          return <Tag color="success">Đang hoạt động</Tag>
        } else return <Tag color="error">Bị khóa</Tag>
      },
    },
    {
      title: "Thao tác",
      width: "200px",
      align: "center",
      render: (record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
          {
            ability.can('update', 'TAI_KHOAN') &&
            <>
              <Tooltip placement="top" title="Chỉnh sửa">
                <EditOutlined
                  id={`tooltip_edit_${record._id}`}
                  style={{ color: "#09A863", cursor: "pointer" }}
                  onClick={(e) => handleEdit(record)}
                />
              </Tooltip>
              <Tooltip placement="top" title="Phân quyền">
                <AppstoreAddOutlined
                  id={`tooltip_per_${record._id}`}
                  style={{ color: "#09A863", cursor: "pointer" }}
                  onClick={(e) => handlePer(record)}
                />
              </Tooltip>
            </>
          }
          {
            ability.can('update', 'TAI_KHOAN') &&
            <Popconfirm
              title={`${record.isActive === 1 ? "Bạn chắc chắn khóa tài khoản này?" : "Bạn chắc chắn mở tài khoản này?"}`}
              onConfirm={() => handleLock(record)}
              cancelText="Hủy"
              okText="Đồng ý"
            >
              <Tooltip placement="top" title="Khóa/ Mở khóa">
                <LockOutlined
                  style={{ color: "#09A863", cursor: "pointer" }}
                />
              </Tooltip>
            </Popconfirm>}

          {
            userData?.userName === "admin" && <Tooltip placement="top" title="Thay đổi mật khẩu">
              <SettingOutlined
                style={{ color: "#09A863", cursor: "pointer" }}
                onClick={() => {
                  setShowChangePass(true)
                  setInfo(record)
                }}
              />
            </Tooltip>
          }
          {/* {
            userData?.userName === "admin" && <Tooltip placement="top" title="Cập nhật tài khoản cho người dùng">
              <UserAddOutlined
                style={{ color: "#09A863", cursor: "pointer" }}
                onClick={() => {
                  setShowUpdateAcc(true)
                  setInfo(record)
                }}
              />
            </Tooltip>
          } */}
          {/* <Tooltip placement="top" title="Chi tiết">
            <EyeOutlined
              id={`tooltip_edit_${record._id}`}
              style={{ color: "#09A863", cursor: "pointer" }}
              onClick={() => {
                setIsModalVisible(true)
                setInfoAccount({ userID: record?.userIdString, roles: record?.role, userName: record.userName })
              }}
            />
          </Tooltip> */}
          {ability.can('delete', 'TAI_KHOAN') && <Popconfirm
            title="Bạn chắc chắn xóa?"
            onConfirm={() => handleDelete(record._id)}
            cancelText="Hủy"
            okText="Đồng ý"
          >
            <Tooltip placement="top" title="Xóa">
              <DeleteOutlined
                style={{ color: "red", cursor: "pointer" }}
              />
            </Tooltip>
          </Popconfirm>
          }

        </div>
      ),
    },
  ]
  const showTotal = (count) => `Tổng số: ${count}`

  return (
    <Card
      title="Danh sách tài khoản"
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
        {
          ability.can('create', 'TAI_KHOAN') && <Col sm="7" style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={(e) => setIsAdd(true)}
              color="primary"
              style={{
                width: '110px',
              }}
              className="addBtn"
            >
              Thêm mới
            </Button>
          </Col>
        }
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
      <AddNewModal
        open={isAdd}
        handleModal={handleModal}
        // listGroup={listGroup}
        listStatus={listStatus}
        getData={getData}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        setCurrentPage={setCurrentPage}
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
          setCurrentPage={setCurrentPage}
        />
      }
      {
        <PermissModal
          open={isPer}
          handleModal={handleModal}
          getData={getData}
          infoEdit={info}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          setCurrentPage={setCurrentPage}
        />
      }
      {
        infoAccount && <ChangePass
          open={showChangePass}
          handleModal={handleChangePassModal}
          infoEdit={info} />
      }

    </Card>
  )
}

const AddNewModal = React.lazy(() => import("./modal/AddNewModal"))
const EditModal = React.lazy(() => import("./modal/EditModal"))
const PermissModal = React.lazy(() => import("./modal/PermissModal"))
const ChangePass = React.lazy(() => import("./modal/ChangePass"))

export default ListAccounts

