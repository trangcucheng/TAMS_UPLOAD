import axios from 'axios'
import queryString from 'query-string'
import Auth from './auth'

function getAuthToken() {
    return window.localStorage.getItem("accessToken") ?? ""
}

const API_XX = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL_TAMS_CHECKING_UPLOAD_XX}/`,
    headers: {
        // 'content-type':'multipart/form-data'
        'content-type': 'application/json'
    },
    paramsSerializer: params => queryString.stringify(params)
})

API_XX.interceptors.request.use(async (config) => {
    //hanlde tooken...
    config.headers = {
        ...(config.headers ?? {}),
        Authorization: `Bearer ${getAuthToken()}`
    }
    return { ...config }
})

API_XX.interceptors.response.use((response) => {
    if (response && response.data) {
        return response.data
    }
    return response
}, (error) => {
    const status = error.response ? error.response.status : null
    const originalConfig = error.config
    console.log("error", error)
    // Access Token was expired
    if (status === 401) {
        return Auth.refreshToken().then(res => {
            error.config.headers['Authorization'] = `Bearer ${getAuthToken()}`
            return API_XX(error.config)
        })
    }
    if (status === 408) {
        window.localStorage.clear()
        window.location.href = '/login'
    }
    return Promise.reject(error)
})

export { API_XX }