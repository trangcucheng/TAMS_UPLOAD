// ** React Imports
import { Outlet } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
// ** Core Layout Import
// !Do not remove the Layout import
import Layout from '@layouts/VerticalLayout'

// ** Menu Items Array
import navigation from '@src/navigation/vertical'

const VerticalLayout = props => {
  const { roleId } = useSelector(state => state.ecommerce)
  // const [menuData, setMenuData] = useState([])
  const userData = JSON.parse(localStorage.getItem('userData'))
  const listRoles = userData?.listRoles ?? []
  const navigation_ = navigation?.filter(x => x.role === (roleId ? roleId : listRoles[0]?.role))
  // ** For ServerSide navigation
  // useEffect(() => {
  // }, [roleId])

  return (
    <Layout menuData={navigation_} {...props}>
      <Outlet />
    </Layout>
  )
}

export default VerticalLayout
