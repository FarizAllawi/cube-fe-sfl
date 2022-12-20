import propTypes from 'prop-types'

import CloseDark from '/public/images/svg/kch-office/close-white.svg'


export default function Modals(props) {

    const appName = {
        short_name: process.env.NEXT_PUBLIC_APP_SHORT_NAME,
        long_name: process.env.NEXT_PUBLIC_APP_LONG_NAME
    }
    
    let width = ''
    if (props.size === 'small') width = 'w-11/12 sm:w-1/3 2xl:w-1/4'
    if (props.size === 'medium') width = 'w-11/12 sm:w-10/12 xl:w-5/12 2xl:w-1/3'
    if (props.size === 'large') width = 'w-11/12 sm:w-10/12 xl:w-1/2'

    let color = ''
    if (props.type === 'default') color = 'bg-gray-400 hover:bg-gray-300'
    if (props.type === 'danger') color='bg-red-400 hover:bg-red-300'

    return (
        <>
            <div className="fixed top-0 left-0 z-40 w-screen h-screen bg-black bg-opacity-10 backdrop-blur-md" style={{ "zIndex" : "2000"}}>

                <div className="select-none w-screen h-screen flex flex-col place-content-center items-center">
                    <div className={`transition-all duration-300 flex flex-col rounded-3xl bg-green-900 firefox:bg-opacity-100 ${width}`}>

                        <div className="relative px-6 py-6 xl:px-4 xl:py-4 flex flex-row place-content-center items-center">
                            <div className="text-xl lg:text-lg xl:text-lg font-semibold text-white tracking-wider cursor-pointer"> {props.title}</div>
                            <div className={`absolute right-4 flex place-content-center items-center p-2 rounded-full bg-green-500 hover:bg-opacity-80 cursor-pointer`}  onClick={props.onClose}>
                                <CloseDark className="p-1"/>
                            </div>
                        </div>
                        
                        <div className="w-full h-full bg-white border-2 border-green-900 rounded-b-3xl">
                            <div className="w-full flex px-4 text-center place-content-center mt-3 mb-3 2xl:mt-5 2xl:mb-5 text-base text-green-900 tracking-wide font-medium">
                                {props.caption}
                            </div>
                            <div className='w-full flex flex-col mb-4'>
                                { props.children }
                            </div>
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