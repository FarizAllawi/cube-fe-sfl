import {useState, useEffect} from 'react'
import useSWR from 'swr'
import { format } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'

import useBooking from 'pages/api/kch-office/booking'
import useOffice from 'pages/api/kch-office/office'

import useForm from 'helpers/useForm'
import formatDate from 'helpers/formatDate'

import Layout from 'components/kch-office/Layout'
import Select from 'components/kch-office/Forms/Select'
import Button from 'components/kch-office/Button'
import BoxDeskSection from 'components/kch-office/DeskSection'
import CardBookedList from 'components/kch-office/CardBooked'

import NotFoundData from '../../../public/images/svg/kch-office/not-found-data.svg'
import BookingNotFound from '../../../public/images/svg/kch-office/booking-not-found.svg'

export default function HomePage(props) {
    
    const weekDay = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

    const { 
        getBookedList,
        getBookingDeskSection,
        bookingFetcher,
    } = useBooking()

    const { getAllOffice } = useOffice()

    const [bookedList, setBookedList] = useState([])
    const [currentDate, setCurrentDate] = useState(new Date())
    const [deskSection, setDeskSection] = useState([])
    const [officeData, setOfficeData] = useState([])
    const [selectedOffice, setSelectedOffice] = useState({})
    const [selectedDate, setSelectedDate] = useState('')

    const [fetchStatus , setFetchStatus] = useState(false)
    const [toggle, setToggle] = useState('desk')
    const [size, setWindowSize] = useState({
        width: undefined,
		height: undefined,
	})
    
    const [state, setState, newState] = useForm({
        office: '',
        dateSelected: new Date(),
    })
    
    const { getDeskSection } = useSWR(
        selectedOffice?.uid_office !== undefined && selectedDate !== undefined ? 
            `/api/booking/office/${selectedOffice?.uid_office}${selectedDate !== null && selectedDate !== '' ? '?date='+selectedDate : ''}`
        : null,
        async (url) => {
            let response = await bookingFetcher(url)
            setDeskSection(response)
            return response
        },

        { revalidateOnFocus: true, refreshWhenHidden: false, refreshWhenOffline: false, refreshInterval: 10000 }
    )

    const changeOffice = async (event) => {

        let uid =  event.target.value.split('=')[0]
        newState({ office: event.target.value })

        if (parseInt(uid) !== parseInt(selectedOffice.uid_office)) {
            officeData.map(async (item, index) => {
                if (parseInt(item.uid_office) === parseInt(uid)) {
                    setSelectedOffice(item)
                }
            })
        }
        
    }

    const changeDate = async (event) => {
        let bookingDeskSection = await getBookingDeskSection(selectedOffice.uid_office, format(event.target.value, 'yyyy-MM-dd'))
        newState({ dateSelected: event.target.value })
        setSelectedDate(format(event.target.value, 'yyyy-MM-dd'))
        setDeskSection(bookingDeskSection)
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

        const fetchData = async () => {
            let bookingList = await getBookedList()
            let officeData = await getAllOffice()

            if (officeData.length > 0) {
                let uid = officeData[0]?.uid_office
                let office = {}

    
                officeData.map((item, index) => {
                    if (item.uid_office === uid) {
                        office = item
                        newState({ office: `${item.uid_office}=${item.office_name}`})
                    }
                })

                setSelectedDate(format(new Date(), 'yyyy-MM-dd'))
                setBookedList(bookingList)
                setSelectedOffice(office)
                setOfficeData(officeData) 
            }       
        }

         // Handler to call on window resize
		const handleResize = () => {
			// Set window width/height to state
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			})
		}


        if (!fetchStatus) {
            fetchData()
            handleResize()
            setFetchStatus(true)
        }

        window.addEventListener("resize", handleResize)
        // setMounted(true)

        return () => {
            window.removeEventListener("resize", handleResize)
        }

    }, [bookingFetcher, fetchStatus, getAllOffice, getBookedList, newState])

    return (
        <Layout>
            <div className="w-full flex flex-col xl:flex-row">
                    <div className="w-full xl:w-1/2 flex lg:flex-row">
                        <div className="text-xl sm:text-3xl md:text-4xl 2xl:text-5xl md:my-4 2xl:mt-4 pt-4 pb-3 2xl:pb-8 font-bold">
                            <div className='text-green-500'>CHOOSE</div>
                            <div className='text-green-700'>BOOK</div>
                            <div className='text-green-900'>ENJOY YOUR DESK</div>
                        </div>
                    </div>
                    <div className="w-full xl:w-1/2 h-48 xl:h-44 2xl:h-48 lg:mt-4 2xl:mt-4 px-4 py-4 flex flex-col bg-green-900 rounded-3xl">
                        <div className="w-full flex flex-row place-content-center items-center">
                            <div className="w-2/3 sm:w-1/2 flex z-10">
                                <div className="w-full xl:w-3/4">
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
                            <div className="w-1/3 sm:w-1/2 text-right">
                                {/* <Link href="/kch-office/history">
                                    <div className="cursor-pointer text-xs sm:text-sm underline underline-offset-2 text-white font-medium">Booking history</div>
                                </Link> */}
                            </div>
                        </div>

                        {
                            bookedList.length > 0 ? (
                                <div className="static scroll-display-none w-full h-full mt-4 flex flex-row gap-4 overflow-x-scroll snap-x">
                                {
                                    bookedList.map((item, index) => {
                                        return (
                                            <div key={index} className='snap-start'>
                                                <CardBookedList data={item} />
                                            </div>
                                        )
                                    })
                                }
                                </div>
                            ) : (
                                <div className="w-full h-full flex flex-row place-content-center">
                                    <div className="w-1/3 flex place-content-end">
                                        <BookingNotFound className='w-36 h-36'/>
                                    </div>
                                    <div className="w-1/2 ml-4 h-full flex flex-col place-content-center">
                                        <div className="text-sm sm:text-base text-white font-medium">
                                            You seem not booked a desk yet
                                        </div>
                                    </div>      
                                </div>
                            )
                        }
                    </div>
                </div>
                <div className="w-full h-full flex flex-col lg:my-0 xl:flex-row">
                    <div className="w-full xl:w-7/12 flex flex-col">
                        <div className="w-full mt-4 mb-4 md:mb-10 lg:mb-6 xl:mb-6 xl:-mt-1 sm:mt-2 z-40 flex flex-row">
                            <div className="w-5/12 sm:w-1/3 xl:w-1/4">
                                <Select name="dateSelected"
                                        placeholder="Select Date"
                                        value={ weekDay[state.dateSelected.getDay()-1] }
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
                                        <Button type={toggle === 'desk' ? 'primary' : 'secondary'} size='small' className='border-2 bg-green-900 border-green-900' onClick={() => setToggle('desk')}>Desk Section</Button>
                                        <Button type={toggle === 'maps' ? 'primary' : 'secondary'} size='small' onClick={() => setToggle('maps')}>Show Maps</Button>
                                    </div>
                                )
                            }
                            
                        </div>
                        {
                            (size.width >= 1280 || toggle === 'desk') && (
                                <div className="w-full flex place-content-center xl:place-content-start items-center">
                                    {
                                        deskSection?.length > 0 ? (
                                            <div className="w-full sm:w-3/4 md:w-9/12 xl:w-8/12 2xl:w-7/12 grid grid-cols-4 xl:grid-cols-5 auto-rows-max gap-4 md:gap-6 xl:gap-4">
                                            {
                                                deskSection?.map((item, index) => {
                                                    return (
                                                        <BoxDeskSection key={index} data={item} selectedDate={selectedDate} />
                                                    )
                                                })
                                            }
                                            </div>
                                        ) : (
                                            <div className="w-full flex flex-col place-content-center items-center xl:items-start gap-2">
                                                <NotFoundData className='w-96 h-72 mx-20 mt-6' />
                                                <div className="mx-40 w-56 text-center text-green-900 font-medium">oops, looks like we cant show you the desk section</div>
                                            </div>
                                        )
                                    }  
                                </div>
                            )
                        }
                    </div>
                    {
                        (size.width >= 1280 || toggle === 'maps') && selectedOffice.office_sketch !== undefined && (
                            <div className="relative w-full h-80 sm:h-96 xl:h-full xl:w-5/12 xl:mt-4 2xl:mt-2">
                                <Image  loader={imageLoader} 
                                        src={`${ process.env.NEXT_PUBLIC_API_STORAGE}/files/get?filePath=${selectedOffice.office_sketch}`} 
                                        className="object-fit sm:object-contain xl:object-fill w-full h-full"
                                        priority={true}
                                        quality={100}
                                        fill
                                        alt="Office Sketch" />
                            </div>
                        )
                    }
                </div>
                
                <div className="w-full py-2 text-xs text-center xl:text-left xl:text-sm font-medium text-black text-opacity-50 bottom-0 bg-white">
                    Created With ❤️ Made By Talent Kampus Merdeka Batch 3
                </div>
        </Layout>
    )
}