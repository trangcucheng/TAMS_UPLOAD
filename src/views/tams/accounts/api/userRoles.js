import { API } from './API'

export const updateUserManyRole = async (data) => {
    const uri = `/user-role/create-user-role-by-userid-roles`
    const res = await API.post(uri, data)
    return res
}

export const getListUserByRole = async (data) => {
    const uri = `/user-role/get-list-user-by-roleid`
    const res = await API.get(uri, data)
    return res
}