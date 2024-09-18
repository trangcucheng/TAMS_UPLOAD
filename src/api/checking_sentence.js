import { API_TAMS } from "./API_TAMS"
import { API_FormData } from "./API_FormData"

export const extractingFromDoc = async (docId) => {
  const uri = `/checking-sentence/${docId}`
  const res = await API_TAMS.get(uri)
  return res
}

export const extractingFromFileUpload = async (body) => {
  const uri = `/checking-sentence/upload`
  const res = await API_FormData.post(uri, body)
  return res
}

export const getListDocFromSetenceId = async (id) => {
  const uri = `/checking-document-sentence/${id}/get-list-doc-v2`
  const res = await API_TAMS.get(uri)
  return res
}

export const checkSentence = async (body) => {
  const uri = `/checksentence`
  const res = await API_TAMS.post(uri, body)
  return res
}