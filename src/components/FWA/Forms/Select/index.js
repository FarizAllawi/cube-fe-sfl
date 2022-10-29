import { useState, useRef, Children, useEffect } from 'react'
import { useTheme } from 'next-themes'
import propTypes from 'prop-types'

import ArrowDownDark from '/public/images/svg/arrow-down-dark.svg'
import ArrowDownGray from '/public/images/svg/arrow-down-gray.svg'


export default function Select(props) {
    
    const  {
        labelName,
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

    const {theme, setTheme} = useTheme()
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
        <div className={`relative w-full ${ !HasError && !errorStatus ? 'pt-2 pb-2' : 'pt-2 pb-2 '}`}>
            {
                labelName && (
                    <label htmlFor={name} className="text-sm text-gray-500 dark:text-white font-semibold">{labelName}</label>
                )
            }
            <div ref={selectWrapper} 
                 onClick={() => setToggle(!toggle)}
                 className={`select-none cursor-pointer flex flex-row place-content-start items-center p-4
                            bg-white dark:bg-gray-700 rounded-xl  border border-gray-300 ${ HasError || errorStatus ? 'outline-none ring-1 border-orange-300 ring-orange-300 ' : ''} 
                            text-xs tracking-wide drop-shadow-md`}>

                <div className={`w-10/12 ${value !== '' ? 'text-gray-500 dark:text-white' : 'text-gray-300 dark:text-gray-300'}  font-normal text-xs tracking-wide`}>
                    {value || placeholder}
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
                            {
                                append ? append : (
                                    <>
                                        {
                                            items.length !== 0 ? (
                                                <ArrowDownGray className={`p-0.5 rounded-full transition-all ${ !isDisabled && toggle ? 'rotate-180' : '' }`}/>
                                            ) : (
                                                <div className="ml-1 w-full flex flex-col place-content-center items-center">
                                                    <div className='transition-all duration-300'>
                                                        <svg className="animate-spin h-4 w-4 text-gray-400 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                    <div className={`${ (!isDisabled && toggle && items.length !== 0) ? 'visible' : 'invisible' } w-full max-h-64 absolute top-14 left-0 select-none cursor-pointer flex flex-col rounded-xl bg-white dark:bg-gray-700  border border-gray-300 overflow-y-scroll`}>
                    {
                        items.map((item, index) => {
                            return (
                                <div key={index} 
                                    onClick={() => setValue(item.props.value)}
                                    className={`
                                        w-full flex p-4 text-gray-500 dark:text-white font-normal text-xs tracking-wide hover:bg-gray-600 hover:text-white 
                                        ${ index === (0) ? 'rounded-tl-xl' : ''} 
                                        ${ index === (items.length-1) ? 'rounded-bl-xl' : ''}
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