import { API_TAMS } from "./API_TAMS"

export const getCheckingDocumentStatisticByTime = async (query) => {
    const uri = `/checking-document/statistical-by-time`
    const res = await API_TAMS.get(uri, query)
    return res
}

export const getCheckingDocumentStatisticByDuplicate = async (query) => {
    const uri = `/checking-document/statistical-by-duplicate`
    const res = await API_TAMS.get(uri, query)
    return res
}
