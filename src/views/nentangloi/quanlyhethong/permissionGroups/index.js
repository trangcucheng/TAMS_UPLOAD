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
import { DeleteOutlined, EditOutlined, LockOutlined } from "@ant-design/icons"
import style from "../../../../assets/scss/index.module.scss"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { toDateString } from "../../../../utility/Utils"
import Select from "react-select"
import * as yup from "yup"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import classnames from "classnames"
import { createGroupPermission, deleteGroupPermission, getGroupPermission, updateGroupPermission } from "../../../../api/permissionGroups"
import { AbilityContext } from '@src/utility/context/Can'
import ListPermission from './detail'
const groupType = [
  {
    value: 'Quyền hệ thống',
    label: 'Quyền hệ thống'
  },
  {
    value: 'Quyền nghiệp vụ',
    label: 'Quyền nghiệp vụ'
  }
]
const ListPermissionGroups = () => {
  const ability = useContext(AbilityContext)
  const selected = useRef()
  const MySwal = withReactContent(Swal)
  const [data, setData] = useState([])
  const [count, setCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerpage] = useState(10)
  const [search, setSearch] = useState("")
  const [isAdd, setIsAdd] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [info, setInfo] = useState()

  const getData = (page, limit, search) => {
    getGroupPermission({
      params: {
        page,
        limit,
        ...(search && search !== "" && { search }),
      },
    })
      .then((res) => {
        const { count, data } = res[0]
        const listData = data.map((item, index) => ({ ...item, key: index }))
        setData(listData)
        setCount(count[0]?.count)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  useEffect(() => {
    getData(currentPage, rowsPerPage, search)
  }, [currentPage, rowsPerPage, search, selected.current])

  const handleModal = () => {
    setIsAdd(false)
    setIsEdit(false)
    setInfo(null)
    // handleReset()
  }
  const CloseBtn = (
    <X className="cursor-pointer" size={15} onClick={handleModal} />
  )
  const handleEdit = (record) => {
    setInfo(record)
    setIsEdit(true)
  }

  const SignupSchema = yup.object().shape({
    permissionGroupName: selected.current?.permissionGroupName === "" ? yup.string().required("Vui lòng nhập tên nhóm quyền") : yup.string().default(selected.current?.permissionGroupName),
    permissionGroupType: selected.current?.permissionGroupType === "" ? yup.string().required("Vui lòng nhập loại nhóm quyền") : yup.string().default(selected.current?.permissionGroupType),
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
      permissionGroupName: '',
      permissionGroupType: '',
      description: "",
    })
  }
  const addNew = (data) => {
    createGroupPermission(data)
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
  const callEdit = (data) => {
    const dataSubmit = {
      permissionGroupName: data.permissionGroupName ?? selected.current?.permissionGroupName,
      permissionGroupType: data.permissionGroupType ?? selected.current?.permissionGroupType,
      description: data.description ?? selected.current?.description,
      permissionGroupId: selected.current?._id
    }
    updateGroupPermission(dataSubmit)
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

  const handleDelete = (key) => {
    deleteGroupPermission(key)
      .then((res) => {
        MySwal.fire({
          title: "Xóa nhóm quyền thành công",
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
          title: "Xóa nhóm quyền thất bại",
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
      align: 'center',
      width: 150,
      render: (text, record, index) => (
        <span>{toDateString(record.createdAt)}</span>
      ),
    },
    {
      title: "Tên nhóm quyền",
      dataIndex: "permissionGroupName",
      align: 'left'
      // width: 250,
    },
    {
      title: "Loại nhóm quyền",
      dataIndex: "permissionGroupType",
      // align: 'center'
      // width: 250,
    },
    {
      title: "Ghi chú",
      dataIndex: "description",
      width: "20%",
      align: "center",
    },
    {
      title: "Thao tác",
      width: 100,
      align: "center",
      render: (record) => (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {ability.can('update', 'NHOM_QUYEN') &&
            <>
              <EditOutlined
                style={{ color: "#09A863", cursor: 'pointer' }}
                onClick={(e) => handleEdit(record)}
              />

            </>}
          {ability.can('delete', 'NHOM_QUYEN') &&
            <Popconfirm
              title="Bạn chắc chắn xóa?"
              onConfirm={() => handleDelete(record._id)}
              cancelText="Hủy"
              okText="Đồng ý"
            >
              <DeleteOutlined style={{ color: "red", cursor: 'pointer' }} />

            </Popconfirm>}
        </div>
      ),
    },
  ]
  const showTotal = (count) => `Tổng số: ${count}`

  return (
    <Card
      title="Danh sách nhóm quyền"
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
        {ability.can('create', 'NHOM_QUYEN') &&
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
        expandable={{
          expandedRowRender: (record) => <ListPermission record={record} />,
          rowExpandable: (record) => record.name !== 'Not Expandable',
          // expandRowByClick: true
        }}
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
        getData={getData}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        setCurrentPage={setCurrentPage}
        groupType={groupType}
      />
      {
        <EditModal
          open={isEdit}
          handleModal={handleModal}
          getData={getData}
          infoEdit={info}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          setCurrentPage={setCurrentPage}
          groupType={groupType}
        />
      }
    </Card>
  )
}
const AddNewModal = React.lazy(() => import("./modalGroup/AddNewModal"))
const EditModal = React.lazy(() => import("./modalGroup/EditModal"))
export default ListPermissionGroups 
