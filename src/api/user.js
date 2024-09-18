import { API_PQ } from './API_PQ'
export const getDetaileUser = async (data) => {
    const uri = `/user/detail-user-by-id`
    const res = await API_PQ.get(uri, data)
    return res
}
