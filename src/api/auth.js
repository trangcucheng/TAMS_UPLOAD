import axios from "axios"
export default class Auth {
    static saveToken(token) {
        window.localStorage.setItem('accessToken', token)
    }

    static removeToken() {
        window.localStorage.removeItem('accessToken')
    }

    static async refreshToken() {
        // this.removeToken()
        const refreshToken = window.localStorage.getItem('refreshToken')
        try {
            const refreshRes = await axios.post(`${process.env.REACT_APP_API_URL_PQ}api/v1/auth/refresh-token`, {refreshToken})
            const newToken = refreshRes?.data?.accessToken
            if (!newToken) {
                return false
            }
            this.saveToken(newToken)
            return true
        } catch (e) {
            // this.removeToken()
            window.location.href = '/login'
        }
    }
}