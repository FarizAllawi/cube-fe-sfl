import axios from 'configs/kch-office/axios'
import useSWR from 'swr'
import { format } from 'date-fns'
import { useRouter } from 'next/router'
import { useState , useEffect } from 'react'
import errorHandler from 'configs/errorHandler'

import useUser from '../user'

export default function useBooking() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [selectedDeskSection, setSelectedDeskSection] = useState({})
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [desk, setDesk] = useState({})
    const { user, getUser } = useUser()

    
    // const { getDesk , error } = useSWR([`/api/booking/desk-section/${selectedDeskSection.uid_ds}${selectedDate !== '' ? '?date='+format(selectedDate, 'yyyy-MM-dd') : ''}`, user.token] , 
        
    //     selectedDeskSection.uid_ds !== undefined ? (
    //         async (url, token) => {
    //             await axios.get(url, {
    //                 headers: {
    //                     'Authorization': `Bearer ${token}`
    //                 }
    //             }).then(res => {
    //                 setDesk(getDataRow(2, res.data))
    //             })
    //             // return response
    //         }
    //     ) : null,

    //     { revalidateOnFocus: false, refreshWhenHidden: false, refreshWhenOffline: false, refreshInterval: 0 }
    // )

    

    const getDeskSectionById = async (uid_ds, date = null) => {
        let userSession = user.token === undefined ? await getUser() : user

        setIsLoading(true)
        const response = await axios.get(`/api/desk-section/${uid_ds}${date !== null && date !== undefined ? '?date='+date : ''}`, {
            headers: {
                'Authorization': `Bearer ${userSession.token}`
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

    }, [desk, selectedDeskSection, setSelectedDeskSection, selectedDate])

    return {
        isLoading, 
        desk,
        getDeskSectionById,
        selectedDeskSection,
        selectedDate,
        setSelectedDeskSection,
        setSelectedDate
    }
}