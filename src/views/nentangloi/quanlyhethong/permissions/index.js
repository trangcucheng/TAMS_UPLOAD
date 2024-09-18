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
import { getGroupPermission } from "../../../../api/permissionGroups"
import {
  getPermission,
  createPermission,
  deletePermission,
  updatePermission,
  getPermissionByGroup,
} from "../../../../api/permissions"
import { AbilityContext } from "@src/utility/context/Can"

const ListPermissions = () => {
  const ability = useContext(AbilityContext)
  const selectedRe = useRef()
  const MySwal = withReactContent(Swal)
  const [data, setData] = useState([])
  const [count, setCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerpage] = useState(10)
  const [search, setSearch] = useState("")
  const [isAdd, setIsAdd] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [listGroup, setListGroup] = useState([])
  const [info, setInfo] = useState()

  const getData = (page, limit, search) => {
    getPermission({
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
    getGroupPermission({
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
            label: single.permissionGroupName
          }
        })
        setListGroup(temp)
      })
      .catch((err) => {
        console.log(err)
      })
    getData(currentPage, rowsPerPage, search)
  }, [currentPage, rowsPerPage, search])

  const handleModal = () => {
    setIsAdd(false)
    setIsEdit(false)
    setInfo(null)
  }
  const CloseBtn = (
    <X className="cursor-pointer" size={15} onClick={handleModal} />
  )
  const handleEdit = (record) => {
    setInfo(record)
    setIsEdit(true)
  }

  const handleDelete = (key) => {
    deletePermission(key)
      .then((res) => {
        MySwal.fire({
          title: "Xóa quyền thành công",
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
          title: "Xóa quyền thất bại",
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
      width: "10%",
      align: "center",
      render: (text, record, index) => (
        <span>{toDateString(record.createdAt)}</span>
      ),
    },
    {
      title: "Mã quyền",
      dataIndex: "permissionCode",
      align: "left",
      // width: 250,
    },
    {
      title: "Phân hệ",
      dataIndex: "identity",
      width: "30%",
      render: (text, record, index) => (
        <span>{record?.permissionGroupName}</span>
      ),
    },
    {
      title: "Tên quyền",
      dataIndex: "description",
      align: "left",
      // width: 250,
    },
    {
      title: "Thao tác",
      width: 100,
      align: "center",
      render: (record) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          {ability.can("update", "CHUC_NANG") && (
            <>
              <EditOutlined
                // id={`tooltip_edit${record._id}`}
                id={`tooltip_edit`}
                style={{ color: "#09A863", cursor: "pointer", marginRight: '1rem' }}
                onClick={(e) => handleEdit(record)}
              />
              <UncontrolledTooltip
                placement="top"
                target={`tooltip_edit`}
              >
                Chỉnh sửa
              </UncontrolledTooltip>
            </>
          )}
          {ability.can("delete", "CHUC_NANG") && (
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
              <UncontrolledTooltip
                placement="top"
                target={`tooltip_delete${record._id}`}
              >
                Xóa
              </UncontrolledTooltip>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ]
  const showTotal = (count) => `Tổng số: ${count}`

  return (
    <Card
      title="Danh sách quyền chức năng"
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
        {ability.can("create", "CHUC_NANG") && (
          <Col sm="7" style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={(e) => setIsAdd(true)}
              color="primary"
              className="addBtn"
              style={{
                width: "100px",
              }}
            >
              Thêm mới
            </Button>
          </Col>
        )}
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
          pageSizeOptions: ["10", "20", "30", "100"],
          total: count,
          locale: { items_per_page: "/ trang" },
          showTotal: (total, range) => <span>Tổng số: {total}</span>,
          onShowSizeChange: (current, pageSize) => {
            setCurrentPage(current)
            setRowsPerpage(pageSize)
          },
          onChange: (pageNumber) => {
            setCurrentPage(pageNumber)
          },
        }}
      />

      <AddNewModal
        open={isAdd}
        handleModal={handleModal}
        getData={getData}
        rowsPerPage={rowsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        listGroup={listGroup}
      />
      {
        <EditModal
          open={isEdit}
          handleModal={handleModal}
          getData={getData}
          infoEdit={info}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          rowsPerPage={rowsPerPage}
          listGroup={listGroup}
        />
      }
    </Card>
  )
}

const AddNewModal = React.lazy(() => import("./modal/AddNewModal"))
const EditModal = React.lazy(() => import("./modal/EditModal"))
export default ListPermissions
