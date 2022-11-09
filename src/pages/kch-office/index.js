import {useState, useEffect} from 'react'
import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link'

import useBooking from 'pages/api/kch-office/booking'
import useOffice from 'pages/api/kch-office/office'
import useDesk from 'pages/api/kch-office/desk'

import useForm from 'helpers/useForm'

import Select from 'components/kch-office/Forms/Select'
import Navbar from 'components/kch-office/Navbar'
import BoxDeskSection from 'components/kch-office/DeskSection'
import CardBookedList from 'components/kch-office/CardBooked'
import formatDate from 'helpers/formatDate'

export default function HomePage(props) {
    
    const { getDeskSectionToday } = useBooking()
    const { getDeskSectionByOffice } = useDesk()
    const { getAllOffice } = useOffice()

    const [currentDate, setCurrentDate] = useState(new Date())
    const [officeData, setOfficeData] = useState([])
    const [deskSection, setDeskSection] = useState([])
    const [selectedOffice, setSelectedOffice] = useState({})
    const [fetchStatus , setFetchStatus] = useState(false)

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
    }, [state.office, fetchStatus, selectedOffice])

    return (
        <>
            <Head>
                <title>KCH OFFICE</title>
            </Head>
            <div className="w-screen h-screen max-h-screen flex flex-col">
                <Navbar />
                <div className="w-full flex lg:flex-row lg:px-12 pt-2 lg:pt-24 2xl:pt-20">
                    <div className="w-1/2 flex lg:flex-row">
                        <div className="lg:text-4xl 2xl:text-5xl 2xl:mt-1 py-5 2xl:py-10 font-bold">
                            <div className='text-green-500'>CHOOSE</div>
                            <div className='text-green-700'>BOOK</div>
                            <div className='text-green-900'>ENJOY YOUR DESK</div>
                        </div>
                    </div>
                    <div className="w-1/2 h-44 2xl:h-48 2xl:mt-4 px-4 py-4 flex flex-col bg-green-900 rounded-3xl">
                        <div className="w-full flex flex-row place-content-center items-center">
                            <div className="w-1/2 flex z-30">
                                <div className="w-3/4 flex">
                                    <Select name="officeId"
                                            className="bg-white text-green-900"
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
                            <div className="w-1/2 text-right">
                                <Link href="/kch-office/history">
                                    <div className="cursor-pointer text-sm underline underline-offset-2 text-white font-medium">Booking history</div>
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

                <div className="w-full h-full lg:flex flex-row lg:px-12 pb-10 2xl:pb-2">
                    <div className="w-full flex flex-col">
                        <div className="w-3/12 mb-6 z-40">
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
                        <div className="w-7/12 grid lg:grid-cols-5 auto-rows-max gap-3 2xl:gap-4">
                            {
                                deskSection?.map((item, index) => {
                                    return (
                                        <BoxDeskSection key={index} data={item} />
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="relative w-1/2 mt-4">
                        <Image loader={imageLoader} fill  src={`${ process.env.NEXT_PUBLIC_API_STORAGE}files/get?filePath=${selectedOffice.office_sketch}`} alt="Office Sketch" />
                    </div>
                </div>
                
                <div className="w-full px-12 py-4 text-sm font-medium text-black text-opacity-50 bottom-0 bg-white">
                    Created With ❤️ Made By Kampus Merdeka Batch 3
                </div>

            </div>
        </>
    )
}