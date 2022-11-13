import { useState, useRef, Children, useEffect } from 'react'
import propTypes from 'prop-types'

import ArrowDownWhite from '/public/images/svg/kch-office/arrow-down-white.svg'
import ArrowDownGreen from '/public/images/svg/kch-office/arrow-down-green.svg'


export default function Select(props) {
    
    const  {
        labelName,
        className,
        name,
        value,  
        children,
        append,
        placeholder,
        isDisabled,
        isLoading,
        isRequired,
        errorResponse,
        errorStatus,
    } = props

    const [toggle, setToggle] = useState(false)
    const [HasError, setHasError] = useState(null)
    const selectWrapper = useRef(null)

    const items = Children.toArray(children)

    const clickOutside = (event) => {
        if (selectWrapper && !selectWrapper.current.contains(event.target)) {
            setToggle(false)
        }
    }

    const setValue = (value) => {
        props.onClick({ target:{ name: name, value: value}})
        setToggle(false)
    }

    
    useEffect(() => {
        window.addEventListener("mousedown", clickOutside)
        return () => {
            window.removeEventListener("mousedown", clickOutside)
        }
    }, [])

    return (
        <div className="relative w-full z-10">
            {
                labelName && (
                    <label htmlFor={name} className="text-sm text-gray-500 dark:text-white font-semibold">{labelName}</label>
                )
            }
            <div ref={selectWrapper} 
                 onClick={() => setToggle(!toggle)}
                 className={`select-none cursor-pointer flex flex-row place-content-start items-center py-1.5 px-3 sm:py-2 sm:px-4
                             ${ className !== undefined ?  className :  toggle ? 'text-xs sm:text-sm border-2 border-green-900 bg-green-900' : 'text-xs sm:text-sm border-2 border-green-900 bg-white'} rounded-full  
                             ${ HasError || errorStatus ? 'outline-none ring-1 border-orange-300 ring-orange-300 ' : ''} 
                             text-xs tracking-wide drop-shadow-md`}>

                <div className={`w-full mr-1 ${className !== undefined ? className : toggle ? 'text-xs sm:text-sm text-white' : 'text-xs sm:text-sm text-green-900' } font-semibold truncate text-sm tracking-wide`}>
                    {value || placeholder}
                </div>
                    <div className="w-auto h-full flex flex-row place-content-end items-center">
                        {
                            isRequired && (
                                <div className={`${isRequired ? 'w-1/2' : 'w-full'} flex place-content-end items-center`}>
                                    <p className='text-gray-400 '>required</p>
                                </div>
                            )
                        }
                        <div className={`w-4 flex place-content-end items-center`}>
                            {
                                append ? append : (
                                    <>
                                        {
                                            items.length !== 0 ? (
                                                <>
                                                {
                                                    toggle ? (
                                                        <>
                                                        {
                                                            className !== undefined ? (
                                                                <ArrowDownGreen className={`p-1 rounded-full transition-all ${ !isDisabled && toggle ? 'rotate-0' : '-rotate-90' }`}/>
                                                            ) : (
                                                                <ArrowDownWhite className={`p-1 rounded-full transition-all ${ !isDisabled && toggle ? 'rotate-0' : '-rotate-90' }`}/>
                                                            )
                                                        }
                                                        </>
                                                    ) : (
                                                        <ArrowDownGreen className={`p-1 rounded-full transition-all ${ !isDisabled && toggle ? 'rotate-0' : '-rotate-90' }`}/>
                                                    )
                                                }
                                                </>
                                                
                                            ) : (
                                                <div className="w-full flex flex-col place-content-center items-center">
                                                    <div className='transition-all duration-300'>
                                                        <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </>
                                )
                            }
                        </div>
                    </div>
                    <div className={`${ (!isDisabled && toggle && items.length !== 0) ? 'visible' : 'invisible' }
                                    scroll-display-none w-full max-h-64 p-2 absolute top-11 left-0 select-none cursor-pointer flex flex-col rounded-xl bg-white drop-shadow-lg  overflow-y-scroll`}>
                    {
                        items.map((item, index) => {
                            return (
                                <div key={index} 
                                    onClick={() => setValue(item.props.value)}
                                    className={`
                                         w-full p-4 ${item.props.children === value ? 'bg-green-500 text-white' : 'bg-green-500 bg-opacity-60 text-green-900'} 
                                         font-medium text-xs tracking-wide hover:bg-green-500 hover:text-white 
                                         rounded-xl cursor-pointer ${index !== 0 ? 'mt-2' : ''}
                                    `}>

                                    {item.props.children}
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            {
                ( HasError || errorStatus) && (
                    <div className='mt-0.5 ml-3 absolute text-orange-300 font-base text-xs'>
                        { HasError ? HasError : errorResponse }
                    </div>
                )
            }
            
        </div>
    )
}

Select.defaultProps = {
    placeholder: "Select Option"
}

Select.proptypes = {
    name: propTypes.string.isRequired,
    className: propTypes.string,
    value: propTypes.oneOfType([propTypes.string, propTypes.number]).isRequired,
    onClick: propTypes.func.isRequired,
    placeholder: propTypes.string,
    labelName:propTypes.string,
    append: propTypes.object,
    isDisabled: propTypes.bool,
    isLoading: propTypes.bool,
    isRequired: propTypes.bool,
    errorResponse: propTypes.string,
    errorStatus: propTypes.bool,
}