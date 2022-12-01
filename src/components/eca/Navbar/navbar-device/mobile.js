import { useState, useEffect } from 'react'
import { useTheme  } from 'next-themes'
import Link from 'next/link'

import useUser from 'pages/api/user'

// import Theme from 'components/eca/Theme'
import Notification from 'components/eca/Notification'

import ProfileImage from '/public/images/svg/eca/profile.svg'
import SignOutDark from '/public/images/svg/eca/icon-signout-dark.svg'
import SignOutLight from '/public/images/svg/eca/icon-signout-light.svg'

export default function NavbarMobile(props) {
    const { logout } = useUser()
    const {theme, setTheme} = useTheme()
    const [systemTheme, setSystemTheme] = useState('')

    useEffect(() => {
        // let theme = document.getElementsByTagName("html")[0].className
        // setSystemTheme(theme)
    }, [])

    return (
        <>
            <div className="w-3/6 flex flex-col px-2 py-3 gap-1 place-content-start items-center">
                <Link href="/eca" className="w-full text-xl lg:text-lg xl:text-3xl font-bold text-blue-300 tracking-wider cursor-pointer">
                    ECA
                </Link>
                <div className="w-full text-xs text-blue-400 -mt-1">Employee Claim App</div>
            </div>
            <div className="w-3/6 flex flex-row gap-1 place-content-end items-center ">
                {/* <div className="relative">
                    <Theme />
                </div>
                 */}
                <Link href="/eca/notification">
                    <div>
                        <Notification />
                    </div>
                </Link>
                
                <div className="py-3.5 px-3 rounded-full bg-white dark:bg-gray-700 drop-shadow-md hover:drop-shadow-sm  cursor-pointer" onClick={() => logout()}>
                {
                    theme === 'dark' || (theme === 'system' && systemTheme === 'dark') ? (
                        <SignOutDark className="p-0.5" />
                    ) : (
                        <SignOutLight className="p-0.5" />
                    )
                }
                </div>

                <Link href="/eca/profile">
                    <div className="cursor-pointer flex place-content-center bg-white dark:bg-gray-700 border-4  border-white dark:border-gray-700 drop-shadow-md hover:drop-shadow-sm rounded-full">
                        <ProfileImage className="p-2" width={40} height={40} />
                        {/* <Image src={ProfileImage} width={40} height={40} className="w-full object-contain rounded-full " alt="profile-image"/> */}
                    </div>
                </Link>

            </div>
        </>
    )

}