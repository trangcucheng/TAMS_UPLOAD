import { Table, Input, Card, CardTitle, Tag, Popconfirm, Switch, Collapse } from "antd"
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
  CardBody
} from "reactstrap"
import { Plus, X } from "react-feather"
import { AppstoreAddOutlined, DeleteOutlined, EditOutlined, LockOutlined } from "@ant-design/icons"
import style from "../../../../../assets/scss/index.module.scss"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { toDateString } from "../../../../../utility/Utils"
import Select from "react-select"
import * as yup from "yup"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import classnames from "classnames"
import { getRole, createRole, updateRole, deleteRole } from "../../../../../api/roles"
import { getPerByRoleId, getAllRolePer, updateRoleManyPer } from "../../../../../api/rolePermissions"
import { getPermission } from "../../../../../api/permissions"
import { getGroupPermission } from "../../../../../api/permissionGroups"
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
    id: '0',
    label: 'Xem',
    value: 'read'
  },
  {
    id: '1',
    label: 'Thêm',
    value: 'create'
  },
  {
    id: '2',
    label: 'Sửa',
    value: 'update'
  },
  {
    id: '3',
    label: 'Xóa',
    value: 'delete'
  },
  {
    id: '4',
    label: 'Phê duyệt',
    value: 'print'
  }
]
const RolesTable = () => {
  const selected = useRef()
  const MySwal = withReactContent(Swal)
  const [data, setData] = useState([])
  const [count, setCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerpage] = useState(10)
  const [search, setSearch] = useState("")
  const [isAdd, setIsAdd] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isActive_, setIsActive] = useState(null)
  const [isPer, setIsPer] = useState(false)
  const [listPerGroup, setListPerGroup] = useState([])
  const [permissionView, setPermissionView] = useState([])
  const [listAllPer, setListAllPer] = useState([])
  const [listPermissionSelected, setListPermissionSelected] = useState([])

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
        setData(data)
        setCount(count[0]?.count ?? 0)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const getInfo = () => {
    getAllRolePer({
      params: {
        page: 1,
        limit: 5000
      }
    }).then(res => {
      const { count, data } = res[0]
      setListPermissionSelected(data)
    }).catch(err => {
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
  }, [currentPage, rowsPerPage, search, selected.current])

  const SignupSchema = yup.object().shape({
    name: selected.current?.name !== '' ? yup.string().default(selected.current?.name) : yup.string().required("Vui lòng nhập tên vai trò"),
    isActive: isActive_ ? yup.number() : yup.number().required('Vui lòng chọn trạng thái'),
    desciption: yup.string()
  })

  // ** Hooks
  const {
    reset,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(SignupSchema) })

  const handleModal = () => {
    setIsAdd(false)
    setIsEdit(false)
    setIsPer(false)
  }
  const CloseBtn = (
    <X className="cursor-pointer" size={15} onClick={handleModal} />
  )
  const handleEdit = (record) => {
    selected.current = record
    setIsActive(record.isActive)
    setIsEdit(true)
  }
  const addNew = (data) => {
    const dataSubmit = {
      ...data,
      isActive: isActive_,
    }
    createRole(dataSubmit)
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
  const editRole = (data) => {
    const dataSubmit = {
      ...data,
      roleId: selected.current?._id,
      isActive: isActive_,
      roleId: selected.current?._id,
      description: data.desciption ?? selected.current?.description
    }
    updateRole(dataSubmit)
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

  const handleDelete = (key) => {
    deleteRole(key)
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
      rolesArr.map(item => {
        listPermitFormat = listPermitFormat.concat(item.actions)
      })
    }
    setListPermissionSelected(listPermitFormat)
  }

  const _handleCheckRoleAction = (e, act, permission, role) => {
    setListPermissionSelected(pre => {
      const isChecked = listPermissionSelected.find(per => per.permissionID === permission._id && per.roleID === role?._id && per.actionContent === act.value)
      if (isChecked) {
        return listPermissionSelected.filter(per => per.permissionID === permission._id && per.roleID === role._id && per.actionContent !== act.value)
      } else {
        return [
          ...pre,
          {
            permissionID: permission._id,
            roleID: role._id,
            actionContent: act.value,
            isActive: 1
          }
        ]
      }
    })
  }

  const _renderRoleItem = (act, ind, permission, role) => {
    const permissionData = listPermissionSelected?.find(lstPer => lstPer.permissionID === permission._id && lstPer.actionContent === act.value && lstPer.roleID === role?._id)
    return (
      <div className='form-check me-2' key={ind} style={{ minWidth: "6rem" }}>
        <Input type='checkbox' style={{ cursor: "pointer", marginRight: '1rem' }} className="action-cb" id={`${act.id}`}
          checked={permissionData || false}
          onChange={(e) => _handleCheckRoleAction(e, act, permission, role)}
        />
        <Label className='form-check-label' style={{ cursor: "pointer", fontSize: "0.875rem" }} for={`${act.id}`} >
          {act.label}
        </Label>
      </div>
    )
  }
  const handlePer = (record) => {
    selected.current = record
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
      title: "Ghi chú",
      dataIndex: "description",
      // align: 'center'
      width: 150,
    },
    {
      title: "Thao tác",
      width: 100,
      align: "center",
      render: (record) => (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <EditOutlined
            id="tooltip_edit"
            style={{ color: "#09A863", cursor: 'pointer' }}
            onClick={(e) => handleEdit(record)}
          />
          <UncontrolledTooltip placement="top" target="tooltip_edit">
            Chỉnh sửa
          </UncontrolledTooltip>
          <AppstoreAddOutlined
            id="tooltip_per"
            style={{ color: "#09A863", cursor: 'pointer' }}
            onClick={(e) => handlePer(record)}
          />
          <UncontrolledTooltip placement="top" target="tooltip_per">
            Phân quyền
          </UncontrolledTooltip>
          <Popconfirm
            title="Bạn chắc chắn xóa?"
            onConfirm={() => handleDelete(record.key)}
            cancelText="Hủy"
            okText="Đồng ý"
          >
            <DeleteOutlined style={{ color: "red", cursor: 'pointer' }} id="tooltip_delete" />
            <UncontrolledTooltip placement="top" target="tooltip_delete">
              Xóa
            </UncontrolledTooltip>
          </Popconfirm>
        </div>
      ),
    },
  ]

  const handleUpDateManyPer = () => {
    const arr = listPermissionSelected.map((per, index) => {
      return {
        permissionID: per.permissionID,
        actionContent: per.actionContent
      }
    })
    console.log("arr", arr)
    const dataSubmit = {
      roleID: selected.current?._id,
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
    <Card
      title="Danh sách vai trò người dùng"
      style={{ backgroundColor: "white", width: "100%", height: "100%" }}
    >
      <Row>
        <Col md="12">
          <Row>
            {
              data?.map((role, index) => {
                if (role._id !== '6500e98851b67437e9184da1') {
                  return (
                    <Col key={index} xl={3} md={3} sm={6}>
                      <Card style={{ marginBottom: "1rem", backgroundColor: 'white' }}>
                        <CardBody style={{ padding: "1rem" }}>
                          <div className='d-flex justify-content-between'>
                            <span>{`Tổng cộng: ${role.totalUsers} nhân sự`}</span>
                            <AvatarGroup data={role.users} />
                          </div>
                          <div className='d-flex justify-content-between align-items-end pt-25'>
                            <div className='role-heading'>
                              <h4 className='fw-bolder'>{role.title}</h4>
                              <Link
                                to='/'
                                className='role-edit-modal'
                                onClick={e => {
                                  e.preventDefault()
                                  setRoleSelected(role)
                                  setListPermissionSelected(role.permission)
                                  setModalType('Edit')
                                  setShow(true)
                                }}>
                                <small className='fw-bolder'>Chỉnh sửa</small>
                              </Link>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>

                  )
                }
              })
            }
          </Row>
        </Col>
        <Col md="12">
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
            <Col sm="7" style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                onClick={(e) => setIsAdd(true)}
                color="primary"
                style={{
                  marginBottom: 16,
                }}
              >
                Thêm mới
              </Button>
            </Col>
          </Row>
          <Table
            columns={columns}
            dataSource={data}
            bordered
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

          {/* add modal */}
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
                <h2 className='mb-1'>Thêm mới quyền</h2>
              </div>
              <Form onSubmit={handleSubmit(addNew)}>
                <Row className="content-space-between">
                  <div className="mb-1 col col-12">
                    <Label className="form-label" for="name">
                      Tên vai trò<span className="redColor">(*)</span>
                    </Label>
                    <Controller
                      id="name"
                      name="name"
                      defaultValue=""
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder=""
                          invalid={errors.name && true}
                          className={classnames({ "is-invalid": errors.name })}
                        />
                      )}
                    />
                    {errors.name && (
                      <FormFeedback>Vui lòng nhập tên vai trò</FormFeedback>
                    )}
                  </div>
                </Row>
                <Row className="content-space-between">
                  <div className="mb-1 col col-12">
                    <Label className="form-label" for="react-select">
                      Chọn trạng thái<span className="redColor">(*)</span>
                    </Label>
                    <Controller
                      id="react-select"
                      control={control}
                      name="isActive"
                      render={({ field }) => (
                        <Select
                          isClearable
                          options={listStatus}
                          classNamePrefix="select"
                          className={classnames('react-select', { 'is-invalid': isActive_ === null && errors.isActive })}
                          {...field}
                          placeholder="Chọn trạng thái"
                          onChange={(e) => {
                            setIsActive(e?.value)
                          }}
                        />
                      )}
                    />
                    {errors.isActive && (
                      <FormFeedback>Vui lòng chọn trạng thái</FormFeedback>
                    )}
                  </div>
                </Row>
                <Row className="content-space-between">
                  <div className="mb-1 col col-12">
                    <Label className="form-label" for="description">
                      Ghi chú
                    </Label>
                    <Controller
                      id="description"
                      name="description"
                      defaultValue=""
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder=""
                          invalid={errors.description && true}
                          className={classnames({ "is-invalid": errors.description })}
                        />
                      )}
                    />
                    {errors.description && (
                      <FormFeedback>Vui lòng nhập ghi chú</FormFeedback>
                    )}
                  </div>
                </Row>
                <div className="d-flex justify-content-center">
                  <Button className="me-1" color="primary" type="submit">
                    Thêm mới
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
              </Form>
            </ModalBody>
          </Modal>

          {/* Edit modal */}
          <Modal
            isOpen={isEdit}
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
              <h4 className="modal-title">Chỉnh sửa vai trò</h4>
            </ModalHeader>
            <ModalBody className="flex-grow-1">
              <Form onSubmit={handleSubmit(editRole)}>
                <Row className="content-space-between">
                  <div className="mb-1 col col-12">
                    <Label className="form-label" for="name">
                      Tên vai trò<span className="redColor">(*)</span>
                    </Label>
                    <Controller
                      id="name"
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder=""
                          invalid={errors.name && true}
                          className={classnames({ "is-invalid": errors.name })}
                          defaultValue={selected.current?.name}
                        />
                      )}
                    />
                    {errors.name && (
                      <FormFeedback>Vui lòng nhập tên vai trò</FormFeedback>
                    )}
                  </div>
                </Row>
                <Row className="content-space-between">
                  <div className="mb-1 col col-12">
                    <Label className="form-label" for="react-select">
                      Trạng thái hoạt động<span className="redColor">(*)</span>
                    </Label>
                    <Controller
                      id="react-select"
                      control={control}
                      name="isActive"
                      render={({ field }) => (
                        <Select
                          isClearable
                          options={listStatus}
                          classNamePrefix="select"
                          className={classnames("react-select")}
                          {...field}
                          placeholder="Chọn trạng thái"
                          defaultValue={listStatus.find(
                            (x) => x.value === selected.current?.isActive
                          )}
                          onChange={(e) => {
                            setIsActive(e.value)
                          }}
                        />
                      )}
                    />
                    {errors.isActive && (
                      <FormFeedback>Vui lòng chọn trạng thái hoạt động</FormFeedback>
                    )}
                  </div>
                </Row>
                <Row className="content-space-between">
                  <div className="mb-1 col col-12">
                    <Label className="form-label" for="description">
                      Ghi chú
                    </Label>
                    <Controller
                      id="description"
                      name="description"
                      defaultValue=""
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder=""
                          invalid={errors.description && true}
                          className={classnames({ "is-invalid": errors.description })}
                          defaultValue={selected.current?.description}
                        />
                      )}
                    />
                    {errors.description && (
                      <FormFeedback>Vui lòng nhập ghi chú</FormFeedback>
                    )}
                  </div>
                </Row>
                <div className="d-flex justify-content-center">
                  <Button className="me-1" color="primary" type="submit">
                    Lưu
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
              </Form>
            </ModalBody>
          </Modal>

          {/* permission modal */}
          <Modal
            isOpen={isPer}
            toggle={handleModal}
            contentClassName="pt-0"
            autoFocus={false}
            className="modal-lg"
          >
            <ModalHeader
              className=""
              toggle={handleModal}
              close={CloseBtn}
              tag="div"
            >
              <h4 className="modal-title">Phân quyền cho vai trò: {selected.current?.name}</h4>
            </ModalHeader>
            <Form onSubmit={handleSubmit(addNew)}>
              <ModalBody className="flex-grow-1">
                <Collapse items={listPerGroup.map((single, index) => {
                  return {
                    key: `${index}`,
                    label: single.permissionGroupName,
                    children: (
                      <table className='table-flush-spacing' responsive style={{ width: '100%' }}>
                        <tbody>
                          {listAllPer.map((permission, index) => {
                            if (permission.permissionGroupID?._id === single._id) {
                              return (
                                <tr key={index} style={{ height: '36px' }}>
                                  <td className='text-nowrap fw-bolder' style={{ width: "30%" }}>{permission.description}</td>
                                  <td>
                                    <div className='d-flex' style={{ flexWrap: "nowrap" }}>
                                      {
                                        listActions.map((act, ind) => {
                                          return _renderRoleItem(act, ind, permission, selected.current)
                                        })
                                      }
                                    </div>
                                  </td>
                                </tr>
                              )
                            }
                          })}
                        </tbody>
                      </table>
                    ),
                  }
                })} defaultActiveKey={['0']} />
              </ModalBody>
              <div className="d-flex justify-content-center mb-1">
                <Button className="me-1" color="primary"
                  onClick={() => {
                    handleUpDateManyPer()
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
            </Form>
          </Modal>
        </Col>
      </Row>

    </Card>
  )
}
export default RolesTable
