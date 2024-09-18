import { API_TAMS } from "./API_TAMS"

export const getSystemParameter = async (query) => {
  const uri = `/system-parameter`
  const res = await API_TAMS.get(uri, query)
  return res
}

export const postSystemParameter = async (body) => {
  const uri = `/system-parameter`
  const res = await API_TAMS.post(uri, body)
  return res
}

export const editSystemParameter = async (id, body) => {
  const uri = `/system-parameter/${id}`
  const res = await API_TAMS.put(uri, body)
  return res
}

export const detailSystemParameter = async (id) => {
  const uri = `/system-parameter/${id}`
  const res = await API_TAMS.get(uri)
  return res
}

export const deleteSystemParameter = async (id) => {
  const uri = `/system-parameter/${id}`
  const res = await API_TAMS.delete(uri)
  return res
}