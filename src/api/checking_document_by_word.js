import { API_TAMS } from "./API_TAMS"

export const getCheckingDocument = async (query) => {
    const uri = `/checking-document-by-word`
    const res = await API_TAMS.get(uri, query)
    return res
}
