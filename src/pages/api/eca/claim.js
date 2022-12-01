import axios from 'configs/eca/axios'
import {useRouter} from 'next/router'
import { useState , useEffect} from 'react'
import queryString from 'query-string'

import useUser from 'pages/api/eca/user'

export default function useClaim({middleware} = {}) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const { user } = useUser()

    /**
     * 
     * CLAIM MASTER
     * 
     */
    const getClaimMaster = async () => {
        setIsLoading(true)
        let claimMaster = []
        const response = await axios.get(`api/ClaimMaster/get`)
                                    .then(res => {
                                        setIsLoading(false)
                                        claimMaster = res.data
                                    })
                                    .catch(err => {
                                        setIsLoading(false)
                                        console.log(err)
                                    })
        return claimMaster
    }


    /**
     * 
     * CLAIM HEADER ENDPOINTS
     * 
     */
    const getClaimHeader = async(id) => {
        setIsLoading(true)
        let chData = []
        await axios.get(`api/ClaimHead/getByUID?getUid=${id}`).then(res => {
            setIsLoading(false)
            const response = res.data
            chData = response
        }).catch(err => {
            setIsLoading(false)
            console.log(err)
        })
        return chData
    }

    const getCHBundle = async(chid) => {
        setIsLoading(true)
        let chData = []
        await axios.get(`api/ClaimHead/getCHBundle?getChid=${chid}`).then(res => {
            setIsLoading(false)
            const response = res.data
            chData = response
        }).catch(err => {
            console.log(err)
        })
        return chData
    }

    const getDraftClaimHead = async (id) => {
        setIsLoading(true)
        let chId = ''
        await axios.get(`api/ClaimHead/getByUID?getUid=${id}`)
                   .then(res => {
                       res.data.map(item => {
                            if (item.status === 3) {
                                setIsLoading(false)
                                return chId = item.chid
                            }
                        })
                    })
                    .catch(err => {
                        setIsLoading(false)
                        console.log(err)
                    })
        
        return chId
    }

    const insertClaimHead = async ({setErrors, ...props}) => {
        setIsLoading(true)
        let chId = ''
        await axios.post(`api/ClaimHead/insert`, props)
                   .then(res => {
                        setIsLoading(false)
                        return chId = res.chid
                   })
                   .catch(err => {
                        setIsLoading(false)
                        return err.response
                   })
        return chId
    }

    const updateClaimHeader = async({setErrors, ...props}) => {
        setIsLoading(true)
        let status = false
        await axios.put(`api/ClaimHead/update`, props)
                   .then(res => {
                        setIsLoading(false)
                        status = true
                   })
                   .catch(err => {
                        setIsLoading(false)
                        return err.response
                   })
        return status
    }
    
    const deleteClaimHeader = async(chid) => {
        setIsLoading(true)
        await axios.put(`api/ClaimHead/delete?getChid=${chid}`)
                   .then(res => {
                        setIsLoading(false)
                   })
                   .catch(err => {
                        setIsLoading(false)
                        console.log(err)
                   })
    }

    /**
     * 
     * CLAIM OTHERS ENDPOINTS
     * 
     */
    const getClaimOtherMedia = async (coid) => {
        setIsLoading(true)

        const response = await axios.get(`api/COMedia/getByCoid?getCoid=${coid}`).then(res => {
            setIsLoading(false)
            return res.data
        }).catch(err => {
            console.log(err)
        })
               
        return response
    } 

    const getClaimOtherData = async (coid) => {
        setIsLoading(true)
        let codata = []

        await axios.get(`api/ClaimOthers/getByCOID?getCOID=${coid}`).then(res => {
            setIsLoading(false)
            codata = res.data[0]
        }).catch(err => {
            setIsLoading(false)
            console.log(err)
        })
               
        return codata
    }

    const insertClaimOther = async ({setErrors, ...props}) => {
        setIsLoading(true)
        let coId = ''
        await axios.post(`api/ClaimOthers/insert`, props)
                   .then(res => {
                        setIsLoading(false)
                        return coId = res.coid
                   })
                   .catch(err => {
                        setIsLoading(false)
                        return err.response
                   })

        return coId
    }
    
    const insertClaimOtherMedia = async({setErrors, ...props}) => {
        setIsLoading(true)
        await axios.post(`api/COMedia/insert`, props)
                   .then( res => { setIsLoading(false) })
                   .catch(err => {
                        setIsLoading(false)
                        console.log(err)
                   })
    }

    const updateClaimOtherMedia = async({setErrors, ...props}) => {
        setIsLoading(true)
        let status = false
        await axios.put(`api/COMedia/update`, props)
                   .then( res => {
                        setIsLoading(false) 
                        status = true
                   })
                   .catch(err => {
                        setIsLoading(false)
                   })
        return status
    }

    const updateClaimOther = async({setErrors, ...props}) => {
        setIsLoading(true)
        let coId = ''
        await axios.put(`api/ClaimOthers/update`, props)
                   .then(res => {
                        setIsLoading(false)
                        return coId = res.coid
                   })
                   .catch(err => {
                    setIsLoading(false)
                        return err.response
                   })

        return coId
    }

    const deleteClaimOther = async (id) => {
        setIsLoading(true)
        return await axios.put(`api/ClaimOthers/delete?getCoid=${id}`, {})
                   .then(res => {
                        setIsLoading(false)
                   })
                   .catch(err => {
                        setIsLoading(false)
                   })
    }

    const deleteClaimOtherMedia = async (id) => {
        setIsLoading(true)
        let status = false
        await axios.put(`api/COMedia/delete?getId=${id}`, {})
                   .then(res => {
                        setIsLoading(false)
                        status = true
                   })
                   .catch(err => {
                        setIsLoading(false)
                        return err.response
                   })
        return status
    }

    /**
     * 
     * CLAIM MILEAGE ENDPOINTS
     * 
     */
    const getClaimMileage = async (cmid) => {
        setIsLoading(true)
        let cmdData = []
        await axios.get(`api/ClaimMil/getByCMID?getCMID=${cmid}`).then(res => {
            setIsLoading(false)
            cmdData = res.data
        }).catch(err => {
            setIsLoading(false)
            console.log(err)
        })
        return cmdData
    }


    const insertClaimMileage = async ({setErrors, ...props}) => {
        setIsLoading(true)
        let cmId = ''
        await axios.post(`api/ClaimMil/insert`, props)
                   .then(res => {
                        setIsLoading(false)
                        return cmId = res.cmid
                   })
                   .catch(err => {
                        setIsLoading(false)
                        return err.response
                   })

        return cmId
    }

    const updateClaimMileage = async({setErrors, ...props}) => {
        setIsLoading(true)
        let status = false
        await axios.put(`api/ClaimMil/update`, props)
                   .then(res => {
                        setIsLoading(false)
                        status = true
                   })
                   .catch(err => {
                        setIsLoading(false)
                   })

        return status
    }

    const endTripClaimMileage = async({setErrors, ...props}) => {
        setIsLoading(true)
        let cmId = ''
        await axios.put(`api/ClaimMil/updateEndtrip`, props)
                   .then(res => {
                        setIsLoading(false)
                        return cmId = res.cmid
                   })
                   .catch(err => {
                        setIsLoading(false)
                        return err.response.status
                   })

        return cmId
    }

    const deleteClaimMileage = async(id) => {
        setIsLoading(true)
        return await axios.put(`api/ClaimMil/delete?getCmid=${id}`, {})
                   .then(res => {
                        setIsLoading(false)
                   })
                   .catch(err => {
                        setIsLoading(false)
                        return err.response
                   })
    }


   


    useEffect(() => {
        // const { auth } = queryString.parseUrl(router.asPath).query

        // if ((authCookie !== undefined) && (users === undefined || users === null)) getUser()

        // if (middleware === 'admin' && users?.user_role !== 'admin') window.location.href = '/401'
        // if (middleware === 'mentor' && users?.user_role !== 'mentor') window.location.href = '/401'
        // if (middleware === 'user' && users?.user_role !== 'user') window.location.href = '/401'


    }, [router])

    return {
        // getClaimMileageMedia,
        // getClaimMileageDetail,
        getClaimMileage,
        getCHBundle,
        getClaimMaster,
        endTripClaimMileage,
        getClaimOtherMedia,
        getClaimOtherData, 
        getClaimHeader,
        getDraftClaimHead,
        insertClaimHead ,
        insertClaimOther,
        insertClaimOtherMedia,
        updateClaimOtherMedia,
        insertClaimMileage,
        updateClaimOther,
        updateClaimHeader,
        updateClaimMileage,
        deleteClaimOther,
        deleteClaimOtherMedia,
        deleteClaimMileage,
        deleteClaimHeader,
        isLoading
    }
}