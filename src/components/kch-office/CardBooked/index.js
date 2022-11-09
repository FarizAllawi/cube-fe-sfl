import propTypes from 'prop-types'

import DeskIcon from '/public/images/svg/kch-office/desk-icon.svg'


export default function CardBookedList(props) {
    return (
        <div className="relative w-48 h-full p-2 flex flex-row bg-green-500 rounded-2xl 2xl:rounded-3xl">
            <div className="w-11 p-1 h-full flex flex-col place-content-center items-center bg-green-900 rounded-full">
                <div className="w-full -mt-1 2xl:-mt-2 2xl:mb-2 flex place-content-center">
                    <DeskIcon className=''/>
                </div>
                <div className="w-full h-9/12 text-white flex place-content-center text-base font-semibold">
                    A1
                </div>
            </div>
            <div className="w-full h-full ml-3 flex flex-col place-content-center items-start">
                <div className="text-base font-light text-white">Wednesday</div>
                <div className="text-xs font-light text-white">02 November 2022</div>

            </div>
            <div className="cursor-pointer select-none absolute top-2 right-2 w-5 h-5 leading-5 text-center text-green-900 font-semibold rounded-full bg-white"> x </div>
        </div>
    )
}

CardBookedList.propTypes = {
    data: propTypes.object,
}