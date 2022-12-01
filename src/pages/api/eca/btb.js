import axios from 'configs/eca/axios'
import {useRouter} from 'next/router'
import { useState , useEffect} from 'react'

export default function useBtb() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

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
     * BTB Endpoint 
     * 
     */
    const getBTBHeadDetail = async (bhid) => {
        setIsLoading(true)
        let bhdata = []
        await axios.get(`api/BTBHead/getByBhid?getBhid=${bhid}`)
                   .then(res => {
                        setIsLoading(false)
                        bhdata = res.data
                    }).catch(err => {
                        setIsLoading(false)
                        console.log(err)
                    })
        return bhdata
    }


    const getBTBHeader = async (id) => {
        setIsLoading(true)
        let bhdata = []
        await axios.get(`api/BTBHead/getByUID?getUid=${id}`)
                   .then(res => {
                        setIsLoading(false)
                        bhdata = res.data
                    }).catch(err => {
                        setIsLoading(false)
                        console.log(err)
                    })
        return bhdata
    }

    const getDraftBTBHead = async (id) => {
        setIsLoading(true)
        let bhId = ''
        await axios.get(`api/BTBHead/getByUID?getUid=${id}`)
                   .then(res => {
                        res.data.map(item => {
                            if (item.status === 3) {
                                setIsLoading(false)
                                return bhId = item.bhid
                            }
                        })
                    })
                    .catch(err => {
                        console.log(err)
                    })
        
        return bhId
    }

    const updateBTBHead = async ({setErrors, ...props}) => {
        setIsLoading(true)
        let bhid = ''
        await axios.put(`api/BTBHead/update`, props)
                   .then(res => {
                        setIsLoading(false)
                        return bhid = res.bhid
                   })
                   .catch(err => {
                        setIsLoading(false)
                        return err.response
                   })

        return bhid
    }
    const getBTBChildData = async (bcid) => {
        setIsLoading(true)
        let bcData = {}
        await axios.get(`api/BTBChild/getByBc?getBcid=${bcid}`)
                   .then(res => { 
                        setIsLoading(false)
                        bcData = res.data[0]
                    })
                    .catch(err => { console.log(err) })
        
        return bcData
    }

    const getBTBChildByHeader =  async ( bhid ) => {
        setIsLoading(true)
        let childData = []
        await axios.get(`api/BTBChild/getByBh?getBhid=${bhid}`)
                    .then(res => {
                        setIsLoading(false)
                        childData = res.data
                    })
                    .catch(err => {
                        setIsLoading(false)
                        console.log(err)
                    })
            
        return childData
    }


    const insertBTBHead = async ({setErrors, ...props}) => {
        setIsLoading(true)
        let btbId = ''
        await axios.post(`api/BTBHead/insert`, props)
                   .then(res => {
                        setIsLoading(false)
                        return btbId = res.bhid
                   })
                   .catch(err => {
                        setIsLoading(false)
                        return err.response
                   })
        return btbId
    }

    const insertBTBChild = async ({setErrors, ...props}) => {
        setIsLoading(true)
        let bcid = ''
        await axios.post(`api/BTBChild/insert`, props)
                   .then(res => {
                        setIsLoading(false)
                        return bcid = res.bcid
                   })
                   .catch(err => {
                        setIsLoading(false)
                        return err.response
                   })

        return bcid
    }

    const updateBTBChild = async ({setErrors, ...props}) => {
        setIsLoading(true)
        let status = false
        await axios.put(`api/BTBChild/update`, props)
                   .then(res => {
                        setIsLoading(false)
                        status = true
                   })
                   .catch(err => {
                        setIsLoading(false)
                        status = false
                        return err.response
                   })

        return status
    }

    const deleteBTBChild = async (id) => {
        setIsLoading(true)
        return await axios.put(`api/BTBChild/delete?getBcid=${id}`, {})
                   .then(res => {
                        setIsLoading(false)
                   })
                   .catch(err => {
                        setIsLoading(false)
                        return err.response
                   })
    }

    const deleteBTBHeader = async (bcid) => {
        setIsLoading(true)
        return await axios.put(`/api/BTBHead/delete?getBhid=${bcid}`, {})
                   .then(res => {
                        setIsLoading(false)
                   })
                   .catch(err => {
                        setIsLoading(false)
                        return err.response
                   })
    }

    const updateBTBHeader = async ({setErrors, ...props}) => {
        setIsLoading(true)
        let bhid = ''
        await axios.put(`api/BTBHead/update`, props)
                   .then(res => {
                        setIsLoading(false)
                        bhid = res.bhid
                   })
                   .catch(err => {
                        setIsLoading(false)
                        return err.response
                   })

        return bhid
    }


    useEffect(() => {
    }, [router])

    return {
        getBTBHeadDetail,
        getClaimMaster,
        getBTBChildByHeader,
        getBTBChildData,
        getDraftBTBHead ,
        getBTBHeader ,
        insertBTBHead,
        insertBTBChild,
        updateBTBChild,
        updateBTBHeader,
        deleteBTBChild,
        deleteBTBHeader,
        isLoading
    }
}