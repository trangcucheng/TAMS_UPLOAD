// ** React Imports
import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

const ListUsers = lazy(() => import('../../views/nentangloi/quanlyhethong/users'))
const Homepages1 = lazy(() => import('../../views/nentangloi/homepage'))
const ListOrganizationTypes = lazy(() => import('../../views/nentangloi/quanlydanhmuc/organizationTypes'))
// const ListOrganizationLevels = lazy(() => import('../../views/nentangloi/quanlydanhmuc/organizationLevels'))
const ListOrganizations = lazy(() => import('../../views/nentangloi/quanlydanhmuc/organizations'))

const CategoriesRoutes = [
    {
        element: <ListUsers />,
        path: '/tams/users',
        meta: {
            appLayout: true
        }
    },
    {
        element: <ListOrganizationTypes />,
        path: '/apps/categories/organizationTypes',
        meta: {
            appLayout: true
        }
    },
    // {
    //     element: <ListOrganizationLevels />,
    //     path: '/apps/categories/organizationLevels',
    //     meta: {
    //         appLayout: true
    //     }
    // },
    {
        element: <ListOrganizations />,
        path: '/apps/categories/organizations',
        meta: {
            appLayout: true
        }
    },

]

export default CategoriesRoutes
