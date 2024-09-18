import { API_TAMS } from './API_TAMS'

export const createGroupUser = async (data) => {
    const uri = `/user-group/create-user-group`
    const res = await API_TAMS.post(uri, data)
    return res
}

export const getGroupUser = async (data) => {
    const uri = `/user-group/list-all-user-group`
    const res = await API_TAMS.get(uri, data)
    return res
}

export const deleteGroupUser = async (data) => {
    const uri = `/user-group/delete-user-group?userGroupId=${data}`
    const res = await API_TAMS.post(uri)
    return res
}

export const updateGroupUser = async (data) => {
    const uri = `/user-group/update-user-group`
    const res = await API_TAMS.post(uri, data)
    return res
}