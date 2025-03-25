import { API } from './API'
export const getDetaileUser = async (data) => {
    const uri = `/user/detail-user-by-id`
    const res = await API.get(uri, data)
    return res
}
