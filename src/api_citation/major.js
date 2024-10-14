import { API_TAMS } from "./API_TAMS"

export const getMajor = async (query) => {
  const uri = `/major`
  const res = await API_TAMS.get(uri, query)
  return res
}

export const postMajor = async (body) => {
  const uri = `/major`
  const res = await API_TAMS.post(uri, body)
  return res
}

export const editMajor = async (id, body) => {
  const uri = `/major/${id}`
  const res = await API_TAMS.put(uri, body)
  return res
}

export const detailMajor = async (id) => {
  const uri = `/major/${id}`
  const res = await API_TAMS.get(uri)
  return res
}

export const deleteMajor = async (id) => {
  const uri = `/major/${id}`
  const res = await API_TAMS.delete(uri)
  return res
}