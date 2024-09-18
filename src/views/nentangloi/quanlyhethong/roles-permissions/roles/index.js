// ** React Imports
import { Fragment, useState, useEffect } from "react"
// ** Components
import { Row, Col } from "reactstrap"

import RoleCards from "./RoleCards"
import RolesTable from "./RolesTable"
import { getRole } from '../../../../../api/roles'

const ListPermission = () => {
  // ** States
  const [memberRole, setMemberRole] = useState({})
  const [memberRoleMeans, setMemberRoleMeans] = useState({})
  const [reload, setReload] = useState(false)
  const fetchUser = () => {
    getListGroupUser({
        page:  1,
        perPage: 10
    }).then(res => {
        // setData(res.result)
        const roleArr = res.result?.data
        const memberRole_ = roleArr.reduce((obj, item) => {
            obj[item.tenNhom] = item.maNhom
            return obj
          }, {})
        setMemberRole(memberRole_)
        const memberRoleMeans_ = roleArr.reduce((obj, item) => {
            obj[item.maNhom] = item.ghiChu
            return obj
          }, {})
        setMemberRoleMeans(memberRoleMeans_)
    })
}
  useEffect(() => {
    fetchUser()
  }, [])

  // ** State
  const [currentPage, setCurrentPage] = useState(0)

  return (
    <Fragment>
      <Row>
        <Col md="12">
          <RoleCards reload={reload} />
        </Col>
        <Col md="12">
          <RolesTable setReload = {setReload} reload={reload}/>
        </Col>
      </Row>
    </Fragment>
  )
}

export default ListPermission
