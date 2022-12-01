import propTypes from 'prop-types'
import {useEffect, useState} from 'react'
import { useTheme } from 'next-themes'

import ArrowRightDark from '/public/images/svg/eca/arrow-right-dark.svg'
import ArrowRightLight from '/public/images/svg/eca/arrow-right-light.svg'

export default function Dropdown(props) {

    const {
        title, name, append, className, children, isLoading, caption
    } = props

    const { theme } = useTheme()
    const [clicked, setClicked] = useState('')

    useEffect(() => {}, [isLoading])

    return (
        <div className={`relative select-none w-full flex place-content-center items-center `}>
            <div className="absolute w-full h-full bg-black bg-opacity-5 rounded-3xl blur-md shadow-md"></div>
            <div className={`z-20 w-full h-auto flex-col gap-4 ${!isLoading && ' border-2 border-slate-200 dark:border-gray-700'} bg-white dark:bg-gray-700 rounded-2xl ${className}`}>
                {
                    isLoading && (
                        <div className="animate-pulse w-full p-4 flex flex-row place-content-between items-center">
                            <div className="w-6/12 h-6 bg-slate-200 dark:bg-slate-600 rounded-2xl"></div>
                            <div className="w-6 h-6 bg-slate-200 dark:bg-slate-600 rounded-2xl"></div>
                        </div>
                    )
                }
                {
                    !isLoading && (
                        <div className="cursor-pointer w-full p-4 flex flex-row place-content-start items-center h-full" 
                            onClick={() => {
                                        if (clicked !== `${name}-${title}`){
                                            setClicked(`${name}-${title}`)
                                            props.onClick(`${name}-${title}`) 
                                        }else{
                                            setClicked('')
                                            props.onClick(``) 
                                        }
                                    }}>
                            <div className={`w-8/12 flex flex-row font-semibold text-sm`}>
                                <div className="w-1/2">
                                    {title}
                                </div>
                                <div className="w-1/2 text-center text-gray-400 truncate">
                                    <span className=" text-xs">{caption}</span>
                                </div>
                            </div>
                            <div className="w-4/12 flex flex-row place-content-end items-center">
                                <div className={`w-5/6 flex place-content-end`}>
                                    {
                                        append
                                    }
                                    
                                </div>
                                <div className="flex place-content-end ml-2">
                                {
                                    clicked !== `${name}-${title}` ? (
                                        <>
                                        {
                                            theme === 'dark' ? <ArrowRightDark className="w-8/12 transition-transform rounded-full" /> : <ArrowRightLight className="w-8/12 transition-transform rounded-full" />
                                        }
                                        </>
                                    ) : (
                                        <>
                                        {
                                            theme === 'dark' ? <ArrowRightDark className="w-8/12 rounded-full transition-transform rotate-90" /> : <ArrowRightLight className="w-8/12 rounded-full transition-transform rotate-90" />
                                        }
                                        </>
                                    )
                                }
                                </div>
                            </div>
                        </div>
                    )
                }
                {
                        clicked === `${name}-${title}` && children
                }
            </div>
        </div>
    )    
}

Dropdown.propTypes = {
    title: propTypes.string,
    caption: propTypes.string,
    name: propTypes.string.isRequired,
    clicked: propTypes.string,
    className: propTypes.string,
    append: propTypes.object,
    isLoading: propTypes.bool,
}