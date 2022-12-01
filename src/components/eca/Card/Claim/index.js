import { useState, useEffect } from 'react'
import Image from 'next/image'

import BadgeStatus from 'components/eca/Badge'

import useClaim from "pages/api/eca/claim"

import PDFIcon from '/public/images/svg/eca/pdf-red.svg'
import CloseDark from '/public/images/svg/eca/close-dark.svg'

export default function CardClaims(props) {

    const { data } = props
    const [claimMedia, setClaimMedia] = useState([])
    const { getClaimOtherMedia } = useClaim()

    const imageLoader = ({src}) => {
        return src
    }

    const getClaimMedia = async (id) => {
        setClaimMedia(await getClaimOtherMedia(id))
    }

    useEffect(() => {
        if (claimMedia?.length === 0) getClaimMedia(data.hasOwnProperty('coid') ? data.coid : data.cmid)
    },[claimMedia])


    return (
        <div className="w-full p-4 flex flex-row gap-1 bg-zinc-50 dark:bg-gray-900 drop-shadow-md rounded-3xl" >
        {
            claimMedia?.length > 0 && (
                <div className="cursor-pointer w-auto md:w-auto mr-3" onClick={ () => props.documentClicked(claimMedia)}>
                    <div className="relative w-16 h-16 lg:w-14 lg:h-14 rounded-full border-4 border-blue-300">
                    {
                        claimMedia[0]?.extension  === 'pdf' ? (
                            <div className="w-full h-full flex place-content-center items-center bg-gray-700 rounded-full">
                                <PDFIcon className="w-full h-full p-3"/>
                            </div>
                        ) : (
                            <Image loader={imageLoader} fill src={`/api/getFile/${props.type === 'other' ? data.upload_prove : data.upload_start}`} layout="fill" className="object-cover rounded-full" alt={props.title}/>
                        )
                    }
                    
                    { (claimMedia?.length - 1 !== 0) && (
                        <div className="absolute p-0.5 bg-blue-400 -top-1 right-0 rounded-full text-xs font-semibold tracking-widest text-white">
                            +{claimMedia?.length - 1}
                        </div>
                    )}
                            {/* <Image loader={imageLoader} src={`${ process.env.NEXT_PUBLIC_API_STORAGE}/files/get?filePath=${props.type === 'other' ? data.upload_prove : data.upload_start}`} layout="fill" className="object-cover rounded-full" alt={props.title}/> */}
                    </div>
                </div>
            )
        }
            <div className="w-5/6 flex flex-col gap-2">
                <div className="w-full text-sm font-semibold text-black dark:text-white">{props.type === 'other' ? data.co_type.split("-")[1] : 'Claim Mileage'}</div>
                <div className="w-full text-sm font-normal text-black dark:text-white">IDR {new Intl.NumberFormat('de-DE').format(data.amount)}</div>
                <div className="w-full text-xs font-normal text-gray-500">{data.co_desc}</div>
            </div>

            {
                props.feature === 'approval' ? (
                    <div className="ml-3 flex place-content-end items-center">
                        <div className="cursor-pointer w-8 h-8 p-2 flex place-content-center items-center bg-red-400 hover:bg-red-500 rounded-full"
                                onClick={() => props.deleteParticularClaim(props.type === 'other' ? `${data.chid}-${data.coid}` : `${data.chid}-${data.cmid}`)}>
                                <CloseDark />
                        </div>
                    </div>

                ) : (
                    <div className="w-1/4 flex place-content-end items-center">
                        <BadgeStatus type='badge' status={data.status_approval} feature={props.type} />
                    </div>
                )
            }
        </div>
    )
}
