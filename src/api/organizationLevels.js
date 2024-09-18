import { API_PQ } from './API_PQ'

export const createOrganizationLevel = async (data) => {
    const uri = `/organizationlevel/create-organizationlevel`
    const res = await API_PQ.post(uri, data)
    return res
}

export const deleteOrganizationLevel = async (data) => {
    const uri = `/organizationlevel/delete-organizationlevel?organizationLevelID=${data}`
    const res = await API_PQ.delete(uri)
    return res
}

export const updateOrganizationLevel = async (data) => {
    const uri = `/organizationlevel/update-organizationlevel`
    const res = await API_PQ.put(uri, data)
    return res
}