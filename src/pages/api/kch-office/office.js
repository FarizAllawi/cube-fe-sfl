import axios from 'configs/kch-office/axios'
import { useRouter } from 'next/router'
import { useState , useEffect } from 'react'
import errorHandler from 'configs/errorHandler'

import useUser from '../user'

export default function useOffice() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [deskSection, setDeskSection] = useState([])

    const { user, getUser } = useUser()

    const getAllOffice = async () => {
        let office = []
        let userSession = user.token === undefined ? await getUser() : user
        setIsLoading(true)

		const response = await axios.get(`api/office`, {
            headers: {
                'Authorization': `Bearer ${userSession?.token}`
            }
        })
        .then(res => {
            office = res?.data
            setIsLoading(false)
        })
        .catch(err => {
            setIsLoading(false)
        })

        return office
    }

    const getOfficeById = async (uid_office) => {
        let userSession = user.token === undefined ? await getUser() : user

        setIsLoading(true)
        const response = await axios.get(`/api/office/${uid_office}`, {
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

    useEffect(() => {

        // if (user?.isLogin === undefined) getUser()

    }, [router, user])

    return {
        isLoading, getAllOffice, getOfficeById
    }
}