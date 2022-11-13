import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import ProfileInitial from 'components/kch-office/ProfileInitial'

import useUser from 'pages/api/kch-office/user'

import capitalizeEachWord from 'helpers/capitalizeEachWord'

import NotificationIcon from '../../../../../public/images/svg/kch-office/notification-icon.svg'
import Logo from '../../../../../public/images/pictures/kch-office/logo-kalbe.png'

export default function NavbarMobile(props) {

    const { user } = useUser()

    useEffect(() => {
    }, [])


    return (
        <>
            <div className="w-auto flex flex-col py-2 place-content-center items-center">
                <div className="text-xl text-green-900 font-extrabold ">CHStar</div>
                <div className="text-sm tracking-wide text-green-500 font-semibold">KCH OFFICE</div>
            </div>
            <div className="w-full flex flex-row gap-4 xl:gap-4 place-content-end items-center">
                
                <Link href="/kch-office/notification">
                    <NotificationIcon className='px-0.5' />
                </Link>

                <Link href="/kch-office/profile">
                    <div className="relative flex w-12 h-12  xl:w-10 xl:h-10 p-0.5 place-content-center items-center border-2 border-green-900 rounded-full">
                    {
                        user.photo === null || user.photo === undefined ? (
                            <ProfileInitial name={user?.name} width="full" height="full"/>
                        ) : (
                            <Image  fill
                                    loader={imageLoader}
                                    src={`${process.env.NEXT_PUBLIC_API_STORAGE}files/get?filePath=${user.photo}`} 
                                    className="object-contain rounded-full" 
                                    alt="profile-image"/>
                        )

                    }
                    </div>
                </Link>

            </div>
            
        </>
    )
}