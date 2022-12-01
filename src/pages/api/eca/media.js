import axios from 'configs/kch-office/axios'
import {useRouter} from 'next/router'
import { useState , useEffect} from 'react'
import queryString from 'query-string'

export default function useMedia({middleware} = {}) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const {users} = useSelector(state => state)

    

    useEffect(() => {
    }, [router])

    return {
    }
}