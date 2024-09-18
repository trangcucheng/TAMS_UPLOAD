import { API_TAMS } from "./API_TAMS"
import { API_FormData } from "./API_FormData"

export const getDocument = async (query) => {
  const uri = `/document`
  const res = await API_TAMS.get(uri, query)
  return res
}

export const postDocument = async (body) => {
  const uri = `/document`
  const res = await API_FormData.post(uri, body)
  return res
}

export const editDocument = async (id, body) => {
  const uri = `/document/${id}`
  const res = await API_FormData.put(uri, body)
  return res
}

export const detailDocument = async (id) => {
  const uri = `/document/${id}`
  const res = await API_TAMS.get(uri)
  return res
}

export const deleteDocument = async (id) => {
  const uri = `/document/${id}`
  const res = await API_TAMS.delete(uri)
  return res
}

export const statisticByTime = async (params) => {
  const uri = `/document/statistical-by-time`
  const res = await API_TAMS.get(uri, params)
  return res
}

export const statisticByType = async (params) => {
  const uri = `/document/statistical-by-type`
  const res = await API_TAMS.get(uri, params)
  return res
}