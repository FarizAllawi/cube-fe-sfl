import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { useTheme } from 'next-themes'
import propTypes from 'prop-types'

import Button from 'components/eca/Button'
import Input from 'components/eca/Forms/Input'
import InputDate from 'components/eca/Forms/Date'

import useForm from 'helpers/useForm'
import slugify from 'helpers/slugify'
import formatDate from 'helpers/formatDate'

import SearchDark from '/public/images/svg/eca/search-dark.svg'
import SearchLight from '/public/images/svg/eca/search-light.svg'
import CloseDark from '/public/images/svg/eca/close-dark.svg'
import CloseLight from '/public/images/svg/eca/close-light.svg'
import SearchGray from '/public/images/svg/eca/search-gray.svg'

function ButtonFilter(props) {

    const {
        data, isLoading
    } = props

    const setColor = (color) => {
        if (color === 'lime') { return 'bg-lime-400 hover:bg-lime-500' }
        if (color === 'green') return 'bg-green-400 hover:bg-green-500'
        if (color === 'yellow') return 'bg-yellow-400 hover:bg-yellow-500'
        if (color === 'blue') return 'bg-blue-400 hover:bg-blue-500'
        if (color === 'red') return 'bg-red-400 hover:bg-red-500'
        if (color === 'isLoading') return 'bg-slate-200 dark:bg-slate-600'
        if (color === 'gray') return 'bg-gray-400 hover:bg-gray-600 text-white'
        return 'bg-gray-500 hover:bg-gray-600 text-black'
    }

    return (
        <div className={`relative ${props.searchFilter ? 'w-5/6 md:w-11/12 rounded-r-full' : 'w-full'} py-5 flex gap-1 md:gap-2 snap-x snap-mandatory overflow-x-auto scroll-display-none`}>
            {
                data.map((item, index) => {
                    return (
                        <div key={index} className="snap-end scroll-mx-4 shrink-0">
                            <Button type="primary" size="small" className={`${setColor(isLoading ? 'isLoading' : item.color)} text-white`} onClick={() => !isLoading && props.onClick(slugify(item.name))}>{isLoading ? <div className='w-10 h-5'></div> : item.name}</Button>
                        </div>
                    )
                })
            }
        </div>
    )
}

function SearchField(props) {
    return (
        <div className="w-5/6 md:w-11/12 flex border border-transparent">
            {
                !props.isLoading ? (
                    <Input type="text" 
                            name={props.name} 
                            value={props.value} 
                            placeholder="what are you looking for?"
                            onChange={value => props.onChange(value)}
                            append={<SearchGray/>}
                            isLoading={props.isLoading}/>
                ) : (
                    <div className="flex w-full h-14 p-2 bg-slate-200 dark:bg-slate-600 rounded-xl"></div>
                )
            }
            
        </div>
    )
}

export default function Filter(props) {

    const {
        button,
        search,
        dateRange,
        isLoading
    } = props

    const currentDate = new Date()
    const {theme, setTheme} = useTheme()
    const [state, setState, newState] = useForm({
        searchData: "",
		isLoading: false,
		mounted: false,
        firstDate: currentDate,
        lastDate: currentDate,
		systemTheme: '',
        searchClicked: false
	})

    const buttonFilterClicked = (type) => {
        props.buttonOnClick(type)
    }

    const changeSearch = (value) => {
        newState({searchData: value.target.value})
        props.searchOnChange(value.target.value)
    }

    const changeDate = (type, date) => {
        if (type === 'first') {
            if (date.target.value < currentDate) {
                newState({
                    firstDate: date.target.value,
                    lastDate:currentDate
                })
            }
            else {
                toast.info("First date must be less than current date")
                newState({
                    firstDate: currentDate,
                })
            }

        }
        
        if (type === 'last') {

            if (date.target.value > state.firstDate) {
                if (date.target.value < currentDate) {
                    newState({lastDate: date.target.value})
                    if (formatDate(state.firstDate) !== formatDate(state.lastDate) && 
                        formatDate(state.firstDate) !== formatDate(currentDate)) {
                        props.dateRangeOnChange({
                            dateRange: {
                                firstDate: state.firstDate,
                                lastDate: date.target.value
                            }
                        })
                    } else {
                        props.dateRangeOnChange({
                            dateRange: {
                                firstDate: '',
                                lastDate: ''
                            }
                        })
                        toast.info("First date must be less than current date")
                    }
                }
                else toast.info("Last date must be less than current date")
            }
            else toast.info("Last date must be greater than first date")
        }

        
    }

    useEffect(() => {
        let theme = document.getElementsByTagName("html")[0].className
		newState({
			mounted: true,
			systemTheme: theme
		})
    }, [newState])

    if (!state.mounted) return null

    return (
        <div className={`${isLoading && 'animate-pulse'} z-30 w-full flex flex-col px-4 -mt-2 -mb-4 bg-stone-50 dark:bg-gray-900 drop-shadow-sm`}>
            <div className={`w-full flex flex-row place-content-start items-center`}>
                {
                    !state.searchClicked ? 
                        <ButtonFilter data={button} searchFilter={search} onClick={filter => buttonFilterClicked(filter)} isLoading={isLoading} /> 
                    :
                        <SearchField name="searchData" value={state.searchData} onChange={value => changeSearch(value)} isLoading={isLoading} />
                }

                {
                    isLoading && (
                        <div className="w-1/6 md:w-1/12 h-full py-4 flex flex-row place-content-end itmes-center">
                            <div className="flex place-content-center items-center w-11 h-11 bg-slate-200 dark:bg-slate-600 drop-shadow-md hover:drop-shadow-sm rounded-full cursor-pointer">
                            </div>
                        </div>
                    )
                }
                
                {
                    (!isLoading && search) && (
                        <div className="w-1/6 md:w-1/12 h-full py-4 flex flex-row place-content-end itmes-center">
                            <div className="flex place-content-center items-center px-2.5 py-2.5 bg-white dark:bg-gray-700 drop-shadow-md hover:drop-shadow-sm rounded-full cursor-pointer" onClick={clicked => newState({searchClicked: !state.searchClicked})}>
                                {
                                    !state.searchClicked ? (
                                        <>
                                            {
                                                theme === 'dark' || (theme === 'system' && state.systemTheme === 'dark')  ? (
                                                    <><SearchDark className="w-10/12 h-full" /></>
                                                ) :  (
                                                    <><SearchLight className="w-10/12 h-full" /></>
                                                )
                                            }
                                        </>
                                    ) : (
                                        <>
                                            {
                                                theme === 'dark' || (theme === 'system' && state.systemTheme === 'dark')  ? (
                                                    <><CloseDark className="w-10/12 h-full" /></>
                                                ) :  (
                                                    <><CloseLight className="w-10/12 h-full" /></>
                                                )
                                            }
                                        </>
                                    )
                                }
                            </div>
                        </div>
                    )
                }
            </div>
            {
                isLoading && (
                    <div className="w-full flex flex-row gap-2">
                        <div className="w-1/2 pt-2">
                            <div className="flex h-14 p-2 bg-slate-200 dark:bg-slate-600 rounded-xl"></div>
                        </div>
                        <div className="w-1/2 pt-2">
                            <div className="flex h-14 p-2 bg-slate-200 dark:bg-slate-600 rounded-xl"></div>
                        </div>
                    </div>
                )
            }
            {
                (!isLoading && dateRange) && (
                    <div className="w-full flex flex-row gap-2">
                        <div className="w-1/2">
                            <InputDate  name="firstDate" 
                                        value={state.firstDate} 
                                        placeholder="First Date" 
                                        currentDateStatus={true} 
                                        onChange={date => changeDate('first', date)}/>
                        </div>
                        <div className="w-1/2">
                            <InputDate name="secondDate" 
                                       value={state.lastDate} 
                                       placeholder="Last Date"  
                                       currentDateStatus={true}  
                                       onChange={date => changeDate('last', date)}/>  
                        </div>
                    </div>
                )
            }
            
        </div>
    )
}

Filter.defaultProps = {
    button: ['all'],
    search: true,
    dateRange: true
}

Filter.propTypes = {
    button: propTypes.array.isRequired,
    buttonOnClick: propTypes.func.isRequired,
    
    search: propTypes.bool,
    searchOnChange: propTypes.func,

    dateRange: propTypes.bool,
    dateRangeData: propTypes.object,
    dateRangeOnChange: propTypes.func

}