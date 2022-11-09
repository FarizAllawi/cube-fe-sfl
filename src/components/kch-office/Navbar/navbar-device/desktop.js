import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import ProfileInitial from 'components/kch-office/ProfileInitial'

import useUser from 'pages/api/kch-office/user'

import capitalizeEachWord from 'helpers/capitalizeEachWord'

import NotificationIcon from '../../../../../public/images/svg/kch-office/notification-icon.svg'
import Logo from '../../../../../public/images/pictures/kch-office/logo-kalbe.png'

export default function NavbarDesktop(props) {

    const { user } = useUser()

    useEffect(() => {
    }, [])


    return (
        <>
            <div className="relative w-1/3 flex flex-col py-1 gap-1 place-content-start items-center">
                <div className="absolute -left-2 w-28 h-12 xl:w-36 xl:h-14 flex place-content-center items-center rounded-r-2xl">
                    <Image src={Logo} fill className=' py-2 px-2 ' quality={100} priority={true} alt="Logo-KCH" />
                </div>
            </div>
            <div className="w-1/3 flex flex-col py-2 place-content-center items-center">
                <div className="text-2xl text-green-900 font-extrabold ">CHStar</div>
                <div className="text-sm tracking-wide text-green-500 font-semibold">KCH OFFICE</div>
            </div>
            <div className="w-1/3 flex flex-row gap-4 place-content-end items-center">
                
                <Link href="/kch-office/notification">
                    <NotificationIcon className='px-0.5' />
                </Link>

                <Link href="/kch-office/profile">
                    <div className="flex flex-row gap-1 px-1.5 py-1.5 place-content-end items-center bg-green-900 cursor-pointer  drop-shadow-md hover:drop-shadow-sm rounded-full ">
                        <div className="flex p-2">
                            <p className="text-gray-500 text-white text-sm font-medium">{capitalizeEachWord(user?.name)}</p>
                        </div>
                        <div className="relative flex w-10 h-10 p-0.5 place-content-center items-center border-2 border-white rounded-full">
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
                    </div>
                </Link>

            </div>
            
        </>
    )
}