import { API_TAMS } from "./API_TAMS"

export const getListSentenceByCheckingResult = async (query) => {
    const uri = `/getListSentenceByCheckingResultByWord`
    const res = await API_TAMS.get(uri, query)
    return res
}