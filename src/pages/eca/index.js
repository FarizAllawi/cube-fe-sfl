import { useState , useEffect, useCallback } from 'react'
import { useTheme  } from 'next-themes'
import Head from 'next/head'
import Link from 'next/link'

import Navbar from 'components/eca/Navbar'

import slugify from 'helpers/slugify'

import useUserCube from 'pages/api/user'
import useUserEca from 'pages/api/eca/user'
import useNotification from 'pages/api/eca/notification'

import ClaimDark from '/public/images/svg/eca/claim-dark.svg'
import ClaimLight from '/public/images/svg/eca/claim-light.svg'
import BTBDark from '/public/images/svg/eca/btb-dark.svg'
import BTBLight from '/public/images/svg/eca/btb-light.svg'
import ApproveDark from '/public/images/svg/eca/approve-dark.svg'
import ApproveLight from '/public/images/svg/eca/approve-light.svg'
import RatingDark from '/public/images/svg/eca/rating-dark.svg'
import RatingLight from '/public/images/svg/eca/rating-light.svg'
import FaqDark from '/public/images/svg/eca/faq-dark.svg'
import FaqLight from '/public/images/svg/eca/faq-light.svg'
import ContactDark from '/public/images/svg/eca/contact-dark.svg'
import ContactLight from '/public/images/svg/eca/contact-light.svg'


function CardApplication(props) {

	const Card = () => {
		return (
			<>
				<div className="flex w-24 h-32 place-content-center items-center  rounded-full drop-shadow-sm ">
					{
						props.icon
					}
				</div>
				<div className="flex px-3 py-2 place-content-center ">
					<p className='font-bold text-zinc-900 dark:text-white text-center text-sm xl:text-lg'>{ props.name }</p>
				</div>
			</>
		)
	}

	return (
		<>
		{
			props.name !== 'Contact Us' ? (
				<Link href={`/eca/${slugify(props.name)}`} className="w-1/3 flex flex-col place-content-center items-center p-2 bg-white dark:bg-gray-700 drop-shadow-md hover:drop-shadow-sm rounded-3xl cursor-pointer">
					<Card />
					{
						props.countNotification !== undefined && props.countNotification > 0 && (

							<div className="absolute flex h-7 w-7 -top-1 -right-1">
								{/* <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></div> */}
								<div className="flex place-content-center items-center text-center rounded-full h-7 w-7 bg-red-500 text-white" style={{ fontSize: "10px"}}>
									{props.countNotification}
								</div>
							</div>
						)
					}
				</Link>
			) : (
				<Link rel="noopener noreferrer" href="https://wa.me/6285717710735" className='w-1/3 flex flex-col place-content-center items-center p-1.5 bg-white dark:bg-gray-700 drop-shadow-md hover:drop-shadow-sm rounded-3xl cursor-pointer' target="_blank">
					<Card />
				</Link>
			)
		}
		</>
	)
}

export default function Home(props) {

	const [size, setWindowSize] = useState({
        width: undefined,
		height: undefined,
	})

	const [ homeNotification , setHomeNotification ] = useState([])
	const [ homeNotificationTemp, setHomeNotificationTemp] = useState({})
	const [ user, setUser] = useState(false)

	const [fetchStatus, setFetchStatus] = useState(false)
	const [mounted, setMounted] = useState(false)

	const {theme, setTheme} = useTheme()
	const { getDetailUser } = useUserCube()
	const { login } = useUserEca()
	const { getHomeNotification } = useNotification() 

	const fetchData = useCallback( async () => {
		let userData = await getDetailUser()
		let syncUser = await login({ email: userData.email, password: userData.password})
		let homeNotif = await getHomeNotification(userData.nik)

		let temp = {}
		homeNotif.map(item => {
			temp[`${item.status_approval}`] = item	
		})

		setHomeNotificationTemp(temp)
		setFetchStatus(true)
	}, [getDetailUser, getHomeNotification, login])

    useEffect(() => {
		if (homeNotification.length == 0 && !fetchStatus) fetchData()

        // Handler to call on window resize
		const handleResize = () => {
			// Set window width/height to state
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			})
		}

        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
        }

    }, [fetchData, fetchStatus, homeNotification])
	// if (!mounted) return null

	return (
		<div className="w-screen h-screen bg-stone-50 dark:bg-gray-900">
			<Head>
				<title>{process.env.NEXT_PUBLIC_APP_LONG_NAME}</title>	
			</Head>
			<Navbar />
			<div className="w-full flex flex-col px-3 lg:px-4 gap-4 pt-20">

				<div className="w-full h-24 flex flex-row place-content-center items-center p-2.5 gap-2 bg-blue-300 drop-shadow-sm rounded-3xl">

					{/* <div className="w-1/3 lg:w-1/5  flex flex-col xl:gap-1 px-2 py-4 bg-white rounded-2xl">
						{
							size.width <= 1024 ? (
								<>
									<p className="w-full font-semibold text-xs dark:text-zinc-900" style={{ fontSize: "10px"}}>On Progress</p>
									<p className="w-full font-bold dark:text-zinc-900" style={{ fontSize: "9px"}}>IDR 2.000.000.000</p>
								</> 
							) : (
								<>
									<p className="w-full font-semibold text-xs dark:text-zinc-900" >On Progress</p>
									<p className="w-full font-bold text-xs dark:text-zinc-900">IDR 2.000.000.000</p>
								</>
							)
						}
					</div> */}
					

				</div>

				<div className="w-full flex flex-col xl:flex-row md:px-32 xl:px-0 gap-2">
					<div className="w-full xl:w-1/2 flex flex-row place-content-center items-center gap-2">
						<CardApplication name="Claims" icon={theme === 'dark' ? <ClaimDark className="w-full h-full p-2" /> : <ClaimLight className="w-full h-full p-2" />}/>
						<CardApplication name="BTB" icon={theme === 'dark'  ? <BTBDark className="w-full h-full p-2" /> : <BTBLight className="w-full h-full p-2" />} />
						<CardApplication name="Approval" countNotification={homeNotificationTemp['home-approval']?.count_approval !== undefined  && homeNotificationTemp['home-approval'].count_approval} icon={theme === 'dark' ? <ApproveDark className="w-full h-full p-2" /> : <ApproveLight className="w-full h-full p-2" /> }/>
						
					</div>

					<div className="w-full xl:w-1/2 flex flex-row place-content-center items-center gap-2">
						<CardApplication name="Rating" icon={theme === 'dark' ? <RatingDark className="w-full h-full p-2 fill-yellow-400" /> : <RatingLight className="w-full h-full p-2 fill-yellow-400" />} />
						<CardApplication name="FAQ" icon={theme === 'dark' ? <FaqDark className="w-full h-full p-2" /> : <FaqLight className="w-full h-full p-2" />} />
						<CardApplication name="Contact Us" icon={theme === 'dark' ? <ContactDark className="p-2 w-full h-full " /> : <ContactLight className="p-2 w-full h-full" />} />
					</div>
				</div>

			</div>
		</div>
	)
}