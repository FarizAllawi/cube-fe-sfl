import { useState, useEffect } from 'react'
import {useTheme} from 'next-themes'
import Image from 'next/image'
import useForm from 'helpers/useForm'
import propTypes from 'prop-types'


import SunIcon from '/public/images/svg/eca/sun-icon.svg'
import MoonIcon from '/public/images/svg/eca/moon-icon.svg'

export default function Theme(props) {

    const [mounted, setMounted] = useState(false)
    const {theme, setTheme} = useTheme()

    useEffect(() => { 
        setMounted(true)
        setTheme(theme?.includes('dark') ? 'dark' : 'light')
    }, [setTheme, theme])
    if (!mounted) return null


    return (
        <div className="overflow-hidden select-none p-3 flex place-icon-center items-center dark:bg-gray-700 bg-white drop-shadow-md hover:drop-shadow-sm rounded-full cursor-pointer" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {
                theme === 'dark' ? (
                    <><SunIcon className="p-0.5 fill-yellow-300"/></>
                ) : (
                    <><MoonIcon className="p-0.5 fill-yellow-300" /></>
                )
            }
        </div>
        // <div className="absolute top-4 right-4 xl:top-10 xl:right-10 cursor-pointer">
        // </div>
    )
}