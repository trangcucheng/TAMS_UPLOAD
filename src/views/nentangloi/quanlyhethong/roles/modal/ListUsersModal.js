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
import { AppstoreAddOutlined, DeleteOutlined, EditOutlined, LockOutlined } from "@ant-design/icons"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import {
  listAllUser,
  deleteUser,
  createUser,
  updateUser,
  activeLockUser,
  getListUserByRole
} from "../../../../../api/users"
import { toDateString } from "../../../../../utility/Utils"
import Select from "react-select"
import * as yup from "yup"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import classnames from "classnames"
import { AbilityContext } from '@src/utility/context/Can'
const ListAccounts = ({ roleSelected, open, setIsView }) => {
  if (!roleSelected) return
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
  const [info, setInfo] = useState()
  const ability = useContext(AbilityContext)
  const listStatus = [
    {
      label: 'Đang hoạt động',
      value: 1
    },
    {
      label: 'Bị khóa',
      value: 0
    }
  ]
  const getData = (page, limit, search) => {
    getListUserByRole({
      params: {
        page,
        limit,
        roleID: roleSelected?.id,
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
    getData(currentPage, rowsPerPage, search)
  }, [currentPage, rowsPerPage, search, roleSelected])

  const handleLock = (record) => {
    const dataSubmit = {
      userId: record._id
    }
    activeLockUser(dataSubmit).then((res) => {
      MySwal.fire({
        title: record.isActive === 1 ? "Khóa người dùng thành công" : "Mở khóa người dùng thành công",
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
          title: record.isActive === 1 ? "Khóa người dùng thất bại" : "Mở khóa người dùng thất bại",
          icon: "error",
          customClass: {
            confirmButton: "btn btn-danger",
          },
        })
        console.log(error)
      })
  }
  const handleModal = () => {
    setIsAdd(false)
    setIsEdit(false)
    setIsPer(false)
    setInfo(null)
    setIsView(false)
    setCurrentPage(1)
  }
  const handleAddModal = () => {
    setIsAdd(false)
    setInfo(null)
    setCurrentPage(1)
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
      width: 240,
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "userName",
      // align: 'center'
      width: 200,
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 150,
    },
    {
      title: "CMND/CCCD",
      dataIndex: "identity",
      align: "center",
    },
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
      width: "110px",
      align: "center",
      render: (record) => (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {
            ability.can('update', 'TAI_KHOAN') &&
            <>
              <EditOutlined
                id={`tooltip_edit_${record._id}`}
                style={{ color: "#09A863", cursor: "pointer" }}
                onClick={(e) => handleEdit(record)}
              />

              <AppstoreAddOutlined
                id={`tooltip_per_${record._id}`}
                style={{ color: "#09A863", cursor: "pointer" }}
                onClick={(e) => handlePer(record)}
              />
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
              <LockOutlined
                style={{ color: "#09A863", cursor: "pointer" }}
              />
            </Popconfirm>}
          {ability.can('delete', 'TAI_KHOAN') && <Popconfirm
            title="Bạn chắc chắn xóa?"
            onConfirm={() => handleDelete(record._id)}
            cancelText="Hủy"
            okText="Đồng ý"
          >
            <DeleteOutlined
              style={{ color: "red", cursor: "pointer" }}
            />
          </Popconfirm>
          }

        </div>
      ),
    },
  ]

  return (
    <Modal
      isOpen={open}
      toggle={handleModal}
      // contentClassName="pt-0"
      autoFocus={false}
      className="modal-dialog-top modal-xl"
    >
      <ModalHeader
        className='bg-transparent'
        toggle={handleModal}
      >
      </ModalHeader>
      <ModalBody className='px-sm-3 mx-50 pb-2' style={{ paddingTop: 0 }}>
        <div className='text-center mb-1'>
          <h3 className='mb-1'>Danh sách tài khoản nhóm: {roleSelected?.name}</h3>
        </div>
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
                  width: '100px',
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
            showTotal: (total, range) => <span>Tổng số: {count}</span>,
            onShowSizeChange: (current, pageSize) => {
              setCurrentPage(current)
              setRowsPerpage(pageSize)
            },
            onChange: (pageNumber) => {
              setCurrentPage(pageNumber)
            }
          }}
        />
      </ModalBody>
      <AddNewModal
        open={isAdd}
        handleModal={handleAddModal}
        // listGroup={listGroup}
        roleSelected={roleSelected}
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
      {
        <PermissModal
          open={isPer}
          handleModal={handleModal}
          getData={getData}
          infoEdit={info}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
        />
      }
    </Modal>
  )
}
const AddNewModal = React.lazy(() => import("../accountModals/AddNewModal"))
const EditModal = React.lazy(() => import("../accountModals/EditModal"))
const PermissModal = React.lazy(() => import("../accountModals/PermissModal"))

export default ListAccounts
