import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'

import ProfileInitial from 'components/kch-office/ProfileInitial'

import useUser from 'pages/api/user'

import capitalizeEachWord from 'helpers/capitalizeEachWord'

import NotificationIcon from '../../../../../public/images/svg/kch-office/notification-icon.svg'
import Logo from '../../../../../public/images/pictures/kch-office/logo-kalbe.png'
import CubeLogo from '/public/images/svg/cube-logo.svg'

export default function NavbarMobile(props) {
    const router = useRouter()
    const { user, logout } = useUser()

    const [toggle, setToggle] = useState(false)
    const imageLoader = ({src}) => {
        return src
    }

    useEffect(() => {
    }, [user])


    return (
        <>
            <Link href="/kch-office">
                <div className="w-auto flex flex-col py-2 place-content-center items-center">
                    <div className="text-xl text-green-900 font-extrabold ">CHStar</div>
                    <div className="text-sm tracking-wide text-green-500 font-semibold">KCH OFFICE</div>
                </div>
            </Link>
            <div className="w-full flex flex-row gap-4 xl:gap-4 place-content-end items-center">
                
                {/* <Link href="/kch-office/notification">
                    <NotificationIcon className='px-0.5' />
                </Link> */}
                    <div className="relative flex w-12 h-12  xl:w-10 xl:h-10 p-0.5 place-content-center items-center rounded-full bg-white border-2 border-green-900  drop-shadow-md hover:drop-shadow-sm cursor-pointer" onClick={() => router.push('/')}>
                        <CubeLogo />
                    </div>
                    <div className="relative flex w-12 h-12  xl:w-10 xl:h-10 p-0.5 place-content-center items-center border-2 border-green-900 rounded-full" onClick={() => setToggle(!toggle)}>
                    {
                        user?.photo_profile === null || user?.photo_profile === undefined ? (
                            <ProfileInitial name={user?.name} width="full" height="full"/>
                        ) : (
                            <Image  fill
                                    loader={imageLoader}
                                    src={`${process.env.NEXT_PUBLIC_API_STORAGE}/files/get?filePath=${user.photo_profile}`} 
                                    className="object-contain object-center rounded-full p-0.5" 
                                    alt="profile-image"/>
                        )

                    }
                    {
                            toggle && (
                                <div className="fixed flex flex-col drop-shadow-md mt-48 right-6 shadow-md rounded-xl">
                                    <div className="text-right text-sm text-green-900 font-medium p-4 bg-white hover:bg-opacity-95 rounded-t-xl" onClick={() => logout()}>Log Out</div>
                                    <Link href="/kch-office/profile">
                                        <div className="text-right text-sm text-green-900 font-medium p-4 bg-white hover:bg-opacity-95 rounded-b-xl">Profile Setting</div>
                                    </Link>
                                </div>
                            )
                        }
                    </div>

            </div>
            
        </>
    )
}