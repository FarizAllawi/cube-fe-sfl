import axios from 'axios'
import errorHandler from '../../errorHandler'

const instance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_ECA_SERVICE}`,
    headers: {
        'Access-Control-Allow-Origin' : `${process.env.NEXT_PUBLIC_ECA_SERVICE}`,
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
        'Accept': 'application/json, text/plain, /',
        'Content-Type': 'application/json',
        'ApiKey' : `${process.env.NEXT_PUBLIC_ECA_SERVICE_API_KEY}`,
    },
    // withCredentials: true
})

instance.interceptors.response.use((response) => response.data, errorHandler)
export default instance
