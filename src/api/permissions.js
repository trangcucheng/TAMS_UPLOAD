import { API_PQ } from './API_PQ'

export const createPermission = async (data) => {
    const uri = `/permission/create-permission`
    const res = await API_PQ.post(uri, data)
    return res
}

export const getPermission = async (data) => {
    const uri = `/permission/list-all-permission`
    const res = await API_PQ.get(uri, data)
    return res
}

export const getPermissionByGroup = async (data) => {
    const uri = `/permission/list-all-permission-by-groupid`
    const res = await API_PQ.get(uri, data)
    return res
}

export const getPermissionByRole = async (data) => {
    const uri = `/permission/list-all-permission-by-roleid`
    const res = await API_PQ.get(uri, data)
    return res
}

export const deletePermission = async (data) => {
    const uri = `/permission/delete-permission?permissionId=${data}`
    const res = await API_PQ.post(uri)
    return res
}

export const updatePermission = async (data) => {
    const uri = `/permission/update-permission`
    const res = await API_PQ.post(uri, data)
    return res
}

export const getPermissionNoGroup = async (data) => {
    const uri = `/permission/list-all-permission-no-group`
    const res = await API_PQ.get(uri, data)
    return res
}

export const createManyPermission = async (data) => {
    const uri = `/permission/create-many-permission`
    const res = await API_PQ.post(uri, data)
    return res
}

export const listPerNotInRole = async (data) => {
    const uri = `/permission/list-all-permission-not-in-roleid`
    const res = await API_PQ.get(uri, data)
    return res
}