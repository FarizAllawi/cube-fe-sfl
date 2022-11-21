import propTypes from 'prop-types'
import {useState, useEffect, useRef} from 'react'
import Link from 'next/link'

import DeskSectionIcon from '/public/images/svg/kch-office/desk-section-icon.svg'

export default function BoxDeskSection(props) {

    const { data, selectedDate } = props
    
    const [isHover, setIsHover] = useState(false)
    const wrapper = useRef(null)

    const [size, setWindowSize] = useState({
        width: undefined,
		height: undefined,
	})

    useEffect(() => {
        // Handler to call on window resize
		const handleResize = () => {
			// Set window width/height to state
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			})
		}

        window.addEventListener("resize", handleResize)
        handleResize()
        
        wrapper.current.addEventListener('mouseleave', () => {
            setIsHover(false)
        })

        wrapper.current.addEventListener('mouseenter', () => {
            setIsHover(true)
        })

        return () => {
            window.removeEventListener("resize", handleResize)
        }

    }, [])

    return (
        <Link href={`/kch-office/desk-section/${data.uid_ds}${selectedDate !== null && selectedDate !== '' ? '?date='+selectedDate : ''}`}>
            <div ref={wrapper} className="w-full h-full sm:w-24 sm:h-24 md:w-32 md:h-32 xl:w-20 xl:h-20">
                
                <div className="relative w-full h-full cursor-pointer pb-1 flex place-content-center items-center bg-green-500 rounded-xl">
                    <DeskSectionIcon className='p-2.5 md:p-0 mb-3 xl:mb-0 mt-1 '/>
                    <div className="absolute text-xl xl:text-2xl mb-2 xl:mb-0 xl:mt-1 text-white font-semibold  ">{data.section_name}</div>
                    {
                        isHover && size.width > 1280 && (
                            <div className="absolute cursor-pointer top-0 w-full h-full bg-green-900 rounded-xl flex place-content-center items-center">
                                <div className="text-lg font-semibold text-white">{ (data.booked !== 0 && data.count_desk !== 0)  && (data.booked === data.count_desk) ? 'FULL' : data.booked === 0 && data.count_desk === 0 ? 'EMPTY' : data.booked+'/'+data.count_desk }</div>  
                            </div>
                        )
                    }
                    {
                        size.width < 1280 && (
                            <>
                                <div className="absolute w-full bottom-0  h-4 md:h-6 bg-green-900 rounded-b-xl flex place-content-center items-center">
                                    <div className="text-xs  md:text-sm text-white">{ (data.booked !== 0 && data.count_desk !== 0)  && (data.booked === data.count_desk) ? 'FULL' : data.booked === 0 && data.count_desk === 0 ? 'EMPTY' : data.booked+'/'+data.count_desk }</div>  
                                </div>
                            </>
                        )
                    }
                </div>
            </div>
        </Link>
    )
}

BoxDeskSection.propTypes = {
    data: propTypes.object,
    selectedDate: propTypes.string

}