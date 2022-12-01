import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import Link from 'next/link'

import LayoutList from 'components/eca/Layout/List'

import SpeedDark from '/public/images/svg/eca/speed-dark.svg'
import OtherClaimDark from '/public/images/svg/eca/other-claim-dark.svg'


export default function Action(props) {

    useEffect(() => {}, [])

    return (
        <LayoutList title="Add Claims" goBackPage='/claims'>
            <div className="mt-20 select-none w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-max px-4 gap-2 pb-4 overflow-y-scroll scroll-display-none">
                <Link href="/eca/claims/action/mileage" className="w-full p-4 flex flex-row gap-3 items-start bg-white dark:bg-gray-700 drop-shadow-md hover:drop-shadow-sm rounded-3xl cursor-pointer">
                        <div className="w-auto flex place-content-center items-center p-2 bg-blue-400 rounded-full">
                            <SpeedDark className="w-12 h-12 p-1" />
                        </div>
                        <div className="w-4/5 h-full flex flex-col">
                            <div className="w-full text-lg font-semibold text-black dark:text-white">Mileage</div>
                            <div className="w-full text-xs font-normal  text-blue-400">Claim Category</div>
                            <div className="w-full text-xs font-normal text-gray-400 mt-2">Claim transactions for trips by kilometers</div>
                        </div>
                </Link>
                <Link href="/eca/claims/action/other" className="w-full p-4 flex flex-row gap-3 items-start bg-white dark:bg-gray-700 drop-shadow-md hover:drop-shadow-sm rounded-3xl cursor-pointer">
                    <div className="w-auto flex place-content-center items-center p-2 bg-green-400 rounded-full">
                        <OtherClaimDark className="w-12 h-12 p-1" />
                    </div>
                    <div className="w-4/5 h-full flex flex-col">
                        <div className="w-full text-lg font-semibold text-black dark:text-white">Other Claims</div>
                        <div className="w-full text-xs font-normal  text-blue-400">Claim Category</div>
                        <div className="w-full text-xs font-normal text-gray-400 mt-2">Claim transactions for entertainment and non-entertainment activities</div>
                    </div>
                </Link>
            </div>
        </LayoutList>
    )
}