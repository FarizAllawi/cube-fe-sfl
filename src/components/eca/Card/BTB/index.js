
import BadgeStatus from "components/eca/Badge"

import formatDate from "helpers/formatDate"

import CloseDark from '/public/images/svg/eca/close-dark.svg'

export default function CardBTB(props) {

    const {
        data
    } = props

    return (
        <div className="w-full p-4 flex flex-row gap-1 items-center bg-zinc-50 dark:bg-gray-900 drop-shadow-md rounded-3xl" >
            <div className="w-5/6 flex flex-col gap-2">
                <div className="w-full text-xs font-normal text-gray-500">{formatDate(data.activitydt !== undefined ? new Date(Date.parse(data.activitydt)) : new Date())}</div>
                <div className="w-full text-sm font-semibold text-black dark:text-white">{data.bc_type.split('-')[1]}</div>
                <div className="w-full text-sm font-normal text-black dark:text-white">IDR {new Intl.NumberFormat('de-DE').format(data.amount)}</div>
                <div className="w-full text-xs font-normal text-gray-500">{data.bc_desc}</div>
            </div>

            <div className="w-1/6 flex place-content-end">
            {
                props.feature === 'approval' ? (
                    <div className="ml-3 flex place-content-end items-center">
                        <div className="cursor-pointer w-8 h-8 p-2 flex place-content-center items-center bg-red-400 hover:bg-red-500 rounded-full"
                                onClick={() => props.rejectParticularBTB(`${data.bhid}-${data.bcid}`)}>
                                <CloseDark />
                        </div>
                    </div>

                ) : (
                    <div className="w-1/4 flex place-content-end items-center">
                        <BadgeStatus type='badge' status={data.status_approval} feature={'btb'} />
                    </div>
                )
            }
            </div>
        </div>
    )
}