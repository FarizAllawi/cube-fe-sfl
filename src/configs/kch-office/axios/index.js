import axios from 'axios'
import errorHandler from '../../errorHandler'

const instance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_KCH_OFFICE_SERVICE}`,
    headers: {
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
        'Accept': 'application/json, text/plain, /',
        'Content-Type': 'application/json',
        'X-Requested-With' : 'XMLHttpRequest',
        'ApiKey' : `${process.env.NEXT_PUBLIC_KCH_OFFICE_SERVICE_API_KEY}`,
    },
    // withCredentials: true
})

instance.interceptors.response.use((response) => response.data, errorHandler)
export default instance
