import propTypes from 'prop-types'

import CloseDark from '/public/images/svg/close-dark.svg'
import ClocseLight from '/public/images/svg/close-light.svg'


export default function Modals(props) {

    const appName = {
        short_name: process.env.NEXT_PUBLIC_APP_SHORT_NAME,
        long_name: process.env.NEXT_PUBLIC_APP_LONG_NAME
    }
    
    let width = ''
    if (props.size === 'small') width = 'w-11/12 xl:w-1/3 2xl:w-1/4'
    if (props.size === 'medium') width = 'w-1/3'
    if (props.size === 'large') width = 'w-1/2'

    let color = ''
    if (props.type === 'default') color = 'bg-gray-400 hover:bg-gray-300'
    if (props.type === 'danger') color='bg-red-400 hover:bg-red-300'

    return (
        <>
            <div className="fixed z-40 w-screen h-screen bg-black bg-opacity-40 backdrop-blur-md">

                <div className="select-none w-screen h-screen flex flex-col place-content-center items-center">
                    <div className={`transition-all duration-300 flex flex-col rounded-3xl bg-gray-500 dark:bg-gray-800 dark:bg-opacity-80 firefox:bg-opacity-100 ${width}`}>

                        <div className="px-6 py-6 xl:px-8 xl:py-6 flex flex-row place-content-between items-center">
                            <div className="text-xl lg:text-lg xl:text-xl font-bold text-white tracking-wider cursor-pointer">{appName.short_name}</div>
                            <div className={`flex place-content-center items-center p-2 rounded-full ${color} cursor-pointer`}  onClick={props.onClose}>
                                <CloseDark className="w-10/12"/>
                            </div>

                        </div>

                        <div className="px-6 xl:px-8 mb-1 text-2xl text-white font-semibold ">
                            {props.title}
                        </div>
                        <div className="px-6 xl:px-8  mb-5 text-sm text-white tracking-wide font-light">
                            {props.caption}
                        </div>
                        <div className='px-6 xl:px-8  flex flex-col mb-4'>
                            { props.children }
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

Modals.defaultProps = {
    type: "default",
    size: "small"
}

Modals.propTypes = {
    type: propTypes.oneOf(['default', 'danger']),
    size: propTypes.oneOf(['small', 'medium', 'large']),
    title: propTypes.string,
    caption: propTypes.string,
    onClose: propTypes.func,
}