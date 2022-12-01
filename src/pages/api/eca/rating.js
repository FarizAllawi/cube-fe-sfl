import axios from 'configs/kch-office/axios'
import {useRouter} from 'next/router'
import { useState , useEffect} from 'react'

export default function useRating() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const getRatingData = async (nik) => {
        setIsLoading(true)
        let rating = []
        await axios.get(`api/ClaimRating/getAll?getNIK=${nik}`)
                   .then(res => {
                        setIsLoading(false)
                        return rating = res.data
                   })
                   .catch(err => {
                        return err.response
                   })

        return rating
    }

    const updateRating = async (id, feedBack, rating) => {
        setIsLoading(true)
        let status = false
        await axios.get(`api/ClaimRating/updateRating?setClaimid=${id}&feedback_desc=${feedBack}&rating_value=${rating}`)
                   .then(res => {
                        setIsLoading(false)
                        status = true
                   })
                   .catch(err => {
                        return err.response
                   })
        return status
    }

    useEffect(() => {
    }, [router])

    return {
        getRatingData,
        updateRating,
        isLoading
    }
}