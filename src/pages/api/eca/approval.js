import axios from 'configs/eca/axios'
import { useRouter } from 'next/router'
import { useState , useEffect} from 'react'

export default function useApproval() {
    const [isLoading, setIsLoading] = useState(false)

    const getPaymentApproval = async (nik) => {
        setIsLoading(true)
        let paymentApproval = []
        const response = await axios.get(`api/PaymentApprovalHead/GetApprovalPayment?getNIK=${nik}`).then(res => {
            const response = res.data
            paymentApproval = response
        }).catch(err => {
        })
        return paymentApproval
    }

    const getHRDApproval = async (nik) => {
        setIsLoading(true)
        let hrdApproval = []
        const response = await axios.get(`api/ClaimHeadSuperior/getByNikHRD?getNIK=${nik}`).then(res => {
            const response = res.data
            hrdApproval = response
        }).catch(err => {
        })
        return hrdApproval
    }
    
    const getClaimApproval = async (nik) => {
        setIsLoading(true)
        let claimApproval = []
        const response = await axios.get(`api/ClaimHeadSuperior/getByNIK?getNIK=${nik}`).then(res => {
            const response = res.data
            claimApproval = response
        }).catch(err => {
        })
        return claimApproval
    }

    const getBtbApproval = async (nik) => {
        setIsLoading(true)
        let btbApproval = []
        const response = await axios.get(`api/BTBHeadSuperior/getByNIK?getNIK=${nik}`).then(res => {
            const response = res.data
            btbApproval = response
        }).catch(err => {
        })
        return btbApproval
    }

    const approveMileageSuperior = async ({setErrors, ...props}) => {
        setIsLoading(true) 
        let status = false
        await axios.put(`api/ClaimMil/approval/superior`, props)
                   .then( res => { status = true })
                   .catch ( err => {})
        return status
    }

    const approveAllMileageSuperior = async ({setErrors, ...props}) => {
        setIsLoading(true) 
        let status = false
        await axios.put(`api/ClaimMil/approval/superior/all`, props)
                   .then( res => { status = true })
                   .catch ( err => {})
        return status
    }

    const approveOthersSuperior = async ({setErrors, ...props}) => {
        setIsLoading(true) 
        let status = false
        await axios.put(`api/ClaimOthers/approval/superior`, props)
                   .then( res => { status = true })
                   .catch ( err => {})
        return status
    }

    const approveAllOthersSuperior = async ({setErrors, ...props}) => {
        setIsLoading(true) 
        let status = false
        await axios.put(`api/ClaimOthers/approval/superior/all`, props)
                   .then( res => { status = true })
                   .catch ( err => {})
        return status
    }

    const approveAllBtbSuperior = async ({ setErrors, ...props }) => {
        setIsLoading(true) 
        let status = false
        await axios.put(`/api/BTBChild/approval/superior/all`, props)
                   .then( res => { status = true })
                   .catch ( err => {})
        return status
    }

    const approveMileageHRD = async ({setErrors, ...props}) => {
        setIsLoading(true) 
        let status = false
        await axios.put(`api/ClaimMil/approval/hrd/all`, props)
                   .then( res => { status = true })
                   .catch( err => {})
        return status
    }

    const rejectMileageHRD = async ({setErrors, ...props}) => {
        setIsLoading(true) 
        let status = false
        await axios.put(`api/ClaimMil/approval/hrd`, props)
                   .then( res => { status = true })
                   .catch(err => {})
        return status
    }

    const approvePayment = async(pdid) => {
        setIsLoading(true) 
        let status = false
        await axios.put(`api/PaymentApproval/updatepauser?pdid=${pdid}`)
                   .then( res => { status = true })
                   .catch ( err => {})
        return status
    }

    const rejectPayment = async({setErrors, ...props}) => {
        let status = false
        await axios.put(`api/PaymentApproval/rejectpauser?pdid=${props.pdid}&rejectDesc=${props.desc}`)
                   .then( res => { status = true })
                   .catch( err => { setErrors(err.response.data) })
        
        return status
    }

    const pendingPayment = async({setErrors, ...props}) => {
        let status = false
        await axios.put(`api/PaymentApproval/pendingpa?pdid=${props.pdid}&rejectDesc=${props.desc}`)
                   .then( res => { status = true })
                   .catch( err => { setErrors(err.response.data) })
        
        return status
    }


    useEffect(() => {
        // Check Authentication
    }, [])

    return {
        isLoading, 
        getPaymentApproval,
        getHRDApproval,
        getClaimApproval,
        getBtbApproval,
        approveOthersSuperior,
        approveMileageSuperior,
        approveAllMileageSuperior,
        approveAllOthersSuperior,
        approveAllBtbSuperior,
        approveMileageHRD,
        approvePayment,
        rejectMileageHRD,
        rejectPayment,
        pendingPayment
    }
}