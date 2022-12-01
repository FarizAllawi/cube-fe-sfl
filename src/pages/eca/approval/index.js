import axios from 'configs/eca/axios'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

import useUser from 'pages/api/eca/user'
import useNotification from 'pages/api/eca/notification'

import LayoutList from "components/eca/Layout/List"

import ClaimDark from '/public/images/svg/eca/claim-dark.svg'
import BTBDark from '/public/images/svg/eca/btb-dark.svg'
import PaymentDark from '/public/images/svg/eca/payment-dark.svg'
import errorHandler from 'configs/errorHandler'

export async function getServerSideProps(context) {

    const response = await axios.get(`api/RolePayment/getAll`)
                          .then(res => {
                             return res
                          })
                          .catch(err => {
                             console.log(err)
                          })

    // Pass data to the page via props
    if (response?.status >= 400 || response?.status === undefined) return { props: { data: [] } }
    return { props: { data: response.data} }
}

export default function Approve(props) {

    const { getDetailUser } = useUser()
    const { getApprovalNotification } = useNotification()

    const [role, setRole] = useState(props.data)
    const [fetchRole, setFetchRole] = useState(false)
    const [user, setUser] = useState({})

    const [ approveNotification , setApproveNotification ] = useState([])
	const [ approveNotificationTemp, setApproveNotificationTemp] = useState({})
    const [fetchNotification, setFetchNotification] = useState(false)


    const getNotification = useCallback( async () => {
        let userData = await getDetailUser()

        if (userData.id !== undefined) {
            let approveNotif = await getApprovalNotification(userData.nik)
            let temp = {}
    
            approveNotif.map(item => {
                temp[`${item.status_approval}`] = item	
            })
            
            setApproveNotificationTemp(temp)
            setUser(userData)
        }
        else errorHandler("There is an error when retrieving user data")

        setFetchNotification(true)
	}, [getApprovalNotification, getDetailUser])

    useEffect(() => {
        if (!fetchNotification) getNotification()

        const getRole = async () => {
            axios.get(`api/RolePayment/getAll`)
                .then(res => {
                    setRole(res.data)
                })
                .catch(err => {
                    console.log(err)
                })

            setFetchRole(true)
        }

        if (!fetchRole && user.id !== undefined && role.length === 0) getRole()

    }, [role, user, fetchRole, fetchNotification, approveNotification, approveNotificationTemp, getNotification])

    return (
        <LayoutList title="List of Approval"
                    goBackPage='/eca'>
            <div className="mt-20 select-none w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-max px-4 gap-2 pb-4 pt-4 overflow-y-scroll scroll-display-none">
                {
                    role.length !== 0 && (
                        <>
                            <Link href="/eca/approval/claims"className="w-full p-4 flex flex-row gap-3 items-start bg-white dark:bg-gray-700 drop-shadow-md hover:drop-shadow-sm rounded-3xl cursor-pointer">
                                
                                    <div className="w-16 h-16 flex place-content-center items-center bg-gray-900 rounded-full">
                                        <ClaimDark className="w-full h-full p-2.5" />
                                    </div>
                                    <div className="w-4/5 h-full flex flex-col">
                                        <div className="w-full text-lg font-semibold text-black dark:text-white">Claim Approval</div>
                                        <div className="w-full text-xs font-normal  text-blue-400">Category</div>
                                        <div className="w-full text-xs font-normal text-gray-400 mt-2">Approval for Claim transactions</div>
                                    </div>
                                    {
                                        approveNotificationTemp['Claim-Approval']?.count_approval !== undefined && approveNotificationTemp['Claim-Approval']?.count_approval > 0 && (

                                            <div className="absolute flex h-7 w-7 -top-1 -right-1">
                                                {/* <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></div> */}
                                                <div className="flex place-content-center items-center text-center rounded-full h-7 w-7 bg-red-500 text-white" style={{ fontSize: "10px"}}>
                                                    {approveNotificationTemp['Claim-Approval']?.count_approval}
                                                </div>
                                            </div>
                                        )
                                    }
                                
                            </Link>

                            <Link href="/eca/approval/btb" className="w-full p-4 flex flex-row gap-3 items-start bg-white dark:bg-gray-700 drop-shadow-md hover:drop-shadow-sm rounded-3xl cursor-pointer">
                                
                                    <div className="w-16 h-16 flex place-content-center items-center p-3.5 bg-slate-500 rounded-full">
                                    <BTBDark className="w-full h-full p-0.5" />
                                    </div>
                                    <div className="w-4/5 h-full flex flex-col">
                                        <div className="w-full text-lg font-semibold text-black dark:text-white">BTB Approval</div>
                                        <div className="w-full text-xs font-normal  text-blue-400">Category</div>
                                        <div className="w-full text-xs font-normal text-gray-400 mt-2">Approval for BTB transactions</div>
                                    </div>
                                    {
                                        approveNotificationTemp['BTB-Approval']?.count_approval !== undefined && approveNotificationTemp['BTB-Approval']?.count_approval > 0 && (

                                            <div className="absolute flex h-7 w-7 -top-1 -right-1">
                                                {/* <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></div> */}
                                                <div className="flex place-content-center items-center text-center rounded-full h-7 w-7 bg-red-500 text-white" style={{ fontSize: "10px"}}>
                                                    {approveNotificationTemp['BTB-Approval']?.count_approval}
                                                </div>
                                            </div>
                                        )
                                    }
                            </Link>
                        </>
                    )
                }
                {
                    role.map((item, index) => {
                        if (item.roleid <= 6 && item.nik === user.nik) {
                            return (
                                <Link key={index} href="/eca/approval/payments" className="w-full p-4 flex flex-row gap-3 items-start bg-white dark:bg-gray-700 drop-shadow-md hover:drop-shadow-sm rounded-3xl cursor-pointer">
                                    <div className="w-16 h-16 flex place-content-center items-center p-3.5 bg-red-400 rounded-full">
                                    <PaymentDark className="w-full h-full p-0.5" />
                                    </div>
                                    <div className="w-4/5 h-full flex flex-col">
                                        <div className="w-full text-lg font-semibold text-black dark:text-white">Payment Approval</div>
                                        <div className="w-full text-xs font-normal  text-blue-400">Category</div>
                                        <div className="w-full text-xs font-normal text-gray-400 mt-2">Approval for Payment transactions</div>
                                    </div>
                                    {
                                        approveNotificationTemp['Payment-Approval']?.count_approval !== undefined && approveNotificationTemp['Payment-Approval']?.count_approval > 0 && (

                                            <div className="absolute flex h-7 w-7 -top-1 -right-1">
                                                {/* <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></div> */}
                                                <div className="flex place-content-center items-center text-center rounded-full h-7 w-7 bg-red-500 text-white" style={{ fontSize: "10px"}}>
                                                    {approveNotificationTemp['Payment-Approval']?.count_approval}
                                                </div>
                                            </div>
                                        )
                                    }
                                </Link>
                            )
                        }

                        if ((item.roleid === 8 && item.nik === user.nik) || (item.roleid === 9 && item.nik === user.nik)) {
                            return (
                                <Link key={index} href="/eca/approval/hrd" className="w-full p-4 flex flex-row gap-3 items-start bg-white dark:bg-gray-700 drop-shadow-md hover:drop-shadow-sm rounded-3xl cursor-pointer">
                                    <div className="w-16 h-16 flex place-content-center items-center bg-green-400 rounded-full font-bold">
                                        {/* <ClaimDark className="w-full h-full p-2.5" /> */}
                                        HRD
                                    </div>
                                    <div className="w-4/5 h-full flex flex-col">
                                        <div className="w-full text-lg font-semibold text-black dark:text-white">HRD Approval</div>
                                        <div className="w-full text-xs font-normal  text-blue-400">Category</div>
                                        <div className="w-full text-xs font-normal text-gray-400 mt-2">Approval for Mileage Claim transactions</div>
                                    </div>
                                    {
                                        approveNotificationTemp['Claim-HRD-Approval']?.count_approval !== undefined && approveNotificationTemp['Claim-HRD-Approval']?.count_approval > 0 && (

                                            <div className="absolute flex h-7 w-7 -top-1 -right-1">
                                                {/* <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></div> */}
                                                <div className="flex place-content-center items-center text-center rounded-full h-7 w-7 bg-red-500 text-white" style={{ fontSize: "10px"}}>
                                                    {approveNotificationTemp['Claim-HRD-Approval']?.count_approval}
                                                </div>
                                            </div>
                                        )
                                    }
                                </Link>
                            )
                        }
                    })
                }        
            </div>
        </LayoutList>
    )
}

