import { API_PQ } from './API_PQ'

export const updateUserManyRole = async (data) => {
    const uri = `/user-role/create-user-role-by-userid-roles`
    const res = await API_PQ.post(uri, data)
    return res
}

export const getListUserByRole = async (data) => {
    const uri = `/user-role/get-list-user-by-roleid`
    const res = await API_PQ.get(uri, data)
    return res
}