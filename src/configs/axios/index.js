import axios from 'axios'
import errorHandler from '../errorHandler'

const instance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_HOST}`,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With' : 'XMLHttpRequest',
        'ApiKey' : `${process.env.NEXT_PUBLIC_API_KEY}`,
    },
    // withCredentials: true
})

instance.interceptors.response.use((response) => response.data, errorHandler)
export default instance
