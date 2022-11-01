import propTypes from 'prop-types'
import {useState, useEffect, useRef} from 'react'
import { Calendar } from 'react-date-range'

import formatDate from 'helpers/formatDate'

import CalendarIcon from '/public/images/svg/calendar-gray.svg'

import 'react-date-range/dist/styles.css' // main css file
import 'react-date-range/dist/theme/default.css' // theme css file


export default function InputDate(props) {
    const {
        name, value, labelName, isRequired, isDisabled, placeholder, minDate, maxDate, currentDateStatus
    } = props

    const currentDate = new Date().getTime()
    const calendarRef = useRef()
    const [isShowed, setIsShowed] = useState(false)
    const [errorResponse, setErrorResponse] = useState('')

    const calendarChange = (value) => {
        const target = {
            target: {
                name: name,
                value: value
            }
        }
        
        if (minDate !== undefined || maxDate !== undefined) {

            let minDateBeforeToday = new Date() - (minDate ? minDate : 0)
            let maxDateAfterToday = new Date() + (maxDate ? maxDate : 0)

            if (minDate !== undefined ) {
                if (new Date(formatDate(value)).getTime() < new Date(formatDate(minDateBeforeToday)).getTime()) {
                    setErrorResponse(`minimum date is ${formatDate(minDateBeforeToday)}`)
                    setIsShowed(false)
                }
            }

            if (maxDate !== undefined ) {

                if (new Date(formatDate(value)).getTime() > new Date(formatDate(maxDateAfterToday)).getTime()) {
                    setErrorResponse(`maximum date is ${formatDate(maxDateAfterToday)}`)
                    setIsShowed(false)
                }
            }

            
            if ( new Date(formatDate(value)).getTime() >= new Date(formatDate(minDateBeforeToday)).getTime() &&
                    new Date(formatDate(value)).getTime() <= new Date(formatDate(maxDateAfterToday)).getTime()) {
                    props.onChange(target)
                    setErrorResponse('')
                    setIsShowed(false)
            }
        }
        else {
            props.onChange(target)
            setErrorResponse('')
            setIsShowed(false)
        }


        
    }

    useEffect(() => {
        const handleClickOutside = event => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setIsShowed(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    },[])

    return (
        <>
            <div ref={calendarRef} className={`w-full pt-2 pb-2 `} >
                {
                    labelName && (
                        <label htmlFor={name} className="text-sm text-gray-500 dark:text-white font-semibold">{labelName}</label>
                    )
                }
                <div className={`cursor-pointer flex flex-row place-content-start items-center py-4 px-4 
                                bg-white dark:bg-gray-700 rounded-xl  border border-gray-300
                                text-xs tracking-wide drop-shadow-md`}
                     onClick={() => setIsShowed(!isShowed)}>

                    <div className="w-10/12">
                        {
                            value !== '' &&  value !== undefined && (formatDate(value) !== formatDate(currentDate)) ? (
                                <p className="text-gray-500 dark:text-white font-normal text-xs tracking-wide">{ formatDate(value) }</p>
                            ) : (
                                <p className="text-gray-300 dark:text-gray-300 font-normal text-xs tracking-wide">
                                    {currentDateStatus ? formatDate(value) : placeholder}
                                </p>
                            )
                        }
                    </div>

                    <div className="w-2/12 h-full flex flex-row place-content-end items-center">
                        {
                            isRequired && (
                                <div className={`${isRequired ? 'w-1/2' : 'w-full'} flex place-content-end items-center`}>
                                    <p className='text-gray-500 '>required</p>
                                </div>
                            )
                        }
                        
                        <div className={`ml-1 flex place-content-end items-center`}>
                            <CalendarIcon className="p-0.5" />
                        </div>
                    </div>
                </div>
                {
                    ( !isDisabled && isShowed ) && (
                        <div className="absolute mt-2 left-0 z-30 w-full flex place-content-center">
                            <div className=" flex place-content-center items-center">
                                <Calendar date={props.value}
                                          className='rounded-3xl drop-shadow-lg border border-gray-300 dark:bg-gray-700 '
                                          onChange={calendarChange} />
                            </div>
                        </div>
                    )
                }
                {
                    ( errorResponse !== '' ) && (
                        <div className='mt-0.5 ml-3 absolute text-red-400 dark:text-orange-300 font-base text-xs'>
                            { errorResponse }
                        </div>
                    )
                }
                
            </div>
        </>
    )
}

InputDate.propTypes = {
    name: propTypes.string.isRequired,
    labelName: propTypes.string,
    value: propTypes.oneOfType([propTypes.string, propTypes.number ,propTypes.object]),
    placeholder: propTypes.string,
    onChange: propTypes.func.isRequired,
    isRequired: propTypes.bool,
    minDate: propTypes.number,
    maxDate: propTypes.number,
    currenDateStatus: propTypes.bool,
    isDisabled: propTypes.bool
}