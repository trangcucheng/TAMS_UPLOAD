import { lazy } from 'react'

const Document = lazy(() => import('../../views/tams/document'))
const DocumentStatistic = lazy(() => import('../../views/tams/document_statistic'))
const CheckingDocument = lazy(() => import('../../views/tams/checking_document'))
const CheckingSpecialized = lazy(() => import('../../views/tams/checking_specialized'))
const CheckingDocumentResult = lazy(() => import('../../views/tams/checking_document/CheckingResult'))
const CheckingSpecializedResult = lazy(() => import('../../views/tams/checking_specialized/CheckingResult'))
const Course = lazy(() => import('../../views/tams/course'))
const Major = lazy(() => import('../../views/tams/major'))
const DocumentType = lazy(() => import('../../views/tams/document_type'))
const DocumentSource = lazy(() => import('../../views/tams/document_source'))
const Organization = lazy(() => import('../../views/nentangloi/quanlydanhmuc/organizations'))
const OrganizationType = lazy(() => import('../../views/nentangloi/quanlydanhmuc/organizationTypes'))

const Config = lazy(() => import('../../views/nentangloi/quanlyhethong/config'))

const TamsRoutes = [
    {
        path: '/tams/document',
        element: <Document />
    },
    {
        path: '/tams/document-statistic',
        element: <DocumentStatistic />
    },
    {
        path: '/tams/checking-document',
        element: <CheckingDocument />
    },
    {
        path: '/tams/checking-specialized',
        element: <CheckingSpecialized />
    },
    {
        path: '/tams/checking-document-result/:id',
        element: <CheckingDocumentResult />
    },
    {
        path: '/tams/checking-specialized-result/:id',
        element: <CheckingSpecializedResult />
    },
    {
        path: '/tams/course',
        element: <Course />
    },
    {
        path: '/tams/major',
        element: <Major />
    },
    {
        path: '/tams/document-type',
        element: <DocumentType />
    },
    {
        path: '/tams/document-source',
        element: <DocumentSource />
    },
    {
        path: '/tams/organization',
        element: <Organization />
    },
    {
        path: '/tams/organization-type',
        element: <OrganizationType />
    },
    {
        path: '/tams/config',
        element: <Config />
    }
]

export default TamsRoutes