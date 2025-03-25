import { API } from './API'

export const login = async (data) => {
    const uri = `/auth/login`
    const res = await API.post(uri, data)
    return res
}

export const logout = async () => {
    const uri = `/auth/logout`
    const res = await API.post(uri)
    return res
}

export const ssoLink = async () => {
    const uri = `/auth/oauthen2`
    const res = await API.post(uri)
    return res
}

export const changePass = async (data) => {
    const uri = `/auth/change-password`
    const res = await API.post(uri, data)
    return res
}
