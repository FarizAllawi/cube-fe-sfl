import { useState, useEffect } from 'react'
import { useTheme  } from 'next-themes'
import Link from 'next/link'

// import Theme from 'components/eca/Theme'

import useUser from 'pages/api/user'
import CubeLogo from '/public/images/svg/cube-logo.svg'

import { useRouter } from 'next/router';

import Notification from 'components/eca/Notification'

import capitalizeEachWord from 'helpers/capitalizeEachWord'

import SignOutDark from '/public/images/svg/eca/icon-signout-dark.svg'
import SignOutLight from '/public/images/svg/eca/icon-signout-light.svg'
import ProfileImage from '/public/images/svg/eca/profile.svg'

export default function NavbarDesktop(props) {

    const { user, logout } = useUser()

    const {theme, setTheme} = useTheme()
    const [systemTheme, setSystemTheme] = useState('')

    const router = useRouter();

    useEffect(() => {
        // let theme = document.getElementsByTagName("html")[0].className
        // setSystemTheme(theme)
    }, [])


    return (
        <>
            <div className="w-1/2 flex flex-col py-2 gap-1 place-content-start items-center">
                <Link href="/eca" className="w-full text-xl lg:text-lg xl:text-3xl font-bold text-blue-300 tracking-wider cursor-pointer">
                    ECA
                </Link>
                <div className="w-full text-xs text-blue-400 -mt-1">Employee Claim App</div>
            </div>
            <div className="w-1/2 flex flex-row gap-3 place-content-end items-center">
                
                {/* <div className="relative ">
                    <Theme />
                </div> */}

                <Link href="/eca/notification">
                    <div>
                        <Notification />
                    </div>
                </Link>

                <div className="py-3 px-3 rounded-full bg-white dark:bg-gray-700 drop-shadow-md hover:drop-shadow-sm  cursor-pointer" onClick={() => router.push('/')}>
                    <CubeLogo />
                </div>

                    <div onClick={()=>{router.push("/eca/profile")}}
                         className="flex flex-row gap-1 px-2 py-1 place-content-end items-center bg-white dark:bg-gray-700 border-b-2 border-b-gray-200 dark:border-b-gray-700 cursor-pointer  drop-shadow-md hover:drop-shadow-sm rounded-full ">
                        <div className="flex p-2">
                            <p className="text-gray-500 dark:text-gray-300 text-xs font-light">{capitalizeEachWord(user?.name)}</p>
                        </div>
                        <div className="relative w-10 h-10">
                            <ProfileImage className="p-2" />
                            {/* <Image src={ProfileImage} layout="fill" className="object-contain rounded-full " alt="profile-image"/> */}
                        </div>
                    </div>

            </div>
        </>
    )
}