// ** Router imports
import { lazy, useContext } from 'react'

// ** Router imports
import { useRoutes, Navigate } from 'react-router-dom'

// ** Layouts
import BlankLayout from '@layouts/BlankLayout'

// ** Hooks Imports
import { useLayout } from '@hooks/useLayout'

// ** Utils
import { getUserData, getHomeRouteForLoggedInUser } from '../utility/Utils'

// ** GetRoutes
import { getRoutes } from './routes'
import { initialAbility } from '../configs/acl/initialAbility'
import { AbilityContext } from '@src/utility/context/Can'

// ** Components
const Error = lazy(() => import('../views/pages/misc/Error'))
const Login = lazy(() => import('../views/pages/authentication/Login'))
const NotAuthorized = lazy(() => import('../views/pages/misc/NotAuthorized'))
const DetailCheckingDocumentResult = lazy(() => import('../views/tams/checking_document/DetailResult'))
const DetailCheckingDocumentResult2 = lazy(() => import('../views/tams/checking_specialized/DetailResult2'))

const _handlePermission = (memberInfo) => {
  const permissionArr = memberInfo.permission ? JSON.parse(memberInfo.permission) : []
  let permissionArrFormat = permissionArr.map(permiss => {
    return {
      action: permiss.action,
      subject: permiss.subject
    }
  })
  permissionArrFormat = permissionArrFormat.concat(initialAbility)
  if (memberInfo.UserGroupID === 1) {
    permissionArrFormat = permissionArrFormat.concat({
      action: "manage",
      subject: "all"
    })
  }
  return permissionArrFormat
}
const Router = () => {
  // ** Hooks
  const { layout } = useLayout()

  const allRoutes = getRoutes(layout)
  const ability = useContext(AbilityContext)
  const getHomeRoute = () => {
    const user = getUserData()
    if (user) {
      const listPermission = _handlePermission(user)
      ability.update(listPermission)
      return getHomeRouteForLoggedInUser(user.role)
    } else {
      return '/login'
    }
  }

  const routes = useRoutes([
    {
      path: '/',
      index: true,
      element: <Navigate replace to={getHomeRoute()} />
    },
    {
      path: '/login',
      element: <BlankLayout />,
      children: [{ path: '/login', element: <Login /> }]
    },
    {
      path: '/auth/not-auth',
      element: <BlankLayout />,
      children: [{ path: '/auth/not-auth', element: <NotAuthorized /> }]
    },
    {
      path: '/tams/detail-result/:id',
      element: <BlankLayout />,
      children: [{ path: '/tams/detail-result/:id', element: <DetailCheckingDocumentResult /> }]
    },
    {
      path: '/tams/detail-result2/:id',
      element: <BlankLayout />,
      children: [{ path: '/tams/detail-result2/:id', element: <DetailCheckingDocumentResult2 /> }]
    },
    {
      path: '*',
      element: <BlankLayout />,
      children: [{ path: '*', element: <Error /> }]
    },
    ...allRoutes
  ])

  return routes
}

export default Router
