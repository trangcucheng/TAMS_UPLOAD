import { API_TAMS } from "./API_TAMS"
import { API_FormData } from "./API_FormData"

export const extractingFromAllDoc = async () => {
    const uri = `/sentence-doc`
    const res = await API_TAMS.get(uri)
    return res
}

export const extractingFromFileUpload = async (body) => {
    const uri = `/sentence-doc`
    const res = await API_FormData.post(uri, body)
    return res
}

export const extractingFromDoc = async (docId) => {
    const uri = `/sentence-doc/${docId}`
    const res = await API_TAMS.get(uri)
    return res
}

export const extractingFromDirLocal = async () => {
    const uri = `/sentence-doc/read-local`
    const res = await API_TAMS.get(uri)
    return res
}

export const findByHash = async () => {
    const uri = `/sentence-doc/find-by-hash`
    const res = await API_TAMS.get(uri)
    return res
}