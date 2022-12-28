import { toast } from 'react-toastify'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import Image from 'next/image'
import { addDays, subDays , format, set, sub } from 'date-fns'

import useUser from 'pages/api/user'
import useDesk from 'pages/api/kch-office/desk'
import useBooking from 'pages/api/kch-office/booking'
import useOffice from 'pages/api/kch-office/office'

import { getDay, formatDate } from 'helpers/dayHelper'

import Layout from "components/kch-office/Layout"
import ProfileInitial from 'components/kch-office/ProfileInitial'
import Calendar from 'components/kch-office/Calendar'
import Modals from 'components/kch-office/Modals'
import Button from 'components/kch-office/Button'

import CalendarIcon from '../../../../public/images/svg/kch-office/calendar-icon.svg'
import OfficeIcon from '../../../../public/images/svg/kch-office/office-icon.svg'
import ChevronLeft from '../../../../public/images/svg/kch-office/chevron-left.svg'
import ChevronRight from '../../../../public/images/svg/kch-office/chevron-right.svg'
import DeskIcon from '../../../../public/images/svg/kch-office/desk-icon.svg'
import TrashIcon from '../../../../public/images/svg/kch-office/trash-icon.svg'
import NotFoundData from '../../../../public/images/svg/kch-office/not-found-data.svg'

function getDataRow(row, data) {
    const column = Math.ceil(data.length / row)
    let row1 = [], row2 = []

    let dataRow = 1
    let dataColumn = 0
    data.map (item => {
        if (dataColumn === column) dataRow += 1
        dataColumn += 1
        switch(dataRow) {
            case 1 : {
                row1.push(item)
                break
            }
            case 2 : {
                row2.push(item)
                break
            }
        }
    })

    return  {
        dataRow1: row1, dataRow2: row2
    }
}

export async function getServerSideProps(context) {
    const {id} = context.query
    const {date} = context.query

    return {
        props: {
            uidDeskSection: id,
            selectedDate: date !== undefined ? date : null
        }, // will be passed to the page component as props
    }
}

export default function DeskSection(props) {

    const router = useRouter()

    const { user, getUser } = useUser()
    const { 
        getDeskSectionById, 
        selectedDeskSection, 
        setSelectedDeskSection, 
    } = useDesk()

    const {
        insertBookingDesk,
        cancelBookingDesk,
        bookingFetcher,
        getBookedList,
        getBookingByDesk
    } = useBooking()

    const {
        getOfficeById
    } = useOffice()

    const [office, setOffice] = useState({})
    // const [uidDeskSection, setUidDeskSection] = useState(props.uidDeskSection)

    const [desk, setDesk] = useState({})
    const [selectedDate, setSelectedDate] = useState(new Date())

    const [submitBooking, setSubmitBooking] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedDesk, setSelectedDesk] = useState({})
    const [bookedDesk, setBookedDesk] = useState([])
    const [getBookedDesk, setGetBookedDesk] = useState([])
    const [bookedList, setBookedList] = useState([])
    const [deleteBooking, setDeleteBooking] = useState('')

    const [showCalendar, setShowCalendar] = useState(false)
    const [modalsBooking, setModalsBooking] = useState(false)
    const [selectedBookingDate, setSelectedBookingDate] = useState({startDate: new Date(), endDate: new Date()})
    const [disableDate, setDisableDate] = useState([])
    const [fetch , setFetch] = useState(false)
    // const [mounted, setMounted] = useState(false)


    const { getDesk } = useSWR(  
        selectedDesk.uid_dk !== undefined && selectedDate !== undefined ? 
            `/api/booking/desk/${selectedDesk.uid_dk}?date=${format(selectedDate, 'yyyy-MM-dd')}`
        : null,

        async (url) => {
            let response = await bookingFetcher(url)

            // Validate Booked Desk if change from swr
            if (response.length !== getBookedDesk.length) {
                let disableDateContent = []

                response.map((item) => {
                    disableDateContent.push({
                        date: new Date(item.bookdt),
                        content: GetBookedContent(item.user)
                    })
                })

                setGetBookedDesk(bookedDesk)
                setDisableDate(disableDateContent)
            }

            setBookedDesk(response)
            return response
        },

        { revalidateOnFocus: false, refreshWhenHidden: false, refreshWhenOffline: false, refreshInterval: 7000 }
    )

    const { getBookedDeskSection } = useSWR( 
        selectedDeskSection.uid_ds !== undefined ? 
            `/api/booking/desk-section/${selectedDeskSection.uid_ds}${selectedDate !== '' ? '?date='+format(selectedDate, 'yyyy-MM-dd') : ''}`
        : null,

        async (url) => {
            let response = await bookingFetcher(url)
            setDesk(getDataRow(2, response))
            return response
        },

        { revalidateOnFocus: true ,refreshWhenHidden: false, refreshWhenOffline: false, refreshInterval: 10000 }
    )

    const [size, setWindowSize] = useState({
        width: undefined,
		height: undefined,
	})
    
    const bookingDesk = async () => {

        let startDate = selectedBookingDate?.startDate
        let endDate = selectedBookingDate?.endDate === undefined ? startDate :  selectedBookingDate?.endDate
        let disableDate = selectedBookingDate?.disable 
        let currentDate = new Date()

        // Validate Booking Request
        if (startDate !== undefined && endDate !== undefined && 
            format(startDate, 'yyyy-MM-dd') !== format(currentDate, 'yyyy-MM-dd') &&
            format(endDate, 'yyyy-MM-dd') !== format(currentDate, 'yyyy-MM-dd')) {

            let error = []
            let timer = 1000

            const id = toast.loading("Processing your booking...")
            
            setTimeout(() => {
                toast.update(id, { render: "Processing your booking...", type: "info", isLoading: true });
            }, timer)

            // Booking Process
            while (startDate <= endDate) {
                let disable = false
                let message = ""
                let type = ""

                // if (disableDate !== undefined && disableDate.indexOf(startDate)) disable = true
                if (disableDate !== undefined) {
                    disableDate.map(item => {
                        if (format(startDate, 'yyyy-MM-dd') === format(item, 'yyyy-MM-dd')) disable = true
                    })
                }
                
                // Check if user already booking desk in booked list
                if (bookedList.length > 0) {
                    bookedList.map((item) => {
                        if (format(new Date(item.bookdt), 'yyyy-MM-dd') === format(startDate, 'yyyy-MM-dd')) {
                            message = `Cannot process your booking. Please cancel your booking first on desk ${item.office.desk_name} ${getDay(new Date(startDate))}, ${formatDate(new Date(startDate))}`
                            type = "warning"
                            disable = true
                        }
                    })
                }

                if (!disable) {
                    let data = await getBookingByDesk(selectedDesk.uid_dk, format(startDate, 'yyyy-MM-dd'))
    
                    if (data.length > 0) {
                        message = `Cannot process your booking on ${getDay(new Date(startDate))}, ${formatDate(new Date(startDate))}`
                        type = "warning"
                    }
                    else {
                        let booking = await insertBookingDesk({
                            uid_dk: selectedDesk.uid_dk,
                            bookdt: format(startDate, 'yyyy-MM-dd'),
                        })
                        
                        if (booking.status >= 400) {
                            message = `Cannot process your booking on ${formatDate(new Date(startDate))}, ${booking.message}`
                            type = "error"
                        }
                        
                        if (booking.status === 200) {
                            message = `Sucess add booking on ${getDay(new Date(startDate))}, ${formatDate(new Date(startDate))}`
                            type = 'success'
                        }
                    }
                }
                
                if (message !== "") {
                    setTimeout(() => {
                        toast.update(id, { 
                            render: message, 
                            type: type, 
                            isLoading: false,
                        });
                    }, timer)
                    timer += 1000
                }
                startDate = addDays(startDate, 1)
            }

            timer+=1000
            setTimeout(() => {

                toast.update(id, { 
                    render: `Booking process finish`, 
                    type: "info", 
                    isLoading: false
                });
            },timer)
            
            
            setTimeout(() => {
                toast.dismiss(id)
            }, timer+=1000)

            setTimeout(() => {
                setIsLoading(false)
                setModalsBooking(false)
                setDisableDate([])
                setSelectedDesk({})
                setBookedDesk([])
                setSelectedBookingDate({
                    startDate: new Date(),
                    endDate: new Date()
                })

                // Fetching new Data
                fetchData()
            }, timer+=500)
        }
        else {
            toast.info("Chose your booking date first")
            setTimeout(() => {setIsLoading(false)}, 350)

        }

        // setSubmitBooking(false)
    }

    const cancelBooking = async (uid_booking) => {
        let cancel = await cancelBookingDesk(uid_booking)
        if (cancel >= 400) toast.error("Oops, we can not process your request please try again")
        else toast.success("Your booking was canceled")

        setDeleteBooking('')
        fetchData()
    }

    const changeDate = async (event) => {
        const { id } = router.query
        setSelectedDate(event.target.value)
        setSelectedDesk({})
        setShowCalendar(false)
        // router.push(`/kch-office/desk-section/${id}?date=${format(event.target.value , 'yyyy-MM-dd')}`)
    }

    const imageLoader = ({src}) => {
        return src
    }

    const GetBookedContent = (user) => {
        return (
            <>
                <div className="relative flex w-7 h-7  xl:w-10 xl:h-10 p-0.5 place-content-center items-center border-2 border-green-900 rounded-full">
                    {
                        user.photo === null || user.photo === undefined ? (
                            <ProfileInitial name={user?.name} width="full" height="full" className='text-xs xl:text-sm'/>
                        ) : (
                            <Image  fill
                                    loader={imageLoader}
                                    src={`${process.env.NEXT_PUBLIC_API_STORAGE}files/get?filePath=${user.photo}`} 
                                    className="object-contain rounded-full" 
                                    alt="profile-image"/>
                        )

                    }
                </div>
            </>
        )
    }

    const selectDesk = async (deskItem) => {
        // Check if user already book desk

        let bookedItem = {}
        let isBooked = false
        desk?.dataRow1.map(item => {
            if (item.uid_user === user.uid_user) {
                isBooked = true
                bookedItem = item
                // setAlreadyBooked(true)
            }
        })

        desk?.dataRow2.map(item => {
            if (item.uid_user === user.uid_user) {
                isBooked = true
                bookedItem = item
                // setAlreadyBooked(true)
            }
        })

        setSelectedDesk(deskItem)

        // Set Disable date
        let disableDateContent = []
        let fetchBookedDate = await getBookingByDesk(deskItem.uid_dk, format(new Date(), 'yyyy-MM-dd'))
        
        if (fetchBookedDate) {
            fetchBookedDate.map( (item, index) => {
                disableDateContent.push({
                    date: new Date(item.bookdt),
                    content: GetBookedContent(item.user)
                })
            })

            setGetBookedDesk(fetchBookedDate)
            setDisableDate(disableDateContent)
            setModalsBooking(true)
        }
    }

    
    const fetchData = useCallback(async () => {
        const id = props.uidDeskSection
        const date = props.selectedDate === null ? selectedDate !== '' ? selectedDate : new Date() : new Date(props.selectedDate)

        let data = await getDeskSectionById(id)
        let listBooking = await getBookedList()

        if (data?.uid_ds !== undefined) {
            let office = await getOfficeById(data.uid_office)
            let list = []

            listBooking.map(item => {
                if (parseInt(item.uid_ds) === parseInt(id) && format(new Date(item.bookdt), 'yyyy-MM-dd') !== format(new Date(), 'yyyy-MM-dd')) list.push(item)
            })

            setOffice(office)
            setSelectedDeskSection(data)
            setBookedList(list)
        }

        if (date !== undefined) {
            setSelectedDate(new Date(date))
        }
    }, [getBookedList, getDeskSectionById, getOfficeById, props, selectedDate, setSelectedDeskSection])

    useEffect(() => {
        
        // Handler to call on window resize
        const handleResize = () => {
            // Set window width/height to state
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            })
        }

        if (!fetch) {
            fetchData()
            setFetch(true)
            handleResize()

        }

        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
        }

    },[fetch, fetchData])

    return (
        <Layout title="KCH Office - Desk Section">
            {
                modalsBooking && (
                    <Modals title={`Desk ${selectedDesk.desk_name}`}
                            caption="Choose the day you want"
                            onClose={() => {
                                setModalsBooking(false)
                                setDisableDate([])
                                setSelectedDesk({})
                                setBookedDesk([])
                                setSelectedBookingDate({
                                    startDate: new Date(),
                                    endDate: new Date()
                                })
                            }}
                            size="medium">
                            <div className="w-full flex flex-col gap-4 px-5 xl:px-10">
                                <Calendar   type='dateRange' 
                                            name="selectedDate" 
                                            value={selectedBookingDate}
                                            onChange={event => setSelectedBookingDate(event.target.value)}
                                            disableDate={disableDate}
                                            disableDay={[0,6]}
                                            minDate={addDays(new Date(), 0)}
                                            maxDate={addDays(new Date(), 7)}
                                            />
                                <Button className="border-2 bg-green-900 border-green-900" 
                                        isLoading={isLoading} 
                                        onClick={() => {
                                            setIsLoading(true)
                                            bookingDesk()
                                        }}>
                                    Book Now
                                </Button>
                            </div>
                    </Modals>
                )
            }

            {
                showCalendar && (
                    <Modals title={`Desk Section ${selectedDeskSection.section_name}`}
                            // caption="Choose date that you want"
                            onClose={() => {
                                setShowCalendar(false)
                            }}
                            size="large">
                            <div className="w-full flex flex-col gap-4 px-5 xl:px-10 pb-5">
                            <Calendar name="selectedDate" value={selectedDate} onChange={changeDate} />
                            </div>
                    </Modals>
                )
            }
            {
                deleteBooking !== '' && (
                    <Modals title={`Cancel Booking`}
                            caption="Are you sure want to cancel this booking?"
                            onClose={() => { setDeleteBooking('') }}
                            size="medium">
                            <div className="w-full h-full flex flex-row place-content-center items-center mt-2">
                                <div className="w-1/2 flex place-content-center items-center gap-2">
                                    <Button type='primary' className="border bg-green-900 border-green-900" size='medium' onClick={() => cancelBooking(deleteBooking)}>YES</Button>
                                    <Button type='primary' className="border bg-green-500 border-green-500" size='medium' onClick={() => setDeleteBooking('') }>NO</Button>
                                </div>
                            </div>
                    </Modals>
                )
            }

            <div className="w-full h-full flex flex-col gap-4 xl:gap-6 items-center">

                <div className="w-full h-auto flex flex-row place-content-center items-center gap-4 mt-6">
                    <div    className="cursor-pointer w-10 h-10 flex place-content-center items-center bg-green-900 hover:bg-opacity-90 rounded-full"
                            onClick={() => setSelectedDate(subDays(selectedDate, 1))}>
                        <ChevronLeft className='p-1' />
                    </div>

                    <div    className="cursor-pointer w-56 h-10 flex flex-row place-content-center items-center rounded-full border-2 border-green-900 xl:bg-green-900 text-green-900 xl:text-white"
                            onClick={() => setShowCalendar(true)}>
                            
                        <div className="w-full p-4 text-sm font-semibold ">
                            {formatDate(new Date(selectedDate))}
                        </div>
                        <div className="w-auto p-4">
                            <CalendarIcon className={`p-0.5 fill-green-900 xl:fill-white`}/>
                        </div>
                    </div>

                    <div    className="cursor-pointer w-10 h-10 flex place-content-center items-center bg-green-900 hover:bg-opacity-90 rounded-full"
                            onClick={() => setSelectedDate(addDays(selectedDate, 1))}>
                        <ChevronRight className='p-1' />
                    </div>
                </div>
                <div className="w-full h-full max-h-screen flex flex-col xl:flex-row pb-10 gap-4">
                    <div className="w-full xl:w-1/2 h-96 xl:h-full flex flex-col xl:px-4">     

                        <div className="w-full h-full p-5 xl:p-10 flex flex-col rounded-3xl bg-green-900">
                            
                            <div className="w-full h-28 pb-2 xl:pb-4 grid grid-flow-col gap-4">
                            {
                                desk?.dataRow1?.map((item , index) => {
                                    return (
                                        <div key={index} className="w-full h-full flex place-content-center items-center">
                                            <div className={`
                                                    relative ${size.width < 390 ? 'w-10 h-10 text-base' : 'w-12 h-12 text-xl xl:text-4xl '}  sm:w-14 sm:h-14  xl:w-24 xl:h-24 flex place-content-center items-center 
                                                    font-semibold text-green-900 cursor-pointer
                                                    ${
                                                        item.desk_status !== 2 ? (
                                                            (item.desk_employee_class === null || parseInt(user.golongan) >= parseInt(item.desk_employee_class)) ? (
                                                                (item.uid_user === null || item.uid_user === '') ? ( 
                                                                    'border-4 border-green-500 border-opacity-40 bg-white bg-opacity-60 hover:bg-green-500'
                                                                ) :  (
                                                                    'border-4 border-green-500 bg-green-500'
                                                                )
                                                            ) : 'border-4 border-white border-opacity-5 bg-red-900 bg-opacity-90'
                                                        ) : 'border-4 border-white border-opacity-5 bg-white bg-opacity-20'   
                                                    }
                                                    rounded-full`
                                                }
                                                onClick={() => item.desk_status !== 2 && user.golongan >= item.desk_employee_class ? selectDesk(item) : ''}>
                                                    {
                                                        item.desk_status !== 0 && item.uid_user !== null && item.uid_user !== '' ? (
                                                            <>
                                                                {
                                                                    item.user.photo_profile === null || item.user.photo_profile === undefined ? (
                                                                        <ProfileInitial name={item.user.name} width="full" height="full" className='text-base sm:text-xl xl:text-3xl'/>
                                                                    ) : (
                                                                        <Image  fill
                                                                                loader={imageLoader}
                                                                                src={`${process.env.NEXT_PUBLIC_API_STORAGE}/files/get?filePath=${item.user.photo_profile}`} 
                                                                                className="object-contain rounded-full" 
                                                                                alt="profile-image"/>
                                                                    )

                                                                }
                                                            </>
                                                        ) : (
                                                            <>{item.desk_name}</>
                                                        )
                                                    }
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            </div>

                            <div className="w-full h-full bg-green-500 rounded-3xl flex flex-col place-content-center items-center">
                                <div className="w-full text-center">
                                    <span className="text-4xl xl:text-5xl text-white">Desk <span className="font-semibold">{selectedDeskSection.section_name}</span></span>
                                </div>
                                <div className="w-full text-center">
                                    <span className="text-xs xl:text-sm text-white">{getDay(new Date(selectedDate))}, {formatDate(new Date(selectedDate))}</span>
                                </div>
                            </div>

                            <div className="w-full h-28 pt-2 xl:pt-4 grid grid-flow-col gap-4">
                            {
                                desk?.dataRow2?.slice(0)?.reverse()?.map((item , index) => {
                                    // if (item.uid_user !== undefined && item.uid_user !== null) setAlreadyBooked(true)
                                    return (
                                        <div key={index} className="w-full h-full flex place-content-center items-center">
                                            <div className={`
                                                    relative ${size.width < 390 ? 'w-10 h-10 text-base' : 'w-12 h-12 text-xl xl:text-4xl '}  sm:w-14 sm:h-14  xl:w-24 xl:h-24 flex place-content-center items-center 
                                                    font-semibold text-green-900 cursor-pointer
                                                    ${
                                                        item.desk_status !== 2 ? (
                                                            (item.desk_employee_class === null || parseInt(user.golongan) >= parseInt(item.desk_employee_class)) ? (
                                                                (item.uid_user === null || item.uid_user === '') ? ( 
                                                                    'border-4 border-green-500 border-opacity-40 bg-white bg-opacity-60 hover:bg-green-500'
                                                                ) :  (
                                                                    'border-4 border-green-500 bg-green-500'
                                                                )
                                                            ) : 'border-4 border-white border-opacity-5 bg-red-900 bg-opacity-90'
                                                        ) : 'border-4 border-white border-opacity-5 bg-white bg-opacity-20'   
                                                    }
                                                    rounded-full`
                                                }
                                                onClick={() => item.desk_status !== 2 && user.golongan >= item.desk_employee_class ? selectDesk(item) : ''}>
                                                    {
                                                        item.desk_status !== 0 && item.uid_user !== null && item.uid_user !== '' ? (
                                                            <>
                                                                {
                                                                    item.user.photo_profile === null || item.user.photo_profile === undefined ? (
                                                                        <ProfileInitial name={item.user.name} width="full" height="full" className='text-base sm:text-xl  xl:text-3xl'/>
                                                                    ) : (
                                                                        <Image  fill
                                                                                loader={imageLoader}
                                                                                src={`${process.env.NEXT_PUBLIC_API_STORAGE}/files/get?filePath=${item.user.photo_profile}`} 
                                                                                className="object-contain rounded-full" 
                                                                                alt="profile-image"/>
                                                                    )

                                                                }
                                                            </>
                                                        ) : (
                                                            <>{item.desk_name}</>
                                                        )
                                                    }
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            </div>
                        </div>

                        <div className="w-full h-8 mt-4 flex flex-row place-content-center items-center gap-1 sm:gap-2">
                            <div className="w-auto flex flex-row gap-1 sm:gap-2 mx-2 xl:mx-4">
                                <div className="w-3 h-3 sm:w-4 sm:h-4 2xl:w-6 2xl:h-6 border-1 sm:border-2 border-green-900 bg-green-900 rounded-full"></div>
                                <div className="absolute w-3 h-3 sm:w-4 sm:h-4 2xl:w-6 2xl:h-6 border-1 sm:border-2 border-green-500 bg-white bg-opacity-60 rounded-full"></div>
                                <div className="text-xs sm:text-sm 2xl:text-base text-black font-medium">Available</div>
                            </div>
                            <div className="w-auto flex flex-row gap-1 sm:gap-2 mx-2 xl:mx-4">
                                <div className="w-3 h-3 sm:w-4 sm:h-4 2xl:w-6 2xl:h-6 border-1 sm:border-2 border-green-900 bg-green-900 rounded-full"></div>
                                <div className="absolute w-3 h-3 sm:w-4 sm:h-4 2xl:w-6 2xl:h-6 border-1 sm:border-2 border-white border-opacity-5 bg-white bg-opacity-30 rounded-full"></div>
                                <div className="text-xs sm:text-sm 2xl:text-base text-black font-medium">Unavailable</div>
                            </div>
                            <div className="w-auto flex flex-row items-center  gap-1 sm:gap-2 mx-2 xl:mx-4">
                                <div className="w-3 h-3 sm:w-4 sm:h-4 2xl:w-6 2xl:h-6 border-1 sm:border-2 border-green-900 bg-green-900 rounded-full"></div>
                                <div className="absolute w-3 h-3 sm:w-4 sm:h-4 2xl:w-6 2xl:h-6 border-1 sm:border-2 border-red-900 border-opacity-10 bg-red-900 rounded-full"></div>
                                <div className="text-center text-xs sm:text-sm 2xl:text-base text-black font-medium">Authorized Desk</div>
                            </div>
                            <div className="w-auto flex flex-row gap-1 sm:gap-2 mx-2 xl:mx-4">
                                <div className="w-3 h-3 sm:w-4 sm:h-4 2xl:w-6 2xl:h-6 border-1 sm:border-2 p-0.5 border-green-500 rounded-full flex place-content-center items-center">
                                    <div className="w-2 h-2 2xl:w-4 2xl:h-4 bg-green-500 rounded-full"></div>
                                </div>
                                <div className="text-xs sm:text-sm 2xl:text-base text-black font-medium">Booked</div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full xl:w-1/2 h-56 flex flex-col gap-4 xl:gap-8 xl:px-6 py-4 xl:py-0">
                        <div className="w-full flex flex-row gap-6">
                            <div className="w-auto">
                                <div className="w-16 h-16 xl:w-20 xl:h-20 flex place-content-center items-center border-2 xl:border-4 border-green-900 rounded-full">
                                    <OfficeIcon className='p-1 xl:p-0' />
                                </div>
                            </div>
                            <div className="w-full flex flex-col place-content-start gap-2 xl:gap-4">
                                <div className="w-auto text-green-900 text-lg xl:text-4xl font-semibold">
                                    { office?.office_name }
                                </div>
                                <div className="w-5/6 xl:w-4/6 text-xs xl:text-sm font-medium">
                                    { office?.address}
                                </div>
                            </div>
                        </div>
                        {
                            bookedList.length > 0 ? (
                                <div className="w-full flex flex-col gap-4 pb-10">
                                    <div className="w-full text-base xl:text-lg text-green-900">Your Booked List</div>
                                    <div className="scroll-display-none w-full h-96 overflow-scroll rounded-b-3xl">
                                        <div className="w-full flex flex-col gap-4 overfolow-y-scroll snap-y">
                                        {
                                            bookedList.map((item, index) => {
                                                return (
                                                    <div key={index} className="snap-start w-full flex flex-row gap-6 p-4 bg-gray-100 bg-opacity-90 rounded-3xl">
                                                        <div className="w-14">
                                                            <div className="w-12 h-12  xl:w-14 xl:h-14 border-2 border-green-900 flex place-content-center items-center rounded-full">
                                                                <DeskIcon className='p-2'/>
                                                            </div>
                                                        </div>
                                                        <div className="w-full flex flex-col gap-1">
                                                            <div className="w-full font-semibold text-green-900">Desk {item.office.desk_name}</div>
                                                            <div className="w-full flex items-center">
                                                                <CalendarIcon className='fill-green-900 p-1'/> 
                                                                <span className='ml-1 text-xs xl:text-sm'>{getDay(new Date(item.bookdt))}, {formatDate(new Date(item.bookdt))}</span>
                                                            </div>
                                                        </div>
                                                        <div className="w-14 h-auto flex place-content-center items-center">
                                                            <div    className="cursor-pointer w-8 h-8  xl:w-10 xl:h-10 flex place-content-center items-center bg-red-500 hover:bg-opacity-90 rounded-full"
                                                                    onClick={() => setDeleteBooking(item.uid_booking)}>
                                                                <TrashIcon className='p-1 xl:p-0.5' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative w-full pb-16 flex flex-col place-content-center items-center">
                                    <NotFoundData className='w-80 h-80 sm:w-96 sm:h-96'/>
                                    <p className='text-center text-base font-medium text-green-900'>Looks like you not booking any desk in this desk section</p>
                                </div>
                            )
                        }
                    </div>
                </div>

                <div className="fixed w-full px-6 xl:px-12 py-2 text-xs text-center xl:text-left xl:text-sm font-medium text-black text-opacity-50 bottom-0 bg-white">
                    Created With ❤️ Made By Talent Kampus Merdeka Batch 3
                </div>
            </div>
        </Layout>
    )
}