import { API_TAMS } from "./API_TAMS"

export const getSimilarDocument = async (id, query) => {
  const uri = `/getResult/${id}`
  const res = await API_TAMS.get(uri, query)
  return res
}

export const getTop3SimilarDocument = async (id) => {
  const uri = `/getTop3Result/${id}`
  const res = await API_TAMS.get(uri)
  return res
}

export const getListSentenceByCheckingResult = async (query) => {
  const uri = `/getListSentenceByCheckingResult`
  const res = await API_TAMS.get(uri, query)
  return res
}

export const getCheckingResult = async (query) => {
  const uri = `/checking-result`
  const res = await API_TAMS.get(uri, query)
  return res
}

export const getCheckingResultHTML = async (query) => {
  const uri = `/getHtmlResult`
  const res = await API_TAMS.get(uri, query)
  return res
}

export const getCheckingResultHTML2 = async (query) => {
  const uri = `/getHtmlResult2`
  const res = await API_TAMS.get(uri, query)
  return res
}