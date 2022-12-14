import { useCallback, useEffect, useState } from "react"
import Link from 'next/link'

import useClaim from "pages/api/eca/claim"
import useUser from "pages/api/eca/user"

import LayoutList from "components/eca/Layout/List"
import Button from "components/eca/Button"
import Filter from "components/eca/Filter"
import ShowDocument from "components/eca/Document/Show"
import Dropdown from "components/eca/Dropdown"
import GridColumn from 'components/eca/Grid/Column'
import RatingStar from "components/eca/Rating"
import BadgeStatus from "components/eca/Badge"
import CardClaims from "components/eca/Card/Claim"

import useForm from "helpers/useForm"
import slugify from "helpers/slugify"
import formatDate from "helpers/formatDate"

import PlusLight from '/public/images/svg/eca/plus-light.svg'
import errorHandler from "configs/errorHandler"

export default function Claims(props) {

    const [isLoading, setIsLoading] = useState(false)
    const [filter, setFilter] = useState(false)
    const [user , setUser] = useState(false)

    const { getClaimHeader, getCHBundle } = useClaim()
    const { getDetailUser } = useUser()


    const [fetStatus , setFetchStatus] = useState(false)
    const [state, setState, newState] = useForm({
        buttonFilter: [
            {name: 'All', color: 'lime'},
            {name: 'Paid', color: 'blue'},
            {name: 'Approved', color: 'green'},
            {name: 'Progress', color: 'yellow'},
            {name: 'Draft', color: 'gray'},
            {name: 'Rejected', color: 'red'},
        ],
        claimHeader:[],
        claimsDataTemp: [],
        claimHeaderData: {},
        documentClicked: [],
        getClaimDataStatus: '',
        fetchStatus: false,
    })

    const buttonFilterOnClick = (type) => {
        let temp = []
        if (type === 'all') newState({claimsDataTemp: state.claimHeader})
        else {
            state.claimHeader.map((item) => { 
                if (item.status === 0 && type === 'paid') temp.push(item)
                if (item.status === 1 && type === 'approved') temp.push(item)
                if (item.status === 2 && type === 'progress') temp.push(item)
                if (item.status === 3 && type === 'draft') temp.push(item)
                if (item.status === 4 && type === 'rejected') temp.push(item)
            })
            newState({claimsDataTemp: temp})
        }
    }

    const searchFilterOnChange = (search) => {
        let filteredClaim = []
        // Find claim by claim header
        state.claimHeader.map((data) => {
            let dataExists = false

            // Slugify claim header
            let claim = slugify(data.chid)
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

        state.claimHeader.map((data) => {
            let dataExists = false
            
            let claimsDate = new Date(data.createdt).getTime()
            if (dateRange.firstDate <= claimsDate && claimsDate <= dateRange.lastDate && !dataExists) {
                dataExists = true
            }

            if (dataExists) filteredClaim.push(data)
        })

        newState({
            claimsDataTemp: filteredClaim
        })
    }

    const getClaim = useCallback(async () => {
        let userData = await getDetailUser()

        if (userData.id !== undefined) {
            setUser(userData)

            newState({ 
                claimsDataTemp: [{},{},{},{}],
                claimHeaderData: {},
                fetchStatus: true
            })
            setIsLoading(true)
            
            setTimeout(async () => {
                let claimHeader = await getClaimHeader(userData.id)
                newState({ 
                    claimHeader: claimHeader,
                    claimsDataTemp: claimHeader,
                    claimHeaderData: {},
                    fetchStatus: true
                })
                setIsLoading(false)
            }, 1000);
        }
        else errorHandler("There is an error when retrieving user data")


        // newState({ claimsDataTemp: claimsData })
    }, [getClaimHeader, getDetailUser, newState])

    const getClaimHeaderData = (chId) => {
        setTimeout(async () => {
            let chBudle = await getCHBundle(chId)
            let claimHeaderData = state.claimHeaderData
            claimHeaderData[chId] = chBudle
            newState({ claimHeaderData: claimHeaderData })
        }, 500)
    }

    const getAmount = (mileage, others, type) => {
        let total = 0

        if (mileage.length > 0) {
            mileage?.map((item) => {
                if (type === 'amount') total += item.amount
                if (item.status_approval === 0 && type === 'paid') total += item.amount
                if (item.status_approval === 4 && type === 'rejected') total += item.amount
            })
        }

        if (others.length > 0) {
            others?.map((item) => {
                if (type === 'amount') total += item.amount
                if (item.status_approval === 0 && type === 'paid') total += item.amount
                if (item.status_approval === 4 && type === 'rejected') total += item.amount
            })
        }
        
        return total
    }

    useEffect(() => {
        if (!fetStatus) {
            getClaim()
            setFetchStatus(true)
        }

    },[fetStatus, getClaim])


    return (
        <LayoutList title="List of Claims" defaultBackPage='/eca' refresh={true} onRefresh={getClaim}>

            <div className="w-full px-4 mt-20 select-none flex flex-row place-content-center items-center">
                <p className="w-1/2 font-semibold text-xl">Your Claims</p>
                <div className="w-1/2 h-auto flex place-content-end items-center">
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
                </div>
            </div> 

            {
                filter && (
                    <Filter button={state.buttonFilter} 
                            buttonOnClick={type => buttonFilterOnClick(type)} 
                            search={true} searchOnChange={search => searchFilterOnChange(search)} 
                            dateRange={true} 
                            date={state.filterDate}
                            isLoading={isLoading}
                            dateRangeOnChange={date => dateRangeFilterOnChange(date)}/>
                )
            }

            {
                state.claimsDataTemp?.length > 0  ? (
                    <GridColumn>
                    {
                        state.claimsDataTemp?.map((item, index) => {
                            return (
                                <Dropdown   key={index} 
                                            title={`${item.chid}`} 
                                            caption={formatDate( item.createdt !== undefined ? new Date(item.createdt) : new Date())}
                                            name={`Claim-${index}`}
                                            isLoading={isLoading}
                                            onClick={clicked => {
                                                if (!state.claimHeaderData.hasOwnProperty(item.chid)) {
                                                    getClaimHeaderData(item.chid)
                                                } 
                                            }}
                                            append={
                                                <BadgeStatus type='badge' feature='header' status={item.status} />
                                            }>
                                    
                                    { 
                                        !isLoading && (
                                        <>
                                            {
                                                state.claimHeaderData.hasOwnProperty(item.chid) ? (
                                                    <>
                                                        <div className="w-full px-4 flex flex-col gap-2">
                                                                <div className="w-full py-4 px-5 flex flex-col gap-2 bg-emerald-400 rounded-xl mb-4">
                                                                    {
                                                                        item.status >= 0 && item.status <= 3 &&  (
                                                                            <>
                                                                                <div className="w-full grid xl:grid-cols-2 grid-cols-3 gap-1">
                                                                                    <div className="text-white text-xs font-medium">Total Amount</div>
                                                                                    <div className="text-white text-xs font-normal">
                                                                                        : IDR {new Intl.NumberFormat('de-DE').format(getAmount(state.claimHeaderData[item.chid]?.item2, state.claimHeaderData[item.chid]?.item3, 'amount'))}
                                                                                    </div>
                                                                                </div>

                                                                                {
                                                                                    getAmount(state.claimHeaderData[item.chid]?.item2, state.claimHeaderData[item.chid]?.item3, 'rejected') !== 0 && (
                                                                                        <>
                                                                                            <div className="w-full grid xl:grid-cols-2 grid-cols-3 gap-1">
                                                                                                <div className="text-white text-xs font-medium">Total Reject</div>
                                                                                                <div className="text-white text-xs font-normal">
                                                                                                    : IDR {new Intl.NumberFormat('de-DE').format(getAmount(state.claimHeaderData[item.chid]?.item2, state.claimHeaderData[item.chid]?.item3, 'rejected'))}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="w-full grid grid-cols-3 gap-1">
                                                                                                <div className="text-white text-xs font-medium">Reason</div>
                                                                                                <div className="text-white text-xs font-normal">: </div>
                                                                                            </div>   
                                                                                        </>
                                                                                    )
                                                                                }
                                                                            </>
                                                                        )
                                                                    }
                                                                    {
                                                                        item.status === 0 && (
                                                                            <>
                                                                                <div className="w-full grid xl:grid-cols-2 grid-cols-3 gap-1">
                                                                                    <div className="text-white text-xs font-medium">Total Paid</div>
                                                                                    <div className="text-white text-xs font-normal">
                                                                                        : IDR {new Intl.NumberFormat('de-DE').format(getAmount(state.claimHeaderData[item.chid]?.item2, state.claimHeaderData[item.chid]?.item3, 'paid'))}
                                                                                    </div>
                                                                                </div>
                                                                                {
                                                                                    getAmount(state.claimHeaderData[item.chid]?.item2, state.claimHeaderData[item.chid]?.item3, 'rejected') !== 0 && (
                                                                                        <>
                                                                                            <div className="w-full xl:grid-cols-2 grid grid-cols-3 gap-1">
                                                                                                <div className="text-white text-xs font-medium">Total Reject</div>
                                                                                                <div className="text-white text-xs font-normal">
                                                                                                    : IDR {new Intl.NumberFormat('de-DE').format(getAmount(state.claimHeaderData[item.chid]?.item2, state.claimHeaderData[item.chid]?.item3, 'rejected'))}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="w-full grid grid-cols-3 gap-1">
                                                                                                <div className="text-white text-xs font-medium">Reason</div>
                                                                                                <div className="text-white text-xs font-normal">: </div>
                                                                                            </div>   
                                                                                        </>
                                                                                    )
                                                                                }
                                                                            </>
                                                                        )
                                                                    }
                                                                    {
                                                                        item.status === 4 && (
                                                                            <>
                                                                                <div className="w-full xl:grid-cols-2 grid grid-cols-3 gap-1">
                                                                                    <div className="text-white text-xs font-medium">Total Reject</div>
                                                                                    <div className="text-white text-xs font-normal">
                                                                                        : IDR {new Intl.NumberFormat('de-DE').format(getAmount(state.claimHeaderData[item.chid]?.item2, state.claimHeaderData[item.chid]?.item3, 'rejected'))}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="w-full grid xl:grid-cols-2 grid-cols-3 gap-1">
                                                                                    <div className="text-white text-xs font-medium">Reason</div>
                                                                                    <div className="text-white text-xs font-normal">: </div>
                                                                                </div>   
                                                                            </>
                                                                        )
                                                                    }

                                                            
                                                                </div>
                                                                {
                                                                    item.status === 0 && item.rating > 0 && (
                                                                        // <div className="w-full flex place-content-center items-center py-4 px-5">
                                                                            <RatingStar value={item.rating} />
                                                                        // </div>
                                                                    )
                                                                }

                                                                <div className="w-full flex flex-col gap-2 rounded-3xl mb-4">
                                                                {
                                                                    state.claimHeaderData[item.chid]?.item2?.length !== 0 &&  (
                                                                        <>
                                                                        {
                                                                            state.claimHeaderData[item.chid]?.item2?.map((item, index) => {
                                                                                return (<CardClaims key={index} data={item} documentClicked={documents => newState({ documentClicked: documents})} type='mileage' feature='list' />)
                                                                            })
                                                                        }
                                                                        </>
                                                                    )
                                                                }
                                                                {       
                                                                    state.claimHeaderData[item.chid]?.item3?.length !== 0 && (
                                                                        <>
                                                                        {
                                                                            state.claimHeaderData[item.chid]?.item3?.map((item, index) => {
                                                                                return (<CardClaims key={index} data={item} documentClicked={documents => newState({ documentClicked: documents})} type='other' feature='list' />)
                                                                            })
                                                                        }
                                                                        </>
                                                                    )
                                                                }
                                                                </div>
                                                                
                                                                
                                                                
                                                        </div>
                                                        <Link href={`/eca/claims/detail?chid=${item.chid}`}>
                                                            <div className="cursor-pointer w-full p-5 flex place-content-center items-center">
                                                                <div className="w-full flex place-content-center py-2 bg-emerald-400 rounded-full text-white text-sm font-semibold">
                                                                    SEE DETAIL
                                                                </div>
                                                            </div>
                                                        </Link>
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
                                    )}                                
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
                                    <p className="text-sm mt-2 font-medium">You have no Claims</p>
                                </div>
                            )
                        }
                    </>
                )
            }
        
            <Link href="/eca/claims/action">
                <div className="absolute z-20 bottom-5 right-5 p-4 bg-green-400 hover:bg-green-500 rounded-full cursor-pointer">
                    <PlusLight/>
                </div>
            </Link>

            {
                state.documentClicked.length !== 0 && (
                    <ShowDocument data={state.documentClicked} onClose={() => newState({documentClicked: []}) }/>
                )
            }
        </LayoutList>
    )
}
