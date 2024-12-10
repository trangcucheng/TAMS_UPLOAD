import { API_PQ } from './API_PQ'

export const createUser = async (data) => {
    const uri = `/user/create-user`
    const res = await API_PQ.post(uri, data)
    return res
}

export const getDetailUser = async (data) => {
    const uri = `/user/detail-user`
    const res = await API_PQ.get(uri, data)
    return res
}

export const listAllUser = async (data) => {
    const uri = `/user/list-all-user`
    const res = await API_PQ.get(uri, data)
    return res
}

export const updateUser = async (data) => {
    const uri = `/user/update-user`
    const res = await API_PQ.post(uri, data)
    return res
}

export const deleteUser = async (data) => {
    const uri = `/user/delete-user?userId=${data}`
    const res = await API_PQ.post(uri)
    return res
}

export const getDetailUserById = async (data) => {
    const uri = `/user/detail-user-by-id`
    const res = await API_PQ.get(uri, data)
    return res
}

export const activeLockUser = async (data) => {
    const uri = `/user/active-lock-user`
    const res = await API_PQ.post(uri, data)
    return res
}

export const getListUserByRole = async (data) => {
    const uri = `/user/get-list-user-by-roleid`
    const res = await API_PQ.get(uri, data)
    return res
}

export const getListOnline = async () => {
    const uri = `/user/get-active-session`
    const res = await API_PQ.post(uri)
    return res
}

export const changePass = async (data) => {
    const uri = `/auth/change-password`
    const res = await API_PQ.post(uri, data)
    return res
}