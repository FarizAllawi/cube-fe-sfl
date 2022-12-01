import React, { useState, useEffect } from 'react'
import { useTheme } from "next-themes"
import { useRouter } from 'next/router'

import Layout from "components/eca/Layout/List"
// import GridColumn from 'components/eca/Grid/Column'

import ClaimDark from '/public/images/svg/eca/claim-dark.svg'
import ClaimLight from '/public/images/svg/eca/claim-light.svg'
import BTBDark from '/public/images/svg/eca/btb-dark.svg'
import BTBLight from '/public/images/svg/eca/btb-light.svg'
import ApproveDark from '/public/images/svg/eca/approve-dark.svg'
import ApproveLight from '/public/images/svg/eca/approve-light.svg'

import useNotification from 'pages/api/eca/notification'
import useAuth from 'pages/api/eca/user'

import formatDate from 'helpers/formatDate'
import errorHandler from 'configs/errorHandler'
import { toast } from 'react-toastify'


const GetNotificationIcon = (type) => {
    const [mounted, setMounted] = useState(false)
	const {theme, setTheme} = useTheme()

    useEffect(() => setMounted(true), [])
    if (!mounted) return null

    if (type === 'claims') {
        return (
            <>{theme === 'dark' ? <ClaimDark className="w-full h-full p-2" /> : <ClaimLight className="w-full h-full  p-2" />}</>
        )
    }

    if (type === 'approval') {
        return (
            <>{theme === 'dark' ? <ApproveDark className="w-full h-full p-2" /> : <ApproveLight className="w-full h-full  p-2" />}</>
        )
    }

    if (type === 'btb') {
        return (
            <>{theme === 'dark' ? <BTBDark className="w-full h-full p-2" /> : <BTBLight className="w-full h-full  p-2" />}</>
        )
    }
}

function CardNotification(props) {

    const { data } = props

    return (
        <div className="w-full p-4 flex flex-row gap-3 items-start bg-white dark:bg-gray-700 drop-shadow-md hover:drop-shadow-sm rounded-3xl cursor-pointer" onClick={() => props.onClick(data.header.split('-')[1])}>
            <div className="w-1/5 flex place-content-center items-center pl-2 pr-1.5 py-2 bg-zinc-200 dark:bg-gray-900 rounded-full">
                {
                    GetNotificationIcon(data.header.split('-')[0])
                }
            </div>
            <div className="w-4/5 h-full flex flex-col gap-2">
                <div className="w-full h-4/5 flex flex-col gap-2">
                    <div className="w-full h-1/3 text-sm font-semibold text-black dark:text-white">{data.header.split('-')[1]}</div>
                    <div className="w-full h-2/3 text-xs font-normal text-black dark:text-white">{data?.description}</div>      
                </div>
                <div className="w-full h-1/5 text-xs font-normal text-gray-400">{`${formatDate(data?.createdt)} ${data?.createdt.substring(11, 16)}`}</div>
            </div>
        </div>
    )
}

export default function Notification(props) {
    const router = useRouter()
    const { notifications,  updateNotification} = useNotification()

    const readNotification = async (item) => {
        await updateNotification({
            nfid: item.nfid,
            nik: item.nik,
            header: item.header,
            description: item.description,
            is_read: 1,
            createdt: item.createdt,
            is_active: item.is_active
        })
    }

    const clickNotification = async (item) => {

        let header = item.header.split('-')
        let uniqueHeader = item.description.split(' ')

        if (uniqueHeader[1] !== undefined) {

            if (header[1] === 'Claim Need Approval') {
                await readNotification(item)
                router.push('/eca/approval/claims')
            }

            if (header[1] === 'BTB Need Approval') {
                await readNotification(item)
                router.push('/eca/approval/btb')
            }

            /**
             * Header 0 = TYPE -> Claim or BTB
             *        1 = TITLE
             *        2 = CHID
             */
            if (header[1] === 'Claim Approved' || header[1] === 'Claim Rejected') {
                await readNotification(item)
                router.push('/eca/claims/detail?chid=' + header[2])
            }

            if (header[1] === 'BTB Approved' || header[1] === 'BTB Rejected') {
                await readNotification(item)
                router.push('/eca/btb/detail?bhid=' + header[2])
            }

        }
    }

    useEffect(() => {
    },[notifications])

    return (
        <Layout title="Notification" refresh={true} defaultBackPage="/eca">
            <div className="w-full flex flex-row px-4 mt-20 select-none">
                <p className="w-1/2 font-semibold text-base md:text-lg">Your Notification</p>
                {/* <div className="w-1/2 text-right font-medium text-sm md:text-base text-blue-400 cursor-pointer" onClick={() => markAllAsRead()}>Mark All as Read</div> */}
            </div> 
            
            <div className="w-full h-screen overflow-y-scroll scroll-display-none z-10 flex place-content-center pb-10">
                <div className="w-full md:w-1/2 lg:w-1/3">
                    <div className={` select-none w-full h-screen grid grid-cols-1 auto-rows-max px-4 gap-2 pb-24 mb-4`}>
                    {                
                        notifications?.map( (item, index) => {
                            return (<CardNotification key={index} data={item} onClick={ header => clickNotification(item)} />)
                        })
                    }
                    </div>
                </div>
            </div>
            
        </Layout>
    )
}