import axios from 'configs/axios'
import { useRouter } from 'next/router'
import { useState , useEffect } from 'react'
import errorHandler from 'configs/errorHandler'

import useUser from './user'

export default function useBooking() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [deskSection, setDeskSection] = useState([])

    const { user, getUser } = useUser()

    const getDeskSectionToday = async () => {
        let section = []
        let userSession = user.token === undefined ? await getUser() : user
        setIsLoading(true)

		const response = await axios.get(`api/desk-section/office/1`, {
            headers: {
                'Authorization': `Bearer ${userSession.token}`
            }
        })
        .then(res => {
            section = res.data
            setIsLoading(false)
        })
        .catch(err => {
            setIsLoading(false)
        })

        return section
    }

    useEffect(() => {

        // if (user?.isLogin === undefined) getUser()

    }, [router, user])

    return {
        isLoading, getDeskSectionToday
    }
}