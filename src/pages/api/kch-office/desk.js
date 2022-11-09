import axios from 'configs/axios'
import { useRouter } from 'next/router'
import { useState , useEffect } from 'react'
import errorHandler from 'configs/errorHandler'

import useUser from './user'

export default function useDesk() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [deskSection, setDeskSection] = useState([])

    const { user, getUser } = useUser()

    const getDeskSectionByOffice = async (uid_office) => {
        let deskSection = []
        let userSession = user.token === undefined ? await getUser() : user
        setIsLoading(true)

		const response = await axios.get(`/api/desk-section/office/${uid_office}`, {
            headers: {
                'Authorization': `Bearer ${userSession.token}`
            }
        })
        .then(res => {
            deskSection = res.data
            setIsLoading(false)
        })
        .catch(err => {
            setIsLoading(false)
        })

        return deskSection
    }

    useEffect(() => {

        // if (user?.isLogin === undefined) getUser()

    }, [router, user])

    return {
        isLoading, getDeskSectionByOffice
    }
}