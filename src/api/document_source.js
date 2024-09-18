import { API_TAMS } from "./API_TAMS"

export const getDocumentSource = async (query) => {
  const uri = `/document-source`
  const res = await API_TAMS.get(uri, query)
  return res
}

export const postDocumentSource = async (body) => {
  const uri = `/document-source`
  const res = await API_TAMS.post(uri, body)
  return res
}

export const editDocumentSource = async (id, body) => {
  const uri = `/document-source/${id}`
  const res = await API_TAMS.put(uri, body)
  return res
}

export const detailDocumentSource = async (id) => {
  const uri = `/document-source/${id}`
  const res = await API_TAMS.get(uri)
  return res
}

export const deleteDocumentSource = async (id) => {
  const uri = `/document-source/${id}`
  const res = await API_TAMS.delete(uri)
  return res
}