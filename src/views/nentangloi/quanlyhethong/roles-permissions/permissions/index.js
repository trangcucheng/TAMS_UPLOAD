// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import { Card } from 'reactstrap'

// ** Table Import
import Table from './Table'

const Permissions = () => {
  return (
    <Fragment>
      <h3>Danh sách quyền</h3>
      <Card>
        <div className='card-datatable app-user-list table-responsive'>
          <Table />
        </div>
      </Card>
    </Fragment>
  )
}

export default Permissions
