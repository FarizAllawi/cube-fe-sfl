import { useState, useEffect, useRef } from 'react'
import propTypes from 'prop-types'
import { 
    format, 
    subMonths, 
    addMonths, 
    addDays,
    startOfWeek, 
    startOfMonth,
    endOfMonth,
    endOfWeek,
    isSameMonth,
    isSameDay,
    getDay,
    getDate
    // parse
} from "date-fns"

import ChevronLeft from '../../../../public/images/svg/kch-office/chevron-left.svg'
import ChevronRight from '../../../../public/images/svg/kch-office/chevron-right.svg'

export default function Calendar(props) {

    const { type, value, minDate, maxDate, disableDay, disableDate } = props

    const [hoverDate, setHoverDate] = useState('')
    const [currentMonth, setCurrentMonth] = useState(type === 'calendar' ? new Date(value) : new Date(value.startDate))
    const [selectedDate, setSelectedDate] = useState(type === 'calendar' ? new Date(value) : {})

    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1))
    }

    const prevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1))
    }

    const onDateClick = (date) => {
        let valueDate = selectedDate
        if (!isSameMonth(date, currentMonth)) {
            setCurrentMonth(date)
        }

        if (type === 'dateRange') {
            if (valueDate.startDate === undefined) {
                valueDate['startDate'] = date
                valueDate['endDate'] = undefined
            }
            else {
                if (valueDate.endDate === undefined) {
                    if (date < valueDate.startDate) {
                        valueDate['endDate'] = valueDate.startDate
                        valueDate['startDate'] = date
                    } else {
                        valueDate['endDate'] = date
                    }

                } else {
                    valueDate['startDate'] = date
                    valueDate['endDate'] = undefined
                }

                // Disable Date
                let disable = []
                
                if (disableDay !== undefined && disableDay.length !== 0) {
                    let checkDate = valueDate['startDate']
                    while(checkDate < valueDate['endDate']) {
                        if (disableDay.includes(getDay(checkDate))) disable.push(checkDate)
                        checkDate = addDays(checkDate, 1)
                    }
                }

                if (disableDate !== undefined && disableDate.length !== 0) {
                    disableDate.map(item => disable.push(item.date))
                }

                valueDate['disable'] = disable
            }

            setHoverDate('')
            setSelectedDate(valueDate)
        }
        else {
            setSelectedDate(date)
            valueDate = date
        }

        const target = {
            target : {
                name: type,
                value: valueDate
            }
        }

        props.onChange(target)
    }

    const CalendarHeader = () => {
        return (
            <div className="w-full h-16 p-4 flex flex-row place-content-center items-center bg-green-900 rounded-t-3xl">
                <div className="w-1/3">
                    <div className="cursor-pointer w-8 h-8 xl:w-10 xl:h-10 flex place-content-center items-center rounded-full bg-green-500 bg-opacity-80 hover:bg-opacity-60" onClick={() => prevMonth()}>
                        <ChevronLeft className="p-1" />
                    </div>
                </div>
                <div className="w-2/3 h-10 p-2 bg-green-500 bg-opacity-80 rounded-xl flex flex-row place-content-center items-center gap-2 divide-x-2">
                    <div className="w-1/2 p-2 flex place-content-center items-center text-sm xl:text-base font-medium text-white">
                        {format(currentMonth, "MMMM")}
                    </div>
                    <div className="w-1/2 p-2 flex place-content-center items-center text-sm xl:text-base font-medium text-white ">
                        {format(currentMonth, "yyyy")}
                    </div>
                </div>
                <div className="w-1/3 flex place-content-end">
                    <div className="cursor-pointer w-8 h-8 xl:w-10 xl:h-10 flex place-content-center items-center rounded-full bg-green-500 bg-opacity-80 hover:bg-opacity-60" onClick={() => nextMonth()}>
                        <ChevronRight className="p-1" />
                    </div>
                </div>
            </div>
        )
    }

    const CalendarDays = () => {

        const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    
        return (
            <div className="w-full h-10 grid grid-cols-7 ">
                {
                    weekDays.map((day, index) => {
                        return (
                            <div key={index} className="relative w-full h-full bg-green-900">
                                <div  className='absolute w-full h-full flex place-content-center items-center bg-green-500 bg-opacity-80 text-xs xl:text-sm text-center font-light text-white'>{day}</div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    const getHoverBackground = (day) => {
        let background = ''
        if (minDate !== undefined || maxDate !== undefined) {
            if (minDate !== undefined && maxDate !== undefined) {
                if (day >= minDate && day <= maxDate) {
                    background = 'bg-green-500 bg-opacity-20'
                }
                else background = ''
            }
            else {
                if (minDate !== undefined && maxDate === undefined && day >= minDate) {
                    background = 'bg-green-500 bg-opacity-20'
                }

                if (maxDate !== undefined && minDate === undefined && day <= maxDate) {
                    background = 'bg-green-500 bg-opacity-20'
                }
                
            }
            

        } else {
            return background = 'bg-green-500 bg-opacity-20'
        }

        return background
    }

    const CalendarCells = () => {
    
        const monthStart = startOfMonth(currentMonth)
        const monthEnd = endOfMonth(monthStart)
        const startDate = startOfWeek(monthStart)
        const endDate = endOfWeek(monthEnd)
    
        let days = []
        let rows = []
        let day = startDate
        let formattedDate = ""
        

        while (day < endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, "d")
                const cloneDay = day
                let disableStatus = false
                let contentDate = null

                disableDate?.map((item) => {
                    if (format(item.date, 'yyy-MM-dd') === format(day, 'yyy-MM-dd')) {
                        disableStatus = true
                        contentDate = item.content
                    }
                })

                let background = ''
                if (type === 'dateRange') {
                    if (selectedDate.startDate !== undefined && isSameDay(day, selectedDate.startDate) && !disableDay?.includes(getDay(day))) {
                        background = 'bg-green-500 bg-opacity-20'
                    }
                    else if (selectedDate.endDate !== undefined && isSameDay(day, selectedDate.endDate) && !disableDay?.includes(getDay(day))) {
                        background = 'bg-green-500 bg-opacity-20'
                    }

                    if (!disableStatus && hoverDate !== '' && selectedDate.endDate === undefined && day >= selectedDate.startDate && day <= hoverDate && !disableDay?.includes(getDay(day)) ) {
                        background = getHoverBackground(day)       
                    }
                    else if (!disableStatus && hoverDate !== '' && selectedDate.endDate === undefined && day <= selectedDate.startDate && day >= hoverDate && !disableDay?.includes(getDay(day))) {
                        background = getHoverBackground(day)
                    }
                    else if (!disableStatus && hoverDate !== '' && selectedDate.endDate === undefined && day <= selectedDate.startDate && day >= hoverDate && !disableDay?.includes(getDay(day))) {
                        background = getHoverBackground(day)
                    }
                    else if (!disableStatus && selectedDate.endDate !== undefined && day >= selectedDate.startDate && day <= selectedDate.endDate && !disableDay?.includes(getDay(day))) {
                        background = 'bg-green-500 bg-opacity-20'
                    }
                } else {
                    background = isSameDay(day, value) ? 'bg-green-500 bg-opacity-20' : ''
                }

                let cursor = ''
                let text = ''

                if (disableDay !== undefined && disableDay.includes(getDay(day))) {
                    cursor = 'cursor-not-allowed'
                    text =  'text-opacity-30'
                }
                else if (minDate !== undefined && maxDate !== undefined) {
                    if (!disableStatus && day >= minDate && day <= maxDate) {
                        cursor = 'cursor-pointer'
                        text = 'text-opacity-100'
                    }
                    else {
                        cursor = 'cursor-not-allowed'
                        text = 'text-opacity-30'
                    }
                }
                else if (minDate !== undefined && maxDate === undefined) {
                    if (!disableStatus && day >= minDate) {
                        cursor = 'cursor-pointer'
                        text = 'text-opacity-100'
                    }
                    else {
                        cursor = 'cursor-not-allowed'
                        text = 'text-opacity-30'
                    }
                }
                else if (minDate === undefined && maxDate !== undefined) {
                    if (!disableStatus && day <= maxDate) {
                        cursor = 'cursor-pointer'
                        text = 'text-opacity-100'
                    }
                    else {
                        cursor = 'cursor-not-allowed'
                        text =  'text-opacity-30'
                    }
                }
                else {
                    cursor = 'cursor-pointer'
                    text = 'text-opacity-100'
                }
    
                days.push(
                    <div    key={day} 
                            className={`relative w-full h-full flex flex-col border-t-2 place-content-center items-center
                                        ${ background } 
                                        ${ cursor }
                                        `} 
                            onMouseOver={() => setHoverDate(cloneDay)}
                            onTouchStart={() => setHoverDate(cloneDay)}
                            onTouchEnd={() => setHoverDate(cloneDay)}
                            onClick={() => {
                                if (cursor === 'cursor-pointer' && !disableStatus) onDateClick(cloneDay)
                            }}>
                        <div    id="date"
                                className={`w-full h-full text-xs text-green-900 
                                        ${ text }
                                        ${ isSameMonth(day, monthStart) ? 'text-opacity-100' : 'text-opacity-30'} 
                                        font-bold p-2`}>
                            {formattedDate}
                        </div>
                        <div className="absolute w-full h-5/6 bottom-0 flex flex-col place-content-center items-center">
                            { contentDate }
                        </div>
                    </div>
                )
                day = addDays(day, 1);
            }
            rows.push(
                <div key={day} className="w-full h-16 2xl:h-20 grid grid-cols-7 divide-x-2 divide-green-900 divide-opacity-20 ">
                    {days}
                </div>
            )
            days = []
        }
        
        return (
            <div className=" w-full h-auto grid grid-flow-row border-b-2 border-x-2 border-green-900 rounded-b-3xl">
                {rows}
            </div>
        )
    }


    useEffect(() => {
    }, [value, currentMonth, hoverDate ,selectedDate])


    return (
        <div className="w-full flex flex-col">
            {CalendarHeader()}
            {CalendarDays()}
            {CalendarCells()}
        </div>
    )
}

Calendar.defaultProps = {
    type: 'calendar',
    value: new Date(),
    maxDate: undefined,
    minDate: undefined,
}

Calendar.propTypes = {
    type : propTypes.oneOf(['calendar', 'dateRange']).isRequired,
    value:  propTypes.oneOfType([propTypes.number, propTypes.object]).isRequired,
    dateContent: propTypes.array,
    disableDate: propTypes.array, // array of date ex: [{date: new Date(), content: <Children>}]
    disableDay: propTypes.array, // array of day ex: [1, 2, 3] => 0 Sunday , 1 Monday, 2 Tuesday
    minDate: propTypes.oneOfType([propTypes.number, propTypes.object]),
    maxDate: propTypes.oneOfType([propTypes.number, propTypes.object]),
    onChange: propTypes.func.isRequired
}