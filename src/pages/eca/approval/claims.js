import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import axios from 'configs/eca/axios'
import Link from 'next/link'

import capitalizeEachWord from 'helpers/capitalizeEachWord'
import useForm from 'helpers/useForm'
import slugify from 'helpers/slugify'

import useApproval from 'pages/api/eca/approval'
import useUser from 'pages/api/eca/user'    
import useClaim from 'pages/api/eca/claim'
import useNotification from 'pages/api/eca/notification'

import CardClaims from 'components/eca/Card/Claim'
import Dropdown from 'components/eca/Dropdown'
import LayoutList from 'components/eca/Layout/List'
import Filter from 'components/eca/Filter'
import ShowDocument from 'components/eca/Document/Show'
import Modals from 'components/eca/Modals'
import Textarea from 'components/eca/Forms/Textarea'
import Button from 'components/eca/Button'
import GridColumn from 'components/eca/Grid/Column'

import errorHandler from 'configs/errorHandler'

export default function Claims(props) {
    const router = useRouter()
    const [filter, setFilter] = useState(false)
    const [user, setUser] = useState({})

    const { getDetailUser, getUserByNik } = useUser()

    const {updateClaimMileage, updateClaimOther} = useClaim()
    const {
        getClaimApproval,
        approveAllMileageSuperior,
        approveAllOthersSuperior,
        approveMileageSuperior,
        approveOthersSuperior
    } = useApproval()
    const { insertNotification, sendEmail } = useNotification()

    const [isLoading, setIsLoading] = useState(false)
    
    const [state, setState, newState] = useForm({
        buttonFilter: [
            {name: 'Paid', color: 'green'},
            {name: 'On Progress', color: 'yellow'},
            {name: 'Rejected', color: 'red'},
        ],
        claimsApprovalData: [],
        claimRequestorData: {},
        documentClicked: [],
        aproveAll: '',
        rejectAll: '',
        approveReason: '',
        deleteParticularClaim: '',
        reason: '',
    })

    const buttonFilterOnClick = (type) => {
        let temp = []
        claimsData.map((item) => { 
            if (item.status === type) {
                temp.push(item)
            }
        })
        newState({claimsDataTemp: temp})
    }

    const searchFilterOnChange = (search) => {
        let filteredClaim = []
        // Find claim by claim header
        claimsData.map((data) => {
            let dataExists = false

            // Slugify claim header
            let claim = slugify(data.title)
            let searchKey = slugify(search)
            
            if (claim.includes(searchKey) && !dataExists) {
                filteredClaim.push(data)
                dataExists = true
            }
        })
        
        newState({
            claimsDataTemp: filteredClaim
        })
    }

    const dateRangeFilterOnChange = (date) => {
        let filteredClaim = []
        let dateRange = date.dateRange
        claimsData.map((data) => {
            let dataExists = false
            data.data.claims.map((item) => {
                let claimsDate = new Date(item.date.toLowerCase()).getTime()
                if (dateRange.firstDate <= claimsDate && claimsDate <= dateRange.lastDate && !dataExists) {
                    dataExists = true
                }
            })
            if (dataExists) filteredClaim.push(data)
        })
        newState({
            claimsDataTemp: filteredClaim
        })
    }

    const fetchData = useCallback( async () => {
        let userData = await getDetailUser()
        newState({ 
            rejectAll: '',
            approveAll: '',
            reason: '',
            deleteParticularClaim: '',
            claimsApprovalData: [{},{},{},{}],
            claimRequestorData: {},
            fetchStatus: true
        })

        setIsLoading(true)

        if (userData.id !== undefined) {
            setUser(userData)

            setTimeout(async () => {
                const data = await getClaimApproval(userData.nik)
                newState({ 
                    rejectAll: '',
                    approveAll: '',
                    reason: '',
                    deleteParticularClaim: '',
                    claimsApprovalData: data,
                    claimRequestorData: {},
                    fetchStatus: true
                })
                setIsLoading(false)
            }, 1000);
        }
        else { 
            setTimeout(async () => {
                newState({ 
                    rejectAll: '',
                    approveAll: '',
                    reason: '',
                    deleteParticularClaim: '',
                    claimsApprovalData: [],
                    claimRequestorData: {},
                    fetchStatus: true
                })
                setIsLoading(false)
            }, 1000);
            errorHandler("There is an error when retrieving user data")
        }

    }, [getClaimApproval, getDetailUser, newState])

    const getAmount = (mileage, others, type) => {
        let total = 0
        mileage?.map((item) => {
            if (type === 'amount') total += item.amount
            if (item.status_approval === 1 && type === 'paid') total += item.amount
            if (item.status_approval === 4 && type === 'rejected') total += item.amount
        })
        others?.map((item) => {
            if (type === 'amount') total += item.amount
            if (item.status_approval === 1 && type === 'paid') total += item.amount
            if (item.status_approval === 4 && type === 'rejected') total += item.amount
        })
        return total
    }

    const getClaimRequestorData = async (chid) => {
        setTimeout(async () => {
            const response = await axios.get(`api/ClaimHead/getCHBundle?getChid=${chid}`)
                                        .then(res => {
                                            let claimRequestorData = state.claimRequestorData
                                            claimRequestorData[chid] = res.data
                                            newState({ claimRequestorData: claimRequestorData })
                                        })
                                        .catch(err => {
                                                console.log(err)
                                        })
        }, 500)
    }

    const approveClaimHeader = async () => {
        let currentDate = new Date()
        let requestor = {}
        let status = false
        let mileage = false
        let other = false

        state.claimsApprovalData.map(item => {
            if (item.chid === state.approveAll) requestor = item
        })

        let detailUser = await getUserByNik(requestor.nik)

        if (state.claimRequestorData[state.approveAll]?.item2?.length !== 0) mileage = true
        if (state.claimRequestorData[state.approveAll]?.item3?.length !== 0) other = true

        if (mileage) {
            await approveAllMileageSuperior({
                chid: state.approveAll,
                status_approval:2,
                superior_approval: 1,
                reject_desc:''
                // superior_dt: convertDateTime(currentDate)
            })
        }

        if (other) {
            await approveAllOthersSuperior({
                chid: state.approveAll,
                superior_approval:1,
                status_approval:1,
                reject_desc:''
                // superior_dt: convertDateTime(currentDate)
            })
        }
        
        status = await insertNotification({
            nik: requestor.nik,
            header: `claims-Claim Approved-${state.approveAll}`,
            description: `Your Claim ${requestor.chid} approved by your superior ${capitalizeEachWord(user.name)}`
        })

        await sendEmail({
            email: detailUser.email,
            header: `Claim Approved`,
            description: `Your Claim ${requestor.chid} approved by your superior ${capitalizeEachWord(user.name)}`
        })
        
        newState({aproveAll: ''})
        fetchData()
        toast.success("Approve Claim Succesfuly ")
    }

    const rejectParticularClaim = async() => {
        let currentDate = new Date()
        let claimHead = state.deleteParticularClaim.split('-')[0]
        let claimId = state.deleteParticularClaim.split('-')[1]
        let requestor = {}

        state.claimsApprovalData.map(item => {
            if (item.chid === claimHead) requestor = item
        })

        let detailUser = await getUserByNik(requestor.nik)
        
        if (state.reason !== "") {

            if (`${claimId[0]}${claimId[1]}` === 'CM') {

                // try {
                    await approveMileageSuperior({
                        cmid: claimId,
                        chid: claimHead,
                        reject_desc: state.reason,
                        status_approval: 5,
                        superior_approval:4
                    })
    
                    await insertNotification({
                        nik: requestor.nik,
                        header: `claims-Claim Rejected-${claimHead}`,
                        description: `Claim Mileage ${claimId} rejected by your superior ${capitalizeEachWord(user.name)}`
                    })

                    await sendEmail({
                        email: detailUser.email,
                        header: `Claim Rejected`,
                        description: `Claim Mileage ${claimId} rejected by your superior ${capitalizeEachWord(user.name)}`
                    })
                    

                    
                    newState({deleteParticularClaim: ''})
                    toast.success("Reject Claim Succesfuly ")
                    fetchData()
                // }
                // catch(err) {
                //     errorHandler("An error occured while rejecting claim")
                // }
                
                // state.claimRequestorData[claimHead]?.item2.map( async (item) => {
                //     if (item.cmid === claimId) {
                //     }
                // })
            }
    
            if (`${claimId[0]}${claimId[1]}` === 'CO') {
                // try {
                    await approveOthersSuperior({
                        coid: claimId,
                        chid: claimHead,
                        reject_desc: state.reason,
                        status_approval: 4,
                        superior_approval:4
                    })
    
                    await insertNotification({
                        nik: requestor.nik,
                        header: `claims-Claim Rejected-${claimHead}`,
                        description: `Claim Other ${claimId} rejected by your superior ${capitalizeEachWord(user.name)}`
                    })

                    // await sendEmail({
                    //     email: detailUser.email,
                    //     header: `Claim Rejected`,
                    //     description: `Claim Other ${claimId} rejected by your superior ${capitalizeEachWord(user.name)}`
                    // })
                    
                    newState({deleteParticularClaim: ''})

                    toast.success("Reject Claim Succesfuly ")
                    fetchData()
                // }
                // catch(err) {
                //     errorHandler("An error occured while rejecting claim")
                // }

                // state.claimRequestorData[claimHead]?.item3.map(async (item) => {
                //     if (item.coid === claimId) {
                //     }
                // })
            }
        }
        else {
            errorHandler("Please insert your reason...")
        }
    }

    const rejectAllClaim = async() => {

        let claimHead = state.rejectAll
        let requestor = {}
        let status = false
        let mileage = false
        let other = false

        
        state.claimsApprovalData.map(item => {
            if (item.chid === claimHead) requestor = item
        })

        let detailUser = await getUserByNik(requestor.nik)

        if (state.claimRequestorData[claimHead]?.item2?.length !== 0) mileage = true
        if (state.claimRequestorData[claimHead]?.item3?.length !== 0) other = true

        if (state.reason !== '') {
            if (mileage) {
                await approveAllMileageSuperior({
                    chid: claimHead,
                    status_approval:5,
                    superior_approval: 4,
                    reject_desc:''
                    // superior_dt: convertDateTime(currentDate)
                })
            }

            if (other) {
                await approveAllOthersSuperior({
                    chid: claimHead,
                    superior_approval:4,
                    status_approval:4,
                    reject_desc:''
                    // superior_dt: convertDateTime(currentDate)
                })
            }
            
            await insertNotification({
                nik: requestor.nik,
                header: `claims-Claim Rejected-${claimHead}`,
                description: `Claim ${claimHead} rejected by your superior ${capitalizeEachWord(user.name)}`
            })

            if (detailUser.email !== undefined) {
                await sendEmail({
                    email: detailUser.email,
                    header: `Claim Rejected`,
                    description: `Claim Header ${claimHead} rejected by your superior ${capitalizeEachWord(user.name)}`
                })
            }
            
            newState({rejectAll: ''})
            toast.success("Reject Claim Succesfuly ")
            fetchData()
        }
        else {
            errorHandler("Please insert your reason...")
        }
    }

    useEffect(() => {
        if (state.claimsApprovalData.length === 0 && !state.fetchStatus) fetchData()

    },[fetchData, state.claimsApprovalData.length, state.fetchStatus])
    
    // console.log(state.claimRequestorData)

    return (
        <LayoutList title="List of Claim Approval" 
                    refresh={true} onRefresh={fetchData} 
                    defaultBackPage='/eca/approval'>

            <div className="w-full px-4 mt-20 select-none flex flex-row place-content-center items-center">
                 <p className="w-full font-semibold text-lg">Claim Transactions Need Your Approval</p>
                {/* <p className="w-1/2 font-semibold text-lg">Claims Need Your Approval</p> */}
                {/* <div className="w-1/2 h-auto flex place-content-end items-center">
                    <Button type="primary" 
                            size="small" 
                            className="py-2 bg-white dark:bg-gray-700 hover:drop-shadow-sm drop-shadow-md" 
                            onClick={() => setFilter(!filter)}
                            appendIcon={filter ? (
                                <svg className="fill-black dark:fill-white" width="20" height="16" viewBox="0 0 24 16"xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 3.33334C11.5584 3.34024 11.12 3.4104 10.6983 3.54167C10.8934 3.88472 10.9973 4.27205 11 4.66668C11 4.97309 10.9396 5.27651 10.8224 5.55961C10.7051 5.8427 10.5332 6.09992 10.3166 6.31659C10.0999 6.53326 9.84268 6.70514 9.55959 6.8224C9.2765 6.93966 8.97308 7.00001 8.66666 7.00001C8.27204 6.99728 7.88471 6.89341 7.54166 6.69835C7.271 7.63701 7.30255 8.63704 7.63182 9.55678C7.9611 10.4765 8.57141 11.2694 9.37631 11.823C10.1812 12.3766 11.1399 12.6629 12.1166 12.6414C13.0932 12.6199 14.0384 12.2916 14.8181 11.7031C15.5979 11.1145 16.1727 10.2956 16.4611 9.36226C16.7496 8.42891 16.737 7.42846 16.4253 6.50262C16.1136 5.57679 15.5184 4.7725 14.7242 4.2037C13.93 3.63489 12.9769 3.33039 12 3.33334V3.33334ZM23.855 7.39168C21.5954 2.98292 17.1221 0 12 0C6.87791 0 2.40332 2.98501 0.144977 7.3921C0.0496614 7.58064 0 7.78895 0 8.00022C0 8.21149 0.0496614 8.4198 0.144977 8.60835C2.40457 13.0171 6.87791 16 12 16C17.1221 16 21.5967 13.015 23.855 8.60793C23.9503 8.41939 24 8.21108 24 7.99981C24 7.78854 23.9503 7.58023 23.855 7.39168V7.39168ZM12 14C7.88958 14 4.12124 11.7084 2.08623 8.00002C4.12124 4.29167 7.88916 2 12 2C16.1108 2 19.8788 4.29167 21.9138 8.00002C19.8792 11.7084 16.1108 14 12 14Z"/>
                                </svg>

                            ) : (
                                <svg className="fill-black dark:fill-white" width="20" height="16" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M23.7746 17.662L1.35033 0.131621C1.28882 0.082377 1.21822 0.0457295 1.14255 0.0237711C1.06688 0.00181269 0.987625 -0.00502655 0.909313 0.00364386C0.831 0.0123143 0.755163 0.0363245 0.68613 0.0743037C0.617097 0.112283 0.55622 0.163487 0.506976 0.224993L0.131987 0.693354C0.0826277 0.754881 0.0458847 0.825538 0.0238609 0.90128C0.00183712 0.977023 -0.00503511 1.05636 0.00363744 1.13477C0.01231 1.21317 0.0363571 1.28909 0.0744027 1.35819C0.112448 1.42728 0.163746 1.4882 0.22536 1.53745L22.6497 19.0678C22.7112 19.117 22.7818 19.1537 22.8575 19.1756C22.9331 19.1976 23.0124 19.2044 23.0907 19.1958C23.169 19.1871 23.2448 19.1631 23.3139 19.1251C23.3829 19.0871 23.4438 19.0359 23.493 18.9744L23.868 18.5061C23.9174 18.4445 23.9541 18.3739 23.9761 18.2981C23.9982 18.2224 24.005 18.143 23.9964 18.0646C23.9877 17.9862 23.9636 17.9103 23.9256 17.8412C23.8876 17.7721 23.8363 17.7112 23.7746 17.662V17.662ZM11.1297 5.49246L16.1841 9.44409C16.1009 7.19641 14.2679 5.39983 12 5.39983C11.7075 5.40038 11.4158 5.43142 11.1297 5.49246ZM12.8703 13.7073L7.81588 9.7557C7.8995 12.003 9.73244 13.7996 12 13.7996C12.2925 13.799 12.5842 13.768 12.8703 13.7073V13.7073ZM12 4.19987C15.6993 4.19987 19.0907 6.26231 20.9221 9.59971C20.4732 10.4211 19.9184 11.18 19.2722 11.8571L20.6874 12.9634C21.4753 12.1205 22.1428 11.1726 22.671 10.1468C22.7568 9.97713 22.8015 9.78966 22.8015 9.59952C22.8015 9.40938 22.7568 9.22191 22.671 9.05222C20.6356 5.08447 16.6097 2.39993 12 2.39993C10.6238 2.39993 9.31096 2.66242 8.07649 3.10528L9.81682 4.46611C10.527 4.30487 11.2545 4.19987 12 4.19987ZM12 14.9995C8.30074 14.9995 4.90972 12.9371 3.0779 9.59971C3.52743 8.77835 4.08277 8.01952 4.72972 7.34265L3.31452 6.23643C2.52672 7.07921 1.85929 8.02692 1.3312 9.0526C1.24542 9.22228 1.20073 9.40976 1.20073 9.59989C1.20073 9.79003 1.24542 9.9775 1.3312 10.1472C3.36476 14.1149 7.39064 16.7995 12 16.7995C13.3762 16.7995 14.689 16.5351 15.9235 16.0941L14.1832 14.7337C13.473 14.8945 12.7459 14.9995 12 14.9995Z"/>
                                </svg>

                            )}>
                        Filter
                    </Button>
                </div> */}
            </div> 
            {/* {
                filter && (
                    <div className="w-screen h-auto z-40">
                        <Filter button={state.buttonFilter} 
                                buttonOnClick={type => buttonFilterOnClick(type)} 
                                search={true} searchOnChange={search => searchFilterOnChange(search)} 
                                dateRange={true} 
                                date={state.filterDate}
                                isLoading={isLoading}
                                dateRangeOnChange={date => dateRangeFilterOnChange(date)}/>
                    </div>
                )
            }
             */}

            {
                state.claimsApprovalData.length > 0 ? (
                    <GridColumn>
                    {
                        state.claimsApprovalData.map((item, index) => {
                            return (
                                <Dropdown key={index} 
                                        title={`${item.chid} `} 
                                        name={`Claim-${item.title}`}
                                        caption={`${capitalizeEachWord(item.name)}`}
                                        isLoading={isLoading}
                                        onClick={clicked => {

                                            if (!state.claimRequestorData.hasOwnProperty(item.chid)) {
                                                getClaimRequestorData(item.chid)
                                            }
                                            
                                        }}>
                                    { 
                                        !isLoading && (
                                            <>
                                                {
                                                    state.claimRequestorData.hasOwnProperty(item.chid) ? (
                                                        <>
                                                            <div className="w-full px-4 flex flex-col gap-2">
                                                                <div className="w-full py-4 px-5 flex flex-col gap-2 bg-blue-400 rounded-3xl mb-4">
                                                                    <div className="w-full flex flex-row gap-1">
                                                                        <div className="w-4/12 md:w-1/3 xl:w-5/12 text-white text-xs font-medium">Requestor</div>
                                                                        <div className="w-8/12 md:w-2/3 xl:w-7/12 text-white text-xs font-normal">: {capitalizeEachWord(item.name)}</div>
                                                                    </div>
                                                                    <div className="w-full flex flex-row gap-1">
                                                                        <div className="w-4/12 md:w-1/3 xl:w-5/12 text-white text-xs font-medium">Total Amount</div>
                                                                        <div className="w-8/12 md:w-2/3 xl:w-7/12 text-white text-xs font-normal">
                                                                            : IDR {new Intl.NumberFormat('de-DE').format(getAmount(state.claimRequestorData[item.chid]?.item2, state.claimRequestorData[item.chid]?.item3, 'amount'))}
                                                                        </div>
                                                                    </div>
                                                                    {/* <div className="w-full flex flex-row gap-1">
                                                                        <div className="w-4/12 md:w-1/3 xl:w-5/12 text-white text-xs font-medium">Total Reject</div>
                                                                        <div className="w-8/12 md:w-2/3 xl:w-7/12 text-white text-xs font-normal">
                                                                        : IDR {new Intl.NumberFormat('de-DE').format(getAmount(state.claimRequestorData[item.chid]?.item2, state.claimRequestorData[item.chid]?.item3, 'rejected'))}
                                                                        </div>
                                                                    </div> */}
                                                                </div>
                                                                {
                                                                    state.claimRequestorData[item.chid]?.item2?.length !== 0 &&  (
                                                                        <>
                                                                        {
                                                                            state.claimRequestorData[item.chid]?.item2.map((item, index) => {
                                                                                if (item.status_approval === 3) {
                                                                                    return (
                                                                                        <CardClaims key={index} 
                                                                                                    data={item} 
                                                                                                    documentClicked={documents => newState({ documentClicked: documents})} 
                                                                                                    deleteParticularClaim={id => newState({ deleteParticularClaim: id})}
                                                                                                    type='mileage' 
                                                                                                    feature='approval'/>
                                                                                    )
                                                                                }
                                                                            })
                                                                        }
                                                                        </>
                                                                    )
                                                                }
                                                                {       
                                                                    state.claimRequestorData[item.chid]?.item3?.length !== 0 && (
                                                                        <>
                                                                        {
                                                                            state.claimRequestorData[item.chid]?.item3.map((item, index) => {
                                                                                if (item.status_approval === 2) {
                                                                                    return (
                                                                                        <CardClaims key={index} 
                                                                                                    data={item} 
                                                                                                    documentClicked={documents => newState({ documentClicked: documents})}
                                                                                                    deleteParticularClaim={id => newState({ deleteParticularClaim: id})}
                                                                                                    type='other'
                                                                                                    feature='approval' />
                                                                                    )
                                                                                }
                                                                            })
                                                                        }
                                                                        </>
                                                                    )
                                                                }
                                                                
                                                            </div>
                                                            <div className="w-full flex flex-row place-content-center gap-2 p-4">
                                                                <Link href={`/eca/claims/detail?chid=${slugify(item.chid)}`} className="cursor-pointer w-1/3 flex place-content-center items-center">
                                                                    <div className="w-full flex place-content-center py-2 bg-blue-400 rounded-full text-white text-xs font-semibold">
                                                                        SEE DETAIL
                                                                    </div>
                                                                </Link>
                                                                <div className="cursor-pointer w-1/3 flex place-content-center items-center">
                                                                    <div className="w-full flex place-content-center py-2 bg-green-400 hover:bg-green-500  rounded-full text-white text-xs font-semibold"
                                                                        onClick={() => newState({approveAll: item.chid})}>
                                                                        APPROVE ALL
                                                                    </div>
                                                                </div>
                                                                <div className="cursor-pointer w-1/3 flex place-content-center items-center">
                                                                    <div className="w-full flex place-content-center py-2 bg-red-400 rounded-full text-white text-xs font-semibold"
                                                                        onClick={() => newState({rejectAll: item.chid})}>
                                                                        REJECT ALL
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    
                                                    ) : (
                                                        <div className="w-full pb-8 flex flex-col place-content-center items-center">
                                                            <div className='transition-all duration-300'>
                                                                <svg className="animate-spin h-8 w-8 text-gray-400 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            </>
                                        )
                                    }
                                </Dropdown>
                            )
                        })
                    }
                    </GridColumn>
                ) : (
                    <>
                        {
                            state.fetchStatus && (
                                <div className={`w-screen mt-52 flex flex-col place-content-center items-center`}>
                                    <h1 className="text-4xl font-bold">Yeay!</h1>
                                    <p className="text-sm mt-2 font-medium">You have no claim approvals</p>
                                </div>
                            )
                        }
                    </>
                )
            }

            
            
            {
                state.documentClicked.length !== 0 && (
                    <ShowDocument data={state.documentClicked} onClose={() => newState({documentClicked: []}) }/>
                )
            }

            {
                (state.rejectAll !== '' && state.rejectAll !== undefined) && (
                    <Modals title="Reject All"
                            caption="Are you sure you want to reject all of this claim?"
                            type='danger'
                            onClose={() => newState({rejectAll: ''})}>
                            <Textarea name='reason' 
                                    value={state.reason} 
                                    onChange={setState} 
                                    placeholder='Please insert your reason...'
                                    rows={3}/>
                            <div className="w-full flex flex-row gap-2 mt-2 mb-5">
                                <div className="w-1/2 ">
                                    <Button size="flex" className="select-none bg-red-400 hover:bg-red-500 py-3 text-xs xl:text-sm text-white" onClick={() => newState({rejectAll: '', reason: ''})}>NO, CANCEL</Button>
                                </div>
                                <div className="w-1/2">
                                    <Button size="flex" className="select-none bg-green-400 hover:bg-green-500 py-3 text-xs xl:text-sm text-white" isLoading={isLoading} onClick={() => rejectAllClaim()}>YES, PROCEED!</Button>
                                </div>
                            </div>
                    </Modals>
                )
            }

            {
                (state.approveAll !== '' && state.approveAll !== undefined) && (
                    <Modals title="Approve All"
                            caption="Are you sure you want to approve all of this claim?"
                            onClose={() => newState({approveAll: ''})}>
                            <div className="w-full flex flex-row gap-2 mt-2 mb-5">
                                <div className="w-1/2 ">
                                    <Button size="flex" className="select-none bg-red-400 hover:bg-red-500 py-3 text-xs xl:text-sm text-white" onClick={() => newState({approveAll: '', reason: ''})}>NO, CANCEL</Button>
                                </div>
                                <div className="w-1/2">
                                    <Button size="flex" className="select-none bg-green-400 hover:bg-green-500 py-3 text-xs xl:text-sm text-white" isLoading={isLoading} onClick={() => approveClaimHeader()}>YES, PROCEED!</Button>
                                </div>
                            </div>
                    </Modals>
                )
            }

            {
                (state.deleteParticularClaim !== '' && state.deleteParticularClaim !== undefined) && (
                    <Modals title="Reject Particular"
                            caption="Are you sure you want to reject this particular claim?"
                            type='danger'
                            onClose={() => newState({deleteParticularClaim: ''})}>
                            <Textarea name='reason' 
                                    value={state.reason} 
                                    onChange={setState}
                                    placeholder='Please insert your reason...'
                                    rows={3}/>
                            <div className="w-full flex flex-row gap-2 mt-2 mb-5">
                                <div className="w-1/2 ">
                                    <Button size="flex" className="select-none bg-red-400 hover:bg-red-500 py-3 text-xs xl:text-sm text-white" onClick={() => newState({deleteParticularClaim: '', reason: ''})}>NO, CANCEL</Button>
                                </div>
                                <div className="w-1/2">
                                    <Button size="flex" className="select-none bg-green-400 hover:bg-green-500 py-3 text-xs xl:text-sm text-white" isLoading={isLoading} onClick={() => rejectParticularClaim()}>YES, PROCEED!</Button>
                                </div>
                            </div>
                    </Modals>
                )
            }
            
        </LayoutList>
    )
}