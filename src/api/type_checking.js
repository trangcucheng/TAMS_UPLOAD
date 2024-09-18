import { API_TAMS } from "./API_TAMS"

export const getTypeChecking = async (query) => {
  const uri = `/type-checking`
  const res = await API_TAMS.get(uri, query)
  return res
}

export const postTypeChecking = async (body) => {
  const uri = `/type-checking`
  const res = await API_TAMS.post(uri, body)
  return res
}

export const editTypeChecking = async (id, body) => {
  const uri = `/type-checking/${id}`
  const res = await API_TAMS.put(uri, body)
  return res
}

export const detailTypeChecking = async (id) => {
  const uri = `/type-checking/${id}`
  const res = await API_TAMS.get(uri)
  return res
}

export const deleteTypeChecking = async (id) => {
  const uri = `/type-checking/${id}`
  const res = await API_TAMS.delete(uri)
  return res
}