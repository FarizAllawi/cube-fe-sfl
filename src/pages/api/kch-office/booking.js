import { useState , useEffect } from 'react'
import axios from 'configs/kch-office/axios'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import errorHandler from 'configs/errorHandler'

import useUser from '../user'

export default function useBooking() {
    const router = useRouter()
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    
    const { user, getUser } = useUser()

    const bookingFetcher = async (url) => {
        let userSession = user.token === undefined ? await getUser() : user

        let response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${userSession?.token}`
            }
        }).then(res => {
            return res?.data
        })

        return response
    }

    const getBookingDeskSection = async (uid_office , date = null) => {
        let userSession = user.token === undefined ? await getUser() : user

        setIsLoading(true)
        const response = await axios.get(`/api/booking/office/${uid_office}${date !== null && date !== '' ? '?date='+date : ''}`, {
            headers: {
                'Authorization': `Bearer ${userSession?.token}`
            }
        })
        .then(res => {
            setIsLoading(false)
            return res?.data
        })
        .catch(err => {
            setIsLoading(false)
        })

        return response
    }

    const getBookingByDesk = async (uid_desk, date = null) => {
        let userSession = user.token === undefined ? await getUser() : user

        setIsLoading(true)
        const response = await axios.get(`/api/booking/desk/${uid_desk}${date !== null && date !== '' ? '?date='+date : ''}`, {
            headers: {
                'Authorization': `Bearer ${userSession?.token}`
            }
        })
        .then(res => {
            setIsLoading(false)
            return res?.data
        })
        .catch(err => {
            setIsLoading(false)
            return false
        })

        return response
    }

    const getBookedList = async () => {
        let userSession = user.uid_user === undefined ? await getUser() : user

        setIsLoading(true)
        const response = await axios.get(`/api/booking/booked-list/${userSession?.uid_user}`, {
            headers: {
                'Authorization': `Bearer ${userSession?.token}`
            }
        })
        .then(res => {
            setIsLoading(false)
            return res?.data
        })
        .catch(err => {
            setIsLoading(false)
        })

        return response
    }

    const insertBookingDesk = async({setErrors, ...props}) => {
        let userSession = user.uid_user === undefined ? await getUser() : user

        setIsLoading(true)
        props['uid_user'] = userSession.uid_user
        const response = await axios.post(`/api/booking`, props, {
            headers: {
                'Authorization': `Bearer ${userSession?.token}`
            }
        })
        .then(res => {
            setIsLoading(false)
            return {
                status: res?.status,
                message: res?.message,
                data: res?.data
            }
            // return Promise.resolve(res.data)
        })
        .catch(err => {
            setIsLoading(false)
            return {
                status: err.response?.status,
                message: err.response?.data.message
            }
            // return Promise.reject(err.response.message)
        })

        return response
    }

    const cancelBookingDesk = async(uid_booking) => {
        let userSession = user.uid_user === undefined ? await getUser() : user

        setIsLoading(true)
        const response = await axios.delete(`/api/booking/cancel/${uid_booking}`, {
            headers: {
                'Authorization': `Bearer ${userSession?.token}`
            }
        })
        .then(res => {
            setIsLoading(false)
            return res?.data
        })
        .catch(err => {
            setIsLoading(false)
            return err.response?.status
        })

        return response
    } 

    useEffect(() => {

        // if (user?.isLogin === undefined) getUser()

    }, [router, user])

    return {
        isLoading, 
        errors,
        bookingFetcher,
        getBookingDeskSection,
        getBookingByDesk,
        getBookedList,
        insertBookingDesk,
        cancelBookingDesk
    }
}