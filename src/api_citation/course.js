import { API_TAMS } from "./API_TAMS"

export const getCourse = async (query) => {
  const uri = `/course`
  const res = await API_TAMS.get(uri, query)
  return res
}

export const postCourse = async (body) => {
  const uri = `/course`
  const res = await API_TAMS.post(uri, body)
  return res
}

export const editCourse = async (id, body) => {
  const uri = `/course/${id}`
  const res = await API_TAMS.put(uri, body)
  return res
}

export const detailCourse = async (id) => {
  const uri = `/course/${id}`
  const res = await API_TAMS.get(uri)
  return res
}

export const deleteCourse = async (id) => {
  const uri = `/course/${id}`
  const res = await API_TAMS.delete(uri)
  return res
}

export const toggleActiveCourse = async (id) => {
  const uri = `/course/${id}/toggleIsActive`
  const res = await API_TAMS.put(uri)
  return res
}