import { API } from './API'

export const createGroupUser = async (data) => {
    const uri = `/user-group/create-user-group`
    const res = await API.post(uri, data)
    return res
}

export const getGroupUser = async (data) => {
    const uri = `/user-group/list-all-user-group`
    const res = await API.get(uri, data)
    return res
}

export const deleteGroupUser = async (data) => {
    const uri = `/user-group/delete-user-group?userGroupId=${data}`
    const res = await API.post(uri)
    return res
}

export const updateGroupUser = async (data) => {
    const uri = `/user-group/update-user-group`
    const res = await API.post(uri, data)
    return res
}