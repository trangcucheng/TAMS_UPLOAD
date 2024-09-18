import { Table, Input, Card, CardTitle, Tag, Popconfirm, Space, Switch, TreeSelect, Spin, Tooltip } from "antd"
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
import { DeleteOutlined, EditOutlined, LockOutlined, SearchOutlined } from "@ant-design/icons"
import style from "../../../../assets/scss/index.module.scss"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { toDateString, addAttributeToTree } from "../../../../utility/Utils"
import Select from "react-select"
import * as yup from "yup"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import classnames from "classnames"
import { getOrganizationType } from "../../../../api/organizationTypes"
import { deleteOrganization, listAllOrganization, listAllOrganizationPC } from "../../../../api/organizations"
const { SHOW_PARENT } = TreeSelect
import AddNewModal from './modal/AddNewModal'
import EditModal from './modal/EditModal'

const ListOrganizations = () => {
  const [loading, setLoading] = useState(true)
  const ability = useContext(AbilityContext)
  const MySwal = withReactContent(Swal)
  const [data, setData] = useState([])
  const [count, setCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerpage] = useState(100)
  const [search, setSearch] = useState("")
  const [isAdd, setIsAdd] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [listTypes, setListTypes] = useState([])
  const [info, setInfo] = useState()
  const [listOrgans, setListOrgans] = useState([])
  const [value, setValue] = useState('')
  const [treeData, setTreeData] = useState()
  const getData = (page, limit, search) => {
    listAllOrganizationPC({
      params: {
        page,
        limit,
        ...(search && search !== "" && { search }),
      },
    })
      .then((res) => {
        // setData(res.newlist)
        setData(res.fthOrg)
        setCount(res.count)
        const temp = res.fthOrg
        addAttributeToTree(temp[0], 'label', 'organizationName')
        setTreeData(temp)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }
  useEffect(() => {
    getData(currentPage, rowsPerPage, search)
  }, [currentPage, rowsPerPage, search])

  useEffect(() => {
    getOrganizationType({
      params: {
        page: 1,
        limit: 500,
      },
    })
      .then((res) => {
        const temp = res.list?.map((single, index) => {
          return {
            value: single.ID,
            label: single.OrganizationTypeName
          }
        })
        setListTypes(temp)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

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

  const handleDelete = (record) => {
    deleteOrganization({
      params: {
        organizationID: record?.id,
        organizationRelationID: record?.OrganRelationID
      }
    })
      .then((res) => {
        MySwal.fire({
          title: "Xóa đơn vị thành công",
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
          title: "Xóa đơn vị thất bại",
          icon: "error",
          customClass: {
            confirmButton: "btn btn-danger",
          },
        })
        console.log(error)
      })
  }

  // search
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef(null)
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }
  const handleReset = (clearFilters) => {
    clearFilters()
    setSearchText('')
  }
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              })
              setSearchText(selectedKeys[0])
              setSearchedColumn(dataIndex)
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close()
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text) => (searchedColumn === dataIndex ? (
      <Highlighter
        highlightStyle={{
          backgroundColor: '#ffc069',
          padding: 0,
        }}
        searchWords={[searchText]}
        autoEscape
        textToHighlight={text ? text.toString() : ''}
      />
    ) : (
      text
    )),
  })

  // ====
  const columns = [
    // {
    //   title: "STT",
    //   dataIndex: "stt",
    //   width: 30,
    //   align: "center",
    //   render: (text, record, index) => (
    //     <span>{((currentPage - 1) * rowsPerPage) + index + 1}</span>
    //   ),
    // },
    {
      title: "Mã đơn vị",
      dataIndex: "organizationCode",
      width: "180px",
      key: 'organizationCode',
    },
    {
      title: "Tên đơn vị",
      dataIndex: "organizationName",
      key: "organizationName",
      // width: 250,
    },
    {
      title: "Loại đơn vị",
      dataIndex: "organizationTypeName",
      key: "organizationTypeName",
    },
    // {
    //   title: "Cấp đơn vị",
    //   dataIndex: "organizationLevelName",
    //   key: "organizationLevelName",
    // },
    {
      title: "Địa điểm",
      dataIndex: "organizationAddress",
      key: "organizationAddress",
    },
    {
      title: "Đơn vị cấp trên",
      dataIndex: "parentName",
      key: "parentName",
    },
    {
      title: "Ghi chú",
      dataIndex: "organizationDescription",
      key: "organizationDescription",
    },
    {
      title: "Thao tác",
      width: 100,
      align: "center",
      render: (record) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          {ability.can('update', 'DON_VI') &&
            <>
              <Tooltip placement="top" title="Chỉnh sửa">
                <EditOutlined
                  style={{ color: "#09A863", cursor: 'pointer' }}
                  className="me-1"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEdit(record)
                  }}
                />
              </Tooltip>
            </>}
          {ability.can('delete', 'DON_VI') &&
            <Popconfirm
              title="Bạn chắc chắn xóa?"
              onConfirm={() => handleDelete(record)}
              cancelText="Hủy"
              okText="Đồng ý"
            >
              <Tooltip placement="top" title="Xóa">
                <DeleteOutlined style={{ color: "red", cursor: 'pointer' }} id={`tooltip_delete${record.ID}`} />
                <UncontrolledTooltip placement="top" target={`tooltip_delete${record.ID}`}>
                  Xóa
                </UncontrolledTooltip>
              </Tooltip>
            </Popconfirm>}
        </div>
      ),
    },
  ]

  return (
    <Card
      title="Danh sách đơn vị"
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
        {ability.can('create', 'DON_VI') &&
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
      {
        loading && <div className="flex" style={{ width: "100%", position: 'relative', left: '50%' }}>
          <Spin />
        </div>
      }
      {
        data?.length > 0 ? <Table
          key='organizationList'
          columns={columns}
          dataSource={data}
          bordered
          expandable={{
            defaultExpandAllRows: true,
            columnWidth: 180
          }}
          columnWidth={150}
          expandedRowClassName={(record) => "test"}
          pagination={{
            current: 1,
            pageSize: 10,
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "30", '100'],
            total: count,
            locale: { items_per_page: "/ trang" },
            showTotal: (total, range) => <span>Tổng số: {total}</span>,
            // onShowSizeChange: (current, pageSize) => {
            //   setCurrentPage(current)
            //   setRowsPerpage(pageSize)
            // },
            // onChange: (pageNumber) => {
            //   setCurrentPage(pageNumber)
            // }
          }}
        /> : <></>
      }

      <AddNewModal
        open={isAdd}
        handleModal={handleModal}
        getData={getData}
        listTypes={listTypes}
        setCurrentPage={setCurrentPage}
        listOrgans={data}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        treeData={treeData} />
      {
        info && <EditModal
          open={isEdit}
          handleModal={handleModal}
          getData={getData}
          infoEdit={info}
          listTypes={listTypes}
          setCurrentPage={setCurrentPage}
          listOrgans={data}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          treeData={treeData} />
      }
    </Card>
  )
}

export default ListOrganizations
