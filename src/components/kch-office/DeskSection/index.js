import propTypes from 'prop-types'
import {useState, useEffect, useRef} from 'react'
import Link from 'next/link'

import DeskSectionIcon from '/public/images/svg/kch-office/desk-section-icon.svg'

export default function BoxDeskSection(props) {
    
    const [isHover, setIsHover] = useState(false)
    const wrapper = useRef(null)

    useEffect(() => {
        wrapper.current.addEventListener('mouseenter', () => {
            setIsHover(true)
        })
        wrapper.current.addEventListener('mouseleave', () => {
            setIsHover(false)
        })
    }, [])

    return (
        <Link href={`/kch-office/desk-section/${props.data.uid_ds}`}>
            <div ref={wrapper} className="relative w-20 h-20 2xl:w-24 2xl:h-24 ">
                <div className="w-full h-full cursor-pointer flex place-content-center items-center bg-green-500 rounded-xl">
                    <DeskSectionIcon />
                    <div className="absolute text-2xl text-white font-semibold  ">{props.data.section_name}</div>
                </div>
                {
                    isHover && (
                        <div className="absolute cursor-pointer top-0 w-full h-full bg-green-900 rounded-xl">

                        </div>
                    )
                }
            </div>
        </Link>
    )
}

BoxDeskSection.propTypes = {
    data: propTypes.object,

}