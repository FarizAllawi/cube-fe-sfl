import propTypes from 'prop-types'
import {useState, useEffect, useRef} from 'react'
import Link from 'next/link'

import DeskSectionIcon from '/public/images/svg/kch-office/desk-section-icon.svg'

export default function BoxDeskSection(props) {
    
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
        <Link href={`/kch-office/desk-section/${props.data.uid_ds}`}>
            <div ref={wrapper} className="relative w-16 h-16 mb-1 xl:mb-0 p-2 xl:p-0 sm:w-24 sm:h-24 md:w-32 md:h-32 xl:w-20 xl:h-20">
                
                <div className="absolute w-full h-full cursor-pointer pb-3 xl:pb-0 flex place-content-center items-center bg-green-500 rounded-xl">
                    <DeskSectionIcon className='p-2.5 md:p-0'/>
                    <div className="absolute text-xl xl:text-2xl text-white font-semibold  ">{props.data.section_name}</div>
                </div>
                {
                    isHover && size.width > 1280 && (
                        <div className="absolute cursor-pointer top-0 w-full h-full bg-green-900 rounded-xl flex place-content-center items-center">
                            <div className="text-lg font-semibold text-white">FULL</div>  
                        </div>
                    )
                }
                {
                    size.width < 1280 && (
                        <>
                            <div className="absolute mt-12 sm:mt-28 w-full h-4 md:h-6 bg-green-900 rounded-b-xl flex place-content-center items-center">
                                <div className="text-xs md:text-sm text-white">FULL</div>  
                            </div>
                        </>
                    )
                }
            </div>
        </Link>
    )
}

BoxDeskSection.propTypes = {
    data: propTypes.object,

}