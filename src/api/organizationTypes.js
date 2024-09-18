import { API_PQ } from './API_PQ'

export const createOrganizationType = async (data) => {
    const uri = `/organizationtype/create-organizationtype`
    const res = await API_PQ.post(uri, data)
    return res
}

export const getOrganizationType = async (data) => {
    const uri = `/organizationtype/list-all-organizationtype`
    const res = await API_PQ.get(uri, data)
    return res
}

export const deleteOrganizationType = async (data) => {
    const uri = `/organizationtype/delete-organizationtype?organizationTypeID=${data}`
    const res = await API_PQ.delete(uri)
    return res
}

export const updateOrganizationType = async (data) => {
    const uri = `/organizationtype/update-organizationtype`
    const res = await API_PQ.put(uri, data)
    return res
}