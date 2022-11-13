import {useState, useEffect} from 'react'
import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link'

import useBooking from 'pages/api/kch-office/booking'
import useOffice from 'pages/api/kch-office/office'
import useDesk from 'pages/api/kch-office/desk'

import useForm from 'helpers/useForm'
import formatDate from 'helpers/formatDate'

import Select from 'components/kch-office/Forms/Select'
import Button from 'components/kch-office/Button'
import Navbar from 'components/kch-office/Navbar'
import BoxDeskSection from 'components/kch-office/DeskSection'
import CardBookedList from 'components/kch-office/CardBooked'

export default function HomePage(props) {
    
    const { getDeskSectionToday } = useBooking()
    const { getDeskSectionByOffice } = useDesk()
    const { getAllOffice } = useOffice()

    const [currentDate, setCurrentDate] = useState(new Date())
    const [officeData, setOfficeData] = useState([])
    const [deskSection, setDeskSection] = useState([])
    const [selectedOffice, setSelectedOffice] = useState({})
    const [fetchStatus , setFetchStatus] = useState(false)
    const [toggle, setToggle] = useState('desk')
    const [size, setWindowSize] = useState({
        width: undefined,
		height: undefined,
	})

    const [state, setState, newState] = useForm({
        office: '',
        dateSelected: '',
    })

    const changeOffice = async (event) => {

        let uid =  event.target.value.split('=')[0]
        newState({ office: event.target.value })

        if (event.target.value.split('=')[0] !== selectedOffice.uid_office) {
            officeData.map(async (item, index) => {
                if (parseInt(item.uid_office) === parseInt(uid)) {
                    let data = await getDeskSectionByOffice(uid)
                    setDeskSection(data)
                    setSelectedOffice(item)
                }
            })
        }
        
    }

    const changeDate = async (event) => {
        // newState({ dateSelected: event.target.value })
        console.log(event.target.value)
    }

    const getDeskSection = async (uidOffice = null) => {

        let officeData = await getAllOffice()
        let uid = uidOffice === null ? officeData[0].uid_office : uidOffice

        if (officeData.length > 0) {
            let data = await getDeskSectionByOffice(uid)
            let office = {}

            officeData.map((item, index) => {
                if (item.uid_office === uid) {
                    office = item
                    newState({ office: `${item.uid_office}=${item.office_name}`})
                }
            })

            setSelectedOffice(office)
            setDeskSection(data)
            setOfficeData(officeData) 
        }       
    }

    const GetSelectOptionDate = (day) => {
        let date = new Date()

        if (day === 'monday') {
            let monday = date.getDay() === 1 ? date : date.getDay() > 1 ? new Date(date.setDate(date.getDate() - date.getDay() + 7 + 1)) : new Date(date.setDate(date.getDate() - date.getDay() + 1))
            return monday
        }
        else if (day === 'tuesday') {
            let tuesday = date.getDay() === 2 ? date : date.getDay() > 2 ? new Date(date.setDate(date.getDate() - date.getDay() + 7 + 2)) : new Date(date.setDate(date.getDate() - date.getDay() + 2))
            return tuesday
        }
        else if (day === 'wednesday') {
            let wednesday = date.getDay() === 3 ? date : date.getDay() > 3 ? new Date(date.setDate(date.getDate() - date.getDay() + 7 + 3)) : new Date(date.setDate(date.getDate() - date.getDay() + 3))
            return wednesday
        }
        else if (day === 'thursday') {
            let thursday = date.getDay() === 4 ? date : date.getDay() > 4 ? new Date(date.setDate(date.getDate() - date.getDay() + 7 + 4)) : new Date(date.setDate(date.getDate() - date.getDay() + 4))
            return thursday
        }
        else if (day === 'friday') {
            let friday = date.getDay() === 5 ? date : date.getDay() > 5 ? new Date(date.setDate(date.getDate() - date.getDay() + 7 + 5)) : new Date(date.setDate(date.getDate() - date.getDay() + 5))
            return friday
        }
    }

    const imageLoader = ({src}) => {
        return src
    }

    useEffect(() => {

        if (!fetchStatus) {
            getDeskSection()
            setFetchStatus(true)
        }

         // Handler to call on window resize
		const handleResize = () => {
			// Set window width/height to state
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			})
		}

        window.addEventListener("resize", handleResize)
        handleResize()

        return () => {
            window.removeEventListener("resize", handleResize)
        }

    }, [toggle, state.office, fetchStatus, selectedOffice])

    console.log(size)

    return (
        <>
            <Head>
                <title>KCH OFFICE</title>
            </Head>
            <div className="w-screen h-screen max-h-screen flex flex-col select-none">
                <Navbar />
                <div className="w-full flex flex-col xl:flex-row px-6 lg:px-12 mt-2 pt-20 pb-4 2xl:pt-20">
                    <div className="w-full xl:w-1/2 flex lg:flex-row">
                        <div className="text-xl sm:text-3xl md:text-4xl 2xl:text-5xl md:my-4 2xl:mt-4 pt-4 pb-3 2xl:pb-8 font-bold">
                            <div className='text-green-500'>CHOOSE</div>
                            <div className='text-green-700'>BOOK</div>
                            <div className='text-green-900'>ENJOY YOUR DESK</div>
                        </div>
                    </div>
                    <div className="w-full xl:w-1/2 h-48 xl:h-44 2xl:h-48 lg:mt-4 2xl:mt-4 px-4 py-4 flex flex-col bg-green-900 rounded-3xl">
                        <div className="w-full flex flex-row place-content-center items-center">
                            <div className="w-3/4 sm:w-1/2 flex z-10">
                                <div className="w-4/4 xl:w-3/4 flex">
                                    <Select name="officeId"
                                            className="py-1 xl:py-1 text-sm bg-white text-green-900"
                                            placeholder="Select Office"
                                            value={state.office.split('=')[1]}
                                            onClick={changeOffice}>
                                        {
                                            officeData?.map((data, index) => {
                                                return (
                                                    <option key={index} value={`${data.uid_office}=${data.office_name}`}>{data.office_name}</option>
                                                )
                                            })
                                        }
                                    </Select>
                                </div>
                            </div>
                            <div className="w-1/4 sm:w-1/2 text-right">
                                <Link href="/kch-office/history">
                                    <div className="cursor-pointer text-xs sm:text-sm underline underline-offset-2 text-white font-medium">Booking history</div>
                                </Link>
                            </div>
                        </div>

                        <div className="scroll-display-none w-full h-full mt-4 flex flex-row gap-4 overflow-x-scroll snap-x">
                            <div className='snap-start'>
                                <CardBookedList  />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full h-full flex flex-col lg:my-0 md:my-4 xl:flex-row px-6 lg:px-12 pb-6 2xl:pb-0">
                    <div className="w-full xl:w-7/12 flex flex-col">
                        <div className="w-full mt-2 mb-4 md:mb-10 lg:mb-6 xl:mb-6 xl:-mt-4 sm:mt-2 z-40 flex flex-row">
                            <div className="w-5/12 sm:w-1/3 xl:w-1/4">
                                <Select name="dateSelected"
                                        placeholder="Select Date"
                                        value={state.dateSelected}
                                        onClick={changeDate}>

                                    <option value={GetSelectOptionDate('monday')} >
                                        <div className="w-full flex flex-col hover:text-white">
                                            <div className='w-full text-opacity-100 font-semibold' style={{ fontSize: "11px"}}>Monday {currentDate.getDay() === 1 ? '- Today' : currentDate.getDay() > 1 ? '- Next Week' : ''}</div>
                                            <div className='w-full'>{formatDate(GetSelectOptionDate('monday'))}</div>
                                        </div>
                                    </option>
                                    <option value={GetSelectOptionDate('tuesday')} >
                                        <div className="w-full flex flex-col hover:text-white">
                                            <div className='w-full text-opacity-100 font-semibold' style={{ fontSize: "11px"}}>Tuesday {currentDate.getDay() === 2 ? '- Today' : (currentDate.getDay() + 1) === 2  ?  '- Tomorrow' : currentDate.getDay() > 2 ? '- Next Week' :  ''}</div>
                                            <div className='w-full'>{formatDate(GetSelectOptionDate('tuesday'))}</div>
                                        </div>
                                    </option>
                                    <option value={GetSelectOptionDate('wednesday')} >
                                        <div className="w-full flex flex-col hover:text-white">
                                            <div className='w-full text-opacity-100 font-semibold' style={{ fontSize: "11px"}}>Wednesday {currentDate.getDay() === 3 ? '- Today' : (currentDate.getDay() + 1) === 3 ?  '- Tomorrow' : currentDate.getDay() > 3 ? '- Next Week' :  ''}</div>
                                            <div className='w-full'>{formatDate(GetSelectOptionDate('wednesday'))}</div>
                                        </div>
                                    </option>
                                    <option value={GetSelectOptionDate('thursday')} >
                                        <div className="w-full flex flex-col hover:text-white">
                                            <div className='w-full text-opacity-100 font-semibold' style={{ fontSize: "11px"}}>Thursday {currentDate.getDay() === 4 ? '- Today' : (currentDate.getDay() + 1) === 4 ?  '- Tomorrow' : currentDate.getDay() > 4 ? '- Next Week' :  ''}</div>
                                            <div className='w-full'>{formatDate(GetSelectOptionDate('thursday'))}</div>
                                        </div>
                                    </option>
                                    <option value={GetSelectOptionDate('friday')} >
                                        <div className="w-full flex flex-col hover:text-white">
                                            <div className='w-full text-opacity-100 font-semibold' style={{ fontSize: "11px"}}>Friday {currentDate.getDay() === 5 ? '- Today' : (currentDate.getDay() + 1) === 5 ?  '- Tomorrow' : currentDate.getDay() > 5 ? '- Next Week' :  ''}</div>
                                            <div className='w-full'>{formatDate(GetSelectOptionDate('friday'))}</div>
                                        </div>
                                    </option>
                                </Select>
                            </div>

                            {
                                size.width < 1280 && (
                                    <div className="w-2/3 flex flex-row place-content-end items-center gap-1">
                                        <Button type={toggle === 'desk' ? 'primary' : 'secondary'} size='small' onClick={() => setToggle('desk')}>Desk Section</Button>
                                        <Button type={toggle === 'maps' ? 'primary' : 'secondary'} size='small' onClick={() => setToggle('maps')}>Show Maps</Button>
                                    </div>
                                )
                            }
                            
                        </div>
                        {
                            (size.width > 1280 || toggle === 'desk') && (
                                <div className="w-full flex place-content-center xl:place-content-start items-center">
                                    <div className="w-full sm:w-3/4 md:w-9/12 xl:w-6/12 2xl:w-7/12 grid grid-cols-4 xl:grid-cols-5 auto-rows-max gap-3 sm:gap-3 md:gap-6 xl:gap-4">
                                        {
                                            deskSection?.map((item, index) => {
                                                return (
                                                    <BoxDeskSection key={index} data={item} />
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    {
                        (size.width > 1280 || toggle === 'maps') && (
                            <div className="relative w-full h-80 sm:h-96 xl:h-full xl:w-5/12 xl:mt-0 2xl:-mt-3">
                                <Image  loader={imageLoader} 
                                        src={`${ process.env.NEXT_PUBLIC_API_STORAGE}files/get?filePath=${selectedOffice.office_sketch}`} 
                                        className="object-fit sm:object-contain xl:object-fill  w-full h-full"
                                        priority={true}
                                        quality={100}
                                        fill
                                        sizes=" (max-width: 1280px) 100vw,
                                                (max-width: 1200px) 50vw,
                                                33vw"
                                        alt="Office Sketch" />
                            </div>
                        )
                    }
                </div>
                
                <div className="w-full px-12 py-2 text-xs text-center xl:text-left xl:text-sm font-medium text-black text-opacity-50 bottom-0 bg-white">
                    Created With ❤️ Made By Kampus Merdeka Batch 3
                </div>

            </div>
        </>
    )
}