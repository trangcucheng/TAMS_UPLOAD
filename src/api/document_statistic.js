import { API_TAMS } from "./API_TAMS"

export const getDocumentStatisticByTime = async (query) => {
    const uri = `/document/statistical-by-time`
    const res = await API_TAMS.get(uri, query)
    return res
}

export const getDocumentStatisticByMajor = async (query) => {
    const uri = `/document/statistical-by-major`
    const res = await API_TAMS.get(uri, query)
    return res
}
