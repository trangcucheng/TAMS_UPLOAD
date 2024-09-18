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
import { AbilityContext } from '@src/utility/context/Can'
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
import { createGroupUser, deleteGroupUser, getGroupUser, updateGroupUser } from "../../../../api/groupusers"

const ListGroups = () => {
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
    getGroupUser({
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
    groupName: yup.string().required("Vui lòng nhập tên nhóm người dùng"),
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

  const handleDelete = (key) => {
    deleteGroupUser(key)
      .then((res) => {
        MySwal.fire({
          title: "Xóa nhóm người dùng thành công",
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
          title: "Xóa nhóm người dùng thất bại",
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
      title: "Tên nhóm người dùng",
      dataIndex: "groupName",
      // align: 'center'
      // width: 250,
    },
    {
      title: "Ghi chú",
      dataIndex: "description",
      width: "25%",
      align: "center",
    },
    {
      title: "Thao tác",
      width: 100,
      align: "center",
      render: (text, record, index) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          {ability.can('update', 'NHOM_NGUOI_DUNG') &&
            <>
              <EditOutlined
                id={`tooltip_edit_${record._id}`}
                style={{ color: "#09A863", cursor: 'pointer', marginRight: '1rem' }}
                onClick={(e) => handleEdit(record)}
              />
              <UncontrolledTooltip placement="top" target={`tooltip_edit_${record._id}`}>
                Chỉnh sửa
              </UncontrolledTooltip>
            </>}

          {ability.can('delete', 'NHOM_NGUOI_DUNG') &&
            <Popconfirm
              title="Bạn chắc chắn xóa?"
              onConfirm={() => handleDelete(record._id)}
              cancelText="Hủy"
              okText="Đồng ý"
            >
              <DeleteOutlined style={{ color: "red", cursor: 'pointer' }}
                id={`tooltip_delete_${record._id}`} />
              <UncontrolledTooltip placement="top" target={`tooltip_delete_${record._id}`}>
                Xóa
              </UncontrolledTooltip>
            </Popconfirm>}
        </div>
      ),
    },
  ]
  const showTotal = (count) => `Tổng số: ${count}`

  return (
    <Card
      title="Danh sách nhóm người dùng"
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
        {ability.can('create', 'NHOM_NGUOI_DUNG') &&
          <Col sm="7" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              onClick={(e) => setIsAdd(true)}
              color="primary"
              className="addBtn"
              style={{
                // marginBottom: 16,
                width: '100px'
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
export default ListGroups 
