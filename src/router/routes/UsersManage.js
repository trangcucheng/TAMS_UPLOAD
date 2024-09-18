// ** React Imports
import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

const ListAccounts = lazy(() => import('../../views/nentangloi/quanlyhethong/accounts'))
const ListUsers = lazy(() => import('../../views/nentangloi/quanlyhethong/users'))
const ListGroups = lazy(() => import('../../views/nentangloi/quanlyhethong/groupusers'))
const ListPermissionGroups = lazy(() => import('../../views/nentangloi/quanlyhethong/permissionGroups'))
const ListPermissions = lazy(() => import('../../views/nentangloi/quanlyhethong/permissions'))
const ListRoles = lazy(() => import('../../views/nentangloi/quanlyhethong/roles'))
const ListUserRoles = lazy(() => import('../../views/nentangloi/quanlyhethong/userRoles'))
const Roles = lazy(() => import('../../views/nentangloi/quanlyhethong/roles-permissions/roles'))
const ChangePass = lazy(() => import('../../views/nentangloi/quanlyhethong/users/changePass'))
// const Dashboard = lazy(() => import('../../views/apps/dashboard/pages/nentangloi'))
// const BanGiamDocDashBoard = lazy(() => import('../../views/apps/dashboard/bangiamdoc'))
const UsersManageRoutes = [
    {
        element: <ListAccounts />,
        path: '/tams/accounts',
        meta: {
            appLayout: true
        }
    },
    {
        element: <ListUsers />,
        path: '/tams/users',
        meta: {
            appLayout: true
        }
    },
    {
        element: <ListGroups />,
        path: '/tams/groupusers',
        meta: {
            appLayout: true
        }
    },
    {
        element: <ListPermissionGroups />,
        path: '/tams/permissionGroups',
        meta: {
            appLayout: true
        }
    },
    {
        element: <ListPermissions />,
        path: '/tams/permissions',
        meta: {
            appLayout: true
        }
    },
    {
        element: <ListRoles />,
        path: '/tams/roles',
        meta: {
            appLayout: true
        }
    },
    {
        element: <ListUserRoles />,
        path: '/tams/userRoles',
        meta: {
            appLayout: true
        }
    },
    {
        element: <ChangePass />,
        path: '/apps/users/changePass',
        meta: {
            appLayout: true
        }
    }
]

export default UsersManageRoutes
