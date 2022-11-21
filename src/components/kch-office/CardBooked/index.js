import propTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import Link from 'next/link'

import Modals from 'components/kch-office/Modals'
import { getDay, formatDate } from 'helpers/dayHelper'

import DeskIcon from '/public/images/svg/kch-office/desk-icon.svg'
import Button from '../Button'

export default function CardBookedList(props) {
    
    const { data } = props
    
    const [modal, setModal] = useState(false)

    return (
        <>
            <Link href={`/kch-office/desk-section/${data.uid_ds}?date=${format(new Date(data.bookdt), 'yyyy-MM-dd')}`}>
                <div className="relative w-48 h-full p-2 flex flex-row bg-green-500 rounded-2xl 2xl:rounded-3xl">
                    <div className="w-11 p-1 h-full flex flex-col place-content-center items-center bg-green-900 rounded-full">
                        <div className="w-9 h-9  -mt-2 2xl:-mt-3 2xl:mb-2 flex place-content-center items-center bg-white rounded-full">
                            <DeskIcon className='p-1.5'/>
                        </div>
                        <div className="w-full h-10/12 mt-2 xl:mt-0 text-white flex place-content-center text-base font-semibold">
                            {data.office.desk_name}
                        </div>
                    </div>
                    <div className="relative w-full h-full ml-3 flex flex-col place-content-center items-start">
                        <div className="text-base font-light text-white">{getDay(new Date(data.bookdt))}</div>
                        <div className="text-xs font-light text-white">{formatDate(new Date(data.bookdt))}</div>
                        <div className="text-xs font-semibold text-green-900">{data.office.office_name}</div>
                    </div>
                    {/* <div className="cursor-pointer select-none absolute top-2 right-2 w-5 h-5 leading-5 text-center text-green-900 font-semibold rounded-full bg-white" onClick={() => setModal(true)}> x </div> */}
                </div>
            </Link>
            {
                modal && (
                    <Modals title='Cancel Booking'
                            caption='Are you sure want to cancel this booking?'
                            size='medium'
                            onClose={() => setModal(false)}>
                        <div className="w-full h-full flex flex-row place-content-center items-center mt-2">
                            <div className="w-1/2 flex place-content-center items-center gap-2">
                                <Button type='primary' className="border border-green-900" size='medium' onClick={() => setToggle('desk')}>YES</Button>
                                <Button type='primary' className="border bg-green-500 border-green-500" size='medium' onClick={() => setModal(false)}>NO</Button>
                            </div>
                        </div>
                    </Modals>
                )
            }
        </>
    )
}

CardBookedList.propTypes = {
    data: propTypes.object,
}