import axios from 'axios'
import errorHandler from '../../errorHandler'

const instance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_ECA_SERVICE}`,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With' : 'XMLHttpRequest',
        'ApiKey' : `${process.env.NEXT_PUBLIC_ECA_SERVICE_API_KEY}`,
    },
    // withCredentials: true
})

instance.interceptors.response.use((response) => response.data, errorHandler)
export default instance
