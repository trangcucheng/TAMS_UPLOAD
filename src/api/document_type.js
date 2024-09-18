import { API_TAMS } from "./API_TAMS"

export const getDocumentType = async (query) => {
  const uri = `/document-type`
  const res = await API_TAMS.get(uri, query)
  return res
}

export const postDocumentType = async (body) => {
  const uri = `/document-type`
  const res = await API_TAMS.post(uri, body)
  return res
}

export const editDocumentType = async (id, body) => {
  const uri = `/document-type/${id}`
  const res = await API_TAMS.put(uri, body)
  return res
}

export const detailDocumentType = async (id) => {
  const uri = `/document-type/${id}`
  const res = await API_TAMS.get(uri)
  return res
}

export const deleteDocumentType = async (id) => {
  const uri = `/document-type/${id}`
  const res = await API_TAMS.delete(uri)
  return res
}