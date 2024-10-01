import { API_XX } from "./API_XX"
import { API_FormData_XX } from "./API_FormData_XX"

export const getDocument = async (query) => {
    const uri = `/document`
    const res = await API_XX.get(uri, query)
    return res
}

export const postDocument = async (body) => {
    const uri = `/document`
    const res = await API_FormData_XX.post(uri, body)
    return res
}

export const editDocument = async (id, body) => {
    const uri = `/document/${id}`
    const res = await API_FormData_XX.put(uri, body)
    return res
}

export const detailDocument = async (id) => {
    const uri = `/document/${id}`
    const res = await API_XX.get(uri)
    return res
}

export const deleteDocument = async (id) => {
    const uri = `/document/${id}`
    const res = await API_XX.delete(uri)
    return res
}

export const statisticByTime = async (params) => {
    const uri = `/document/statistical-by-time`
    const res = await API_XX.get(uri, params)
    return res
}

export const statisticByType = async (params) => {
    const uri = `/document/statistical-by-type`
    const res = await API_XX.get(uri, params)
    return res
}

export const postFromExcel = async (body) => {
    const uri = `/document/import-from-excel`
    const res = await API_FormData_XX.post(uri, body)
    return res
}