// ** React Imports
import { useState, useEffect, forwardRef } from 'react'
import { Link } from 'react-router-dom'

// ** Table Columns
// import { columns } from './columns'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import { getAllData, getData } from '@src/views/apps/user/store'
import Avatar from '@components/avatar'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { ChevronDown, Eye, User, Slack, Settings, Database, Edit2, Edit, Delete, Trash } from 'react-feather'
import DataTable from 'react-data-table-component'

// ** Reactstrap Imports
import { Card, Input, Row, Col, Button, Badge, UncontrolledTooltip } from 'reactstrap'

// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef((props, ref) => (
  <div className='form-check'>
    <Input type='checkbox' ref={ref} {...props} />
  </div>
))

// ** Table Header
const CustomHeader = ({ plan, handlePlanChange, handlePerPage, rowsPerPage, handleFilter, searchTerm }) => {
  return (
    <div className='invoice-list-table-header w-100 mt-2 mb-75' style={{padding: "0px"}}>
      <Row className='text-nowrap w-100 my-75 g-0 permission-header'>
       <Col xs={12} lg={4} sm={6} className='d-flex align-items-center'>
        <div className='d-flex align-items-center justify-content-center justify-content-lg-start'>
          <label htmlFor='rows-per-page'>Hiển thị</label>
          <Input
            className='mx-50'
            type='select'
            id='rows-per-page'
            value={rowsPerPage}
            onChange={handlePerPage}
            style={{ width: '5rem' }}
          >
            <option value='10'>10</option>
            <option value='25'>25</option>
            <option value='50'>50</option>
          </Input>
          <label htmlFor='rows-per-page'>trên tổng số 20 bản ghi</label>
        </div>
      </Col>
      <Col xs={12} lg={8} sm={6}>
        <div className='d-flex align-items-center justify-content-lg-end justify-content-start flex-md-nowrap flex-wrap mt-lg-0 mt-1'>
          <div className='d-flex align-items-center'>
            <label className='mb-0' htmlFor='search-permission'>
              Tìm kiếm:
            </label>
            <Input
              type='text'
              value={searchTerm}
              id='search-permission'
              className='ms-50 w-100 me-1'
              onChange={e => handleFilter(e.target.value)}
            />
          </div>
          <div className='mt-50 width-200 me-1 mt-sm-0 mt-1'>
            <Input type='select' name='select' onChange={e => handleAssignedToChange(e.target.value)}>
              <option value=''>Chọn nhóm người dùng</option>
              <option value='administrator'>Administrator</option>
              <option value='manager'>Manager</option>
              <option value='user'>User</option>
              <option value='support'>Support</option>
              <option value='restricted-user'>Restricted User</option>
            </Input>
          </div>
          <Button className='add-permission mt-sm-0 mt-1' color='primary' onClick={() => setShow(true)}>
            Thêm mới
          </Button>
        </div>
      </Col>
      </Row>
    </div>
  )
}

const Table = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector(state => state.users)

  // ** States
  const [plan, setPlan] = useState('')
  const [sort, setSort] = useState('desc')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sortColumn, setSortColumn] = useState('id')

  // ** Get data on mount
  useEffect(() => {
    dispatch(getAllData())
    dispatch(
      getData({
        sort,
        role: '',
        sortColumn,
        status: '',
        q: searchTerm,
        currentPlan: plan,
        page: currentPage,
        perPage: rowsPerPage
      })
    )
  }, [dispatch, store.data.length])
 // ** Renders Client Columns
const renderClient = row => {
  if (row.avatar.length) {
    return <Avatar className='me-1' img={row.avatar} width='32' height='32' />
  } else {
    return (
      <Avatar
        initials
        className='me-1'
        content={row.fullName || 'John Doe'}
        color={row.avatarColor || 'light-primary'}
      />
    )
  }
}

// ** Renders Role Columns
const renderRole = row => {
  const roleObj = {
    subscriber: {
      class: 'text-primary',
      icon: User
    },
    maintainer: {
      class: 'text-success',
      icon: Database
    },
    editor: {
      class: 'text-info',
      icon: Edit2
    },
    author: {
      class: 'text-warning',
      icon: Settings
    },
    admin: {
      class: 'text-danger',
      icon: Slack
    }
  }

  const Icon = roleObj[row.role] ? roleObj[row.role].icon : Edit2

  return (
    <span className='text-truncate text-capitalize align-middle'>
      <Icon size={18} className={`${roleObj[row.role] ? roleObj[row.role].class : ''} me-50`} />
      {row.role}
    </span>
  )
}

const statusObj = {
  pending: 'light-warning',
  active: 'light-success',
  inactive: 'light-secondary'
}
const columns = [
  {
    name: 'STT',
    center: true,
    width: '80px',
    sortField: 'fullName',
    selector: row => row.fullName,
    cell: (row, index) => ((currentPage - 1) * rowsPerPage) + index + 1
  },
  {
    name: 'Họ và tên',
    sortable: true,
    minWidth: '217px',
    sortField: 'fullName',
    selector: row => row.fullName,
    cell: row => (
      <div className='d-flex justify-content-left align-items-center'>
        {renderClient(row)}
        <div className='d-flex flex-column'>
          <Link
            to={`/apps/user/view/${row.id}`}
            className='user_name text-truncate text-body'
            onClick={() => store.dispatch(getUser(row.id))}
          >
            <span className='fw-bold'>{row.fullName}</span>
          </Link>
          <small className='text-truncate text-muted mb-0'>{row.email}</small>
        </div>
      </div>
    )
  },
  {
    name: 'Tên đăng nhập',
    sortable: true,
    minWidth: '162px',
    sortField: 'role',
    selector: row => row.role,
    cell: row => renderRole(row)
  },
  {
    name: 'Ngày bắt đầu hoạt động',
    sortable: true,
    minWidth: '172px',
    sortField: 'role',
    selector: row => row.role,
    cell: row => renderRole(row)
  },
  {
    name: 'Nhóm người dùng',
    sortable: true,
    minWidth: '172px',
    sortField: 'role',
    selector: row => row.role,
    cell: row => renderRole(row)
  },
  // {
  //   name: 'Plan',
  //   sortable: true,
  //   minWidth: '138px',
  //   sortField: 'currentPlan',
  //   selector: row => row.currentPlan,
  //   cell: row => <span className='text-capitalize'>{row.currentPlan}</span>
  // },
  {
    name: 'Trạng thái',
    sortable: true,
    minWidth: '138px',
    sortField: 'status',
    selector: row => row.status,
    cell: row => (
      <Badge className='text-capitalize' color={statusObj[row.status]} pill>
        {row.status}
      </Badge>
    )
  },
  {
    name: 'Thao tác',
    minWidth: '100px',
    cell: row => (
      <div className='d-flex'>
        <Link to={`/apps/user/view/${row.id}`} id='tooltip_eye'>
        <Eye className='font-medium-3 text-body blue-icon' />
      </Link>
      <UncontrolledTooltip placement='top' target='tooltip_eye'>
                    Xem chi tiết              
      </UncontrolledTooltip>      
      <div className='ms-1' id='tooltip_edit'>
        <Edit className='font-medium-3 text-body blue-icon' />
      </div>
      <UncontrolledTooltip placement='top' target='tooltip_edit'>
                    Chỉnh sửa              
      </UncontrolledTooltip> 
      <div className='ms-1' id='tooltip_delete'>
        <Trash className='font-medium-3 text-body red-icon' />
      </div>
      <UncontrolledTooltip placement='top' target='tooltip_delete'>
                    Xóa             
      </UncontrolledTooltip>
      </div>
    )
  }
]

  // ** Function in get data on page change
  const handlePagination = page => {
    dispatch(
      getData({
        sort,
        role: '',
        status: '',
        sortColumn,
        q: searchTerm,
        currentPlan: plan,
        perPage: rowsPerPage,
        page: page.selected + 1
      })
    )
    setCurrentPage(page.selected + 1)
  }

  // ** Function in get data on rows per page
  const handlePerPage = e => {
    const value = parseInt(e.currentTarget.value)
    dispatch(
      getData({
        sort,
        role: '',
        sortColumn,
        status: '',
        q: searchTerm,
        perPage: value,
        currentPlan: plan,
        page: currentPage
      })
    )
    setRowsPerPage(value)
  }

  // ** Function in get data on search query change
  const handleFilter = val => {
    setSearchTerm(val)
    dispatch(
      getData({
        q: val,
        sort,
        role: '',
        sortColumn,
        status: '',
        currentPlan: plan,
        page: currentPage,
        perPage: rowsPerPage
      })
    )
  }

  const handlePlanChange = val => {
    setPlan(val)
    dispatch(
      getData({
        sort,
        role: val,
        sortColumn,
        status: '',
        q: searchTerm,
        currentPlan: plan,
        page: currentPage,
        perPage: rowsPerPage
      })
    )
  }

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Number(Math.ceil(store.total / rowsPerPage))

    return (
      <ReactPaginate
          nextLabel=''
          pageCount={count || 1}
          breakLabel='...'
          previousLabel=''
          forcePage={currentPage !== 0 ? currentPage - 1 : 0}
          pageRangeDisplayed={5}
          marginPagesDisplayed={2}
          activeClassName='active'
          pageClassName='page-item'
          breakClassName='page-item'
          pageLinkClassName='page-link'
          nextLinkClassName='page-link'
          breakLinkClassName='page-link'
          previousLinkClassName='page-link'
          nextClassName='page-item next-item'
          previousClassName='page-item prev-item'
          containerClassName='pagination react-paginate justify-content-end my-1 pe-1'
        />
    )
  }

  // ** Table data to render
  const dataToRender = () => {
    const filters = {
      q: searchTerm
    }

    const isFiltered = Object.keys(filters).some(function (k) {
      return filters[k].length > 0
    })

    if (store.data.length > 0) {
      return store.data
    } else if (store.data.length === 0 && isFiltered) {
      return []
    } else {
      return store.allData.slice(0, rowsPerPage)
    }
  }

  const handleSort = (column, sortDirection) => {
    setSort(sortDirection)
    setSortColumn(column.sortField)
    dispatch(
      getData({
        sort,
        role: '',
        sortColumn,
        status: '',
        q: searchTerm,
        currentPlan: plan,
        page: currentPage,
        perPage: rowsPerPage
      })
    )
  }

  return (
    <Card>
      <div className='react-dataTable'>
        <DataTable
        style={{padding: "0px 20px"}}
          noDataComponent="Không có bản ghi nào"
          persistTableHead={true}
          noHeader
          subHeader
          pagination
          responsive
          // selectableRows
          paginationServer
          columns={columns}
          onSort={handleSort}
          data={dataToRender()}
          sortIcon={<ChevronDown />}
          paginationComponent={CustomPagination}
          // selectableRowsComponent={BootstrapCheckbox}
          className='react-dataTable'
          subHeaderComponent={
            <CustomHeader
              plan={plan}
              searchTerm={searchTerm}
              rowsPerPage={rowsPerPage}
              handleFilter={handleFilter}
              handlePerPage={handlePerPage}
              handlePlanChange={handlePlanChange}
              
            />
          }
        />
      </div>
    </Card>
  )
}

export default Table
