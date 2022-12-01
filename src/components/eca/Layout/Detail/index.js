import {Children, useCallback, useState, useEffect} from 'react'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import propTypes from 'prop-types'

import useUser from 'pages/api/user'

import Theme from 'components/eca/Theme'
import Button from 'components/eca/Button'
import Notification from 'components/eca/Notification'

import ArrowLeftDark from '/public/images/svg/eca/arrow-left-dark.svg'
import ArrowLeftLight from '/public/images/svg/eca/arrow-left-light.svg'
// import NotificationLight from '/public/images/svg/notification-light.svg'
// import NotificationDark from '/public/images/svg/notification-dark.svg'
import SignOutDark from '/public/images/svg/eca/icon-signout-dark.svg'
import SignOutLight from '/public/images/svg/eca/icon-signout-light.svg'

export default function Layout(props) {

    const { defaultBackPage } = props

    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const { logout } = useUser()
	const {theme, setTheme} = useTheme()
    const [systemTheme, setSystemTheme] = useState('')
    const [backPage, setBackPage] = useState('')

    const [updateStatus, setUpdateStatus] = useState(false)


    // Initialization Localstorage on Navbar Component
    const updateNavigationPage = useCallback((action) => {
        let currentPage = localStorage.getItem('current-page')
        let navigationPage = localStorage.getItem('navigation-page')
        let page = navigationPage !== null ? JSON.parse(navigationPage) : []
        
        if (action === 'store') {
            if (currentPage !== null) {
                // actual current page not same in current-page localstorage
                if (currentPage !== router.asPath) {
                    // Update current-page
                    currentPage = router.asPath
                    localStorage.setItem('current-page', currentPage)

                    page.push(router.asPath)
                    localStorage.setItem('navigation-page', JSON.stringify(page))
                }
            }
            else {
                page.push(router.asPath)
                localStorage.setItem('navigation-page', JSON.stringify(page))
                localStorage.setItem('current-page', router.asPath) 
            }

            
        }

        if (action === 'back') {
            if (page.length === 0) {
                router.push(defaultBackPage)
            }
            else {
                let backStatus = false
                let length = page.length-1;
                for (let i=length; i > 0; i--) {
                    backStatus = true;
                    if (page[i] === router.asPath) {
                        page.splice(i, 1)
                        backStatus = false
                    }
                }

                if (backStatus) router.push(page[page.length - 1])
                else router.push(defaultBackPage)
                localStorage.setItem('navigation-page', JSON.stringify(page))
            }
        }

        

    }, [defaultBackPage, router])

    useEffect(() => {
        setMounted(true)
		let theme = document.getElementsByTagName("html")[0].className

        if (!updateStatus) updateNavigationPage('store')

        setSystemTheme(theme)

    }, [updateNavigationPage, updateStatus])
    if (!mounted) return null


    return (
        <> 
            <Head>
                <title>{props.title}</title>
            </Head>
            <div className="w-screen min-h-screen max-h-full flex flex-col gap-3 bg-stone-50 dark:bg-gray-900 scroll-display-none ">
                <div className="w-full z-30 flex flex-row items-center px-4 fixed top-0 bg-neutral-50 dark:bg-gray-800 border-b-2 border-b-gray-200 dark:border-b-gray-700">
                    <div className="w-auto mr-8 h-full cursor-pointer rounded-full " 
                         onClick={() => updateNavigationPage('back')}>
                        {
                            theme === 'dark' || (theme === 'system' && systemTheme === 'dark') ? <ArrowLeftDark className="rounded-full" /> : <ArrowLeftLight className="rounded-full" />
                        }
                    </div>
                    <div className="w-3/6 xl:w-10/12 flex font-semibold select-none text-xs md:text-sm text-zinc-900 dark:text-white">
                        {props.title}
                    </div>
                    <div className="w-3/6 xl:w-2/12 relative flex gap-2 py-2 place-content-end items-center">
                        {/* <div className="flex place-content-center">
                            <Theme className="p-0.5"/>
                        </div> */}
                        <Link href="/eca/notification">
                            <div className="flex place-content-center">
                                <Notification/>
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
                    props.status !== '404' && props.children
                }
                {
                    (props.status === 'draft' || props.status === "update" || props.status === 'create') && (
                        <div className="z-30 w-full flex flex-row gap-4 place-content-center items-center p-4 fixed bottom-0 bg-zinc-100 dark:bg-gray-800 border-t-2 border-t-gray-200 dark:border-t-gray-700">
                            {
                                (props.status === 'draft' || props.status === '404') && (
                                    <div className="w-1/2">
                                        <Link href={ props.detailFeature === 'btb' ? "/eca/btb/action" : '/eca/claims/action'}>
                                            <div className="select-none cursor-pointer flex place-content-center px-2 py-2 bg-blue-400 hover:bg-blue-500 rounded-full text-xs xl:text-base font-semibold text-white">
                                                Add New {props.detailFeature === 'btb' ? 'BTB' : "Claim"} 
                                            </div>
                                        </Link>
                                    </div>
                                )
                            }

                            {
                                props.status !== '404' && (
                                    <div className={props.status === 'create' ? 'w-full' : 'w-1/2'} onClick={() => props.onSubmitClick()}>
                                        <Button size='flex' className='select-none py-2 bg-green-400 hover:bg-green-500 text-white text-xs xl:text-base' isLoading={props.isSubmitLoading}>{props.status === 'draft' || props.status === 'create' ? 'Submit'  : 'Update'} {props.detailFeatureFormButton}</Button>
                                    </div>
                                )
                            }
                        </div>
                    )
                }
            </div>
        </>
    )
}

Layout.getInitialProps = async (context) => {
    // const {users} = store.getState()

    const { referer } = context.req.headers 

    let pathReferer = ''
    if (referer !== undefined) {
        let url = new URL(referer)
        pathReferer = url.pathname
    }

    console.log(pathReferer)
}

Layout.propTypes = {
    title: propTypes.string,
    detailId: propTypes.string,
    status: propTypes.string,
    detailFeatureFormButton: propTypes.string,
    detailFeature: propTypes.string,
    isSubmitLoading: propTypes.bool,
    defaultBackPage: propTypes.string,
}

