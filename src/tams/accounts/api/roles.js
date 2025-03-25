import { API } from './API'

export const createRole = async (data) => {
    const uri = `/role/create-role`
    const res = await API.post(uri, data)
    return res
}

export const getRole = async (data) => {
    const uri = `/role/list-all-role`
    const res = await API.get(uri, data)
    return res
}

export const deleteRole = async (data) => {
    const uri = `/role/delete-role?roleId=${data}`
    const res = await API.post(uri)
    return res
}

export const updateRole = async (data) => {
    const uri = `/role/update-role`
    const res = await API.post(uri, data)
    return res
}

export const listAllRolePer = async (data) => {
    const uri = `/role/list-all-role-permission`
    const res = await API.get(uri, data)
    return res
}

export const listAllRoleUserCount = async () => {
    const uri = `/role/list-all-role-user-count`
    const res = await API.get(uri)
    return res
}