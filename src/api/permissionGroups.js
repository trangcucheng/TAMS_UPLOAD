import { API_PQ } from './API_PQ'

export const createGroupPermission = async (data) => {
    const uri = `/permission-group/create-permission-group`
    const res = await API_PQ.post(uri, data)
    return res
}

export const getGroupPermission = async (data) => {
    const uri = `/permission-group/list-all-permission-group`
    const res = await API_PQ.get(uri, data)
    return res
}

export const deleteGroupPermission = async (data) => {
    const uri = `/permission-group/delete-permission-group?permissionGroupId=${data}`
    const res = await API_PQ.post(uri)
    return res
}

export const updateGroupPermission = async (data) => {
    const uri = `/permission-group/update-permission-group`
    const res = await API_PQ.post(uri, data)
    return res
}