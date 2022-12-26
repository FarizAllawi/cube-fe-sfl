import axios from 'configs/eca/axios'
import useSWR from 'swr'
import {useRouter} from 'next/router'
import { useCallback, useState , useEffect} from 'react'
import queryString from 'query-string'

import useUser from '../user'

export default function useNotification() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [notifications, setNotification] = useState([])
    const [fetchStatus, setFetchStatus] = useState(false)
    
    const { user } = useUser()
    
    const { notification } = useSWR(
        user?.nik !== undefined ? 
            `/api/Notification/getByNik?getNik=${user.nik}`
        : null,

         async (url) => {
            await axios.get(url).then(res => {
                let fetchNotification = res?.data
                setNotification(fetchNotification)
            })
            .catch(err => {
            })
            // return response
        },
        {revalidateOnFocus: true, revalidateIfStale: false, refreshWhenHidden: false, refreshWhenOffline: false, refreshInterval: 15000}
    )


    // For backup fetcth notification when SWR not working on rendering page
    const getNotification = useCallback( async () => {
        setIsLoading(true)
        await axios.get(`/api/Notification/getByNik?getNik=${user.nik}`).then(res => {
            let fetchNotification = res?.data
            setNotification(fetchNotification)
        }).catch(err => {
            
        })
        setIsLoading(false)
        setFetchStatus(true)
    },[user.nik])

    const insertNotification = async ({setErrors, ...props}) => {
        setIsLoading(true)
        await axios.post('api/Notification/insert', props)
                   .then(res => {
                        setIsLoading(false)
                   })
                   .catch( err => {
                        setIsLoading(false)
                   })
    }
    
    const updateNotification = async ({setErrors, ...props}) => {
        setIsLoading(true)
        await axios.put('api/Notification/update', props)
                   .then(res => {
                        setIsLoading(false)
                   })
                   .catch( err => {
                        setIsLoading(false)
                   })
    }

    const sendEmail = async ({setErrors, ...props}) => {
        console.log("Email");
        console.log(props)
        await fetch('/api/eca/email', {
            method: "POST",
            headers: {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
                'Accept': 'application/json, text/plain, /',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                email: props.email,
                header: props.header,
                description: props.description
             })
        });
    }

    const getHomeNotification = async (nik) => {
        setIsLoading(true)
        let data = []
        await axios.get(`/api/HomeNotification/GetApprovalNotificationHome?getNik=${nik}`)
                   .then(res => {
                        setIsLoading(false)
                        data = res.data
                   })
                   .catch( err => {
                        setIsLoading(false)
                   })

        return data
    }

    const getApprovalNotification = async (nik) => {
        setIsLoading(true)
        let data = []
        await axios.get(`/api/HomeNotification/GetApprovalNotification?getNik=${nik}`)
                   .then(res => {
                        setIsLoading(false)
                        data = res.data
                   })
                   .catch( err => {
                        setIsLoading(false)
                   })

        return data
    }

    useEffect(() => {
        if(user?.nik !== undefined && notifications?.length === 0 && !fetchStatus) getNotification()
    
    }, [fetchStatus, getNotification, notifications, user?.nik])

    return {
        notifications,
        updateNotification,
        insertNotification,
        getNotification,
        getHomeNotification,
        getApprovalNotification,
        sendEmail,
        isLoading
    }
}