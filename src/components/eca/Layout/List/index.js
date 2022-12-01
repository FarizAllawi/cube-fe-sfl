import {Children, useState, useEffect} from 'react'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import propTypes from 'prop-types'

import useUser from 'pages/api/user'

import Theme from 'components/eca/Theme'
import Notification from 'components/eca/Notification'

import ArrowLeftDark from '/public/images/svg/eca/arrow-left-dark.svg'
import ArrowLeftLight from '/public/images/svg/eca/arrow-left-light.svg'
import RefreshLight from '/public/images/svg/eca/refresh-light.svg'
import RefreshDark from '/public/images/svg/eca/refresh-dark.svg'
import SignOutDark from '/public/images/svg/eca/icon-signout-dark.svg'
import SignOutLight from '/public/images/svg/eca/icon-signout-light.svg'

export default function Layout(props) {
    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const { logout } = useUser()
	const {theme, setTheme} = useTheme()
    const [systemTheme, setSystemTheme] = useState('')

    useEffect(() => {
        setMounted(true)
		let theme = document.getElementsByTagName("html")[0].className
        setSystemTheme(theme)

    }, [])
    if (!mounted) return null


    return (
        <> 
            <Head>
                <title>{props.title}</title>
            </Head>
            <div className="w-screen h-screen flex flex-col gap-4 bg-stone-50 dark:bg-gray-900 pb-4">
                <div className="w-full flex flex-row items-center px-4 fixed top-0 bg-neutral-50 dark:bg-gray-800 border-b-2 border-b-gray-200 dark:border-b-gray-700">
                    <div className="w-auto mr-8 h-full cursor-pointer rounded-full " 
                         onClick={() => {
                            props.goBackPage !== undefined ? router.push(props.goBackPage) : router.back()
                        }}>
                        {
                            theme === 'dark' || (theme === 'system' && systemTheme === 'dark') ? <ArrowLeftDark className="rounded-full" /> : <ArrowLeftLight className="rounded-full" />
                        }
                    </div>
                    <div className="w-3/6 xl:w-10/12 flex font-semibold select-none text-xs md:text-sm text-zinc-900 dark:text-white">
                        {props.title}
                    </div>
                    <div className="w-3/6 xl:w-2/12 relative flex gap-2 py-2 place-content-end items-center">
                        {
                            props.refresh && (
                                <div className="flex  px-2.5 py-2.5 bg-white dark:bg-gray-700 drop-shadow-md hover:drop-shadow-sm rounded-full cursor-pointer"
                                    onClick={() => props.onRefresh ? props.onRefresh() : router.reload()}>
                                    {
                                        theme === 'dark' || (theme === 'system' && systemTheme === 'dark') ? (
                                            <RefreshDark className="p-0.5" />
                                        ) : (
                                            <RefreshLight className="p-0.5"/>
                                        )
                                    }
                                </div>
                            )
                        }
                        <div className="flex place-content-center">
                            <Theme className="p-0.5"/>
                        </div>
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
                    </div>
                </div>
                {
                    props.children
                }
            </div>
        </>
    )
}

Layout.propTypes = {
    title: propTypes.string,
    refresh: propTypes.bool,
    onRefresh: propTypes.func,
    goBackPage: propTypes.string.isRequired
}

