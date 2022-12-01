import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { toast } from 'react-toastify'
import propTypes from 'prop-types'

import StarLight from '/public/images/svg/eca/star-light.svg'
import StarDark from '/public/images/svg/eca/star-dark.svg'


export default function Rating(props) {
    
    const {
        value
    } = props

    const {theme} = useTheme()
    const starWrapper = useRef(null)
    const [rating, setRating] = useState( value !== undefined ? value : 0 )

    useEffect(() => {
        // const hoverStar = (event) => {
        //     if (starWrapper && starWrapper.current.contains(event.target)) {
        //         if (event.target.id && value === "" || value === 0 ) setvalue(`${event.target.id}`)
                
        //     }
        //     if (starWrapper && !starWrapper.current.contains(event.target)) setvalue(value !== '' ? `${value}` : '')
        // }
        
        // window.addEventListener("mouseover", hoverStar)

        // return () => {
        //     window.removeEventListener("mouseover", hoverStar)
        // }
    }, [])

    return (
        // <></>

        <div className="w-full flex flex-row place-content-center items-center gap-1">
            <div className="relative w-1/12 " >
                <div id="1" className="absolute w-full h-full" onClick={() => {value === "" || value === 0 ? props.onvalueChange(`1`) : ''}}></div>
                {
                    theme === 'dark' ? (
                        <StarDark className="w-full"
                            fill={ value === 1 || 
                                    value === 2 || 
                                    value === 3 || 
                                    value === 4 || 
                                    value === 5 ?'#a16207' : '#ffffff'}/>
                    ) : (
                        <StarLight className="w-full"
                            fill={ value === 1 || 
                                    value === 2 || 
                                    value === 3 || 
                                    value === 4 || 
                                    value === 5 ?'#a16207' : '#1b1b1b'}/>
                    )
                }
            </div>
            <div className="relative w-1/12 " >
                <div id="2" className="absolute w-full h-full" onClick={() => {value === "" || value === 0 ? props.onvalueChange(`2`) : ''}}></div>
                {
                    theme === 'dark' ? (
                        <StarDark className="w-full"
                            fill={ value === 2 || 
                                    value === 3 || 
                                    value === 4 || 
                                    value === 5 ? "#d97706" : '#ffffff'}/>
                    ) : (
                        <StarLight className="w-full"
                            fill={ value === 2 || 
                                    value === 3 || 
                                    value === 4 || 
                                    value === 5 ? "#d97706" : '#1b1b1b'}/>
                    )
                }
                
            </div>
            <div className="relative w-1/12" >
                <div id="3" className="absolute w-full h-full" onClick={() => {value === "" || value === 0 ? props.onvalueChange(3) : ''}}></div>
                {
                    theme === 'dark' ? (
                        <StarDark className="w-full"
                            fill={ value === 3 || 
                                    value === 4 || 
                                    value === 5  ? "#f59e0b" : '#ffffff' }/>
                    ) : (
                        <StarLight className="w-full"
                            fill={ value === 3 || 
                                    value === 4 || 
                                    value === 5 ? "#f59e0b" : '#1b1b1b' }/>
                    )
                }
                
            </div>
            <div className="relative w-1/12" >
                <div id="4" className="absolute w-full h-full" onClick={() => {value === "" || value === 0 ? props.onvalueChange(4) : ''}}></div>
                {
                    theme === 'dark' ? (
                        <StarDark className="w-full"
                            fill={ value === 4 || 
                                    value === 5 ? "#fbbf24" : '#ffffff'}/>
                    ) : (
                        <StarLight className="w-full"
                            fill={ value === 4 || 
                                    value === 5 ? "#fbbf24" : '#1b1b1b'}/>
                    )
                }
                
            </div>
            <div className="relative w-1/12" >
                <div id="5" className="absolute w-full h-full" onClick={() => {value === "" || value === 0 ? props.onvalueChange(5) : ''}}></div>
                {
                    theme === 'dark' ? (
                        <StarDark className="w-full" fill={ value === 5 ? "#fde047" : '#ffffff' }/>
                    ) : (
                        <StarLight className="w-full" fill={ value === 5 ? "#fde047" : '#1b1b1b'}/>
                    )
                }
            </div>
        </div>
    )
}

Rating.propTypes = {
    value: propTypes.string,
}