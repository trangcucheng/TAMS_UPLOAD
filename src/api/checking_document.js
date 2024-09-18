import { API_TAMS } from "./API_TAMS"

export const getCheckingDocument = async (query) => {
  const uri = `/checking-document`
  const res = await API_TAMS.get(uri, query)
  return res
}

export const postCheckingDocument = async (body) => {
  const uri = `/checking-document`
  const res = await API_TAMS.post(uri, body)
  return res
}

export const editCheckingDocument = async (id, body) => {
  const uri = `/checking-document/${id}`
  const res = await API_TAMS.put(uri, body)
  return res
}

export const detailCheckingDocument = async (id) => {
    const uri = `/checking-document/${id}`
    const res = await API_TAMS.get(uri)
    return res
  }

export const deleteCheckingDocument = async (id) => {
    const uri = `/checking-document/${id}`
    const res = await API_TAMS.delete(uri)
    return res
  }