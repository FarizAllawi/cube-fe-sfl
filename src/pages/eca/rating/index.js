import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'

import GridColumn from "components/Grid/Column"
import ShowDocument from "components/Document/Show"
import Layout from "components/Layout/List"
import Modals from 'components/Modals'
import Button from "components/Button"
import Textarea from "components/Forms/Textarea"

import errorHandler from "configs/errorHandler"

import useClaim from 'pages/api/claim'
import useRating from 'pages/api/rating'
import useUser from 'pages/api/user'

import useForm from "helpers/useForm"

import ClaimDark from '/public/images/svg/claim-dark.svg'
import ClaimLight from '/public/images/svg/claim-light.svg'
import BTBDark from '/public/images/svg/btb-dark.svg'
import BTBLight from '/public/images/svg/btb-light.svg'
import StarLight from '/public/images/svg/star-light.svg'
import StarDark from '/public/images/svg/star-dark.svg'
import formatDate from "helpers/formatDate"

function CardRating(props) {
    
    const {
        data
    } = props

    const {theme} = useTheme()
    const starWrapper = useRef(null)

    const [rating, setRating] = useState( data?.rating !== undefined ? data.rating : 0 )
    const { getCHBundle } = useClaim()
    const [typeClaim, setTypeClaim] = useState('')
    // const [claimMedia, setClaimMedia] = useState([])
    const [ dataClaim , setDataClaim ] = useState([])
    const [ fetchStatus, setFetchStatus] = useState(false)
    const [starPoint, setStarPoint] = useState(rating !== 0 ? `${data?.chid}-${rating}` : 0)

    const getTypeClaim = async () => {
        if (data?.coid !== undefined ) {
            setTypeClaim('claim-other')
            setClaimMedia(await getClaimOtherMedia(data?.coid))
        }
        if (data?.cmid !== undefined ) {
            setTypeClaim('claim-mileage')
            setClaimMedia(await getClaimOtherMedia(data?.cmid))
        }
        if (data?.btb !== undefined ) setTypeClaim('btb')
    }

    const getAmount = (mileage, others) => {
        let total = 0
        mileage?.map((item) => {
            total += item.amount
        })
        others?.map((item) => {
            total += item.amount
        })
        return total
    }

    const getDataClaim = async () => {
        let dataClaim = await getCHBundle(data?.chid)
        setDataClaim(dataClaim)
        setFetchStatus(true)
    }

    const imageLoader = ({src}) => {
        return src
    }

    useEffect(() => {

        if ( dataClaim.length === 0 && !fetchStatus) getDataClaim()

        const hoverStar = (event) => {
            if (starWrapper && starWrapper.current.contains(event.target)) {
                if (event.target.id && rating === "" || rating === 0 ) setStarPoint(`${data?.chid}-${event.target.id}`)
                
            }
            if (starWrapper && !starWrapper.current.contains(event.target)) setStarPoint(data.rating !== '' ? `${data?.chid}-${rating}` : '')
        }
        
        window.addEventListener("mouseover", hoverStar)

        return () => {
            window.removeEventListener("mouseover", hoverStar)
        }
    }, [fetchStatus, dataClaim])

    return (
        <div className="w-full p-4 flex flex-row gap-1 border-2 border-slate-200 dark:border-gray-700  bg-zinc-50 dark:bg-gray-700 drop-shadow-sm rounded-3xl" >
            {/* 
            
                <div className="w-14 h-14 mr-3 flex bg-zinc-200 dark:bg-gray-900 rounded-full" >
            {
                typeClaim === 'claim-other' || typeClaim === 'claim-mileage' ? (
                    <>
                        {
                            claimMedia.length !== 0 && (
                                <div className="cursor-pointer w-auto h-full md:w-auto mr-3" onClick={ () => props.documentClicked(claimMedia)}>
                                    <div className="relative w-14 h-14 rounded-full border-4 border-blue-300">
                                    {
                                            claimMedia[0]?.extension  === 'PDF' ? (
                                                <div className="w-full h-full flex place-content-center items-center bg-gray-700 rounded-full">
                                                    <PDFIcon className="w-full h-full p-3"/> 
                                                </div>
                                            ) : (
                                                <Image loader={imageLoader} src={`${ process.env.NEXT_PUBLIC_API_STORAGE}/files/get?filePath=${claimMedia[0].path }`} layout="fill" className="object-cover rounded-full" alt={props.title}/>
                                            )
                                        }
                                        
                                        { (claimMedia?.length - 1 !== 0) && (
                                            <div className="absolute p-0.5 bg-blue-400 -top-1 right-0 rounded-full text-xs font-semibold tracking-widest text-white">
                                                +{claimMedia?.length - 1}
                                            </div>
                                        )}

                                        <Image loader={imageLoader} src={`${ process.env.NEXT_PUBLIC_API_STORAGE}/files/get?filePath=${props.type === 'other' ? data.upload_prove : data.upload_start}`} layout="fill" className="object-cover rounded-full" alt={props.title}/> 
                                    </div>
                                </div>
                            )
                        }
                    </>
                ) : (
                    <>
                    {
                        typeClaim === 'btb' && (
                            <>
                                {  theme === 'dark' ? <BTBDark className="w-full h-full p-1.5" /> : <BTBLight className="w-full h-full p-1.5" />}
                            </>
                        )
                    }
                    </>
                )
            }
            </div>
            
            
            
            
            */}
            
            
            <div className="w-full flex flex-col gap-2">
                <div className="w-full flex flex-row place-content-end items-center gap-1">
                    <Link href={
                                typeClaim === 'claim-other' ? (
                                    `/claims/action/other?coid=${data?.coid}&status=view`
                                ) : (
                                    typeClaim === 'claim-mileage' ? (
                                        `/claims/action/mileage?cmid=${data?.cmid}&status=view`
                                ) : (
                                    `/btb/action?bcid=${data?.bcid}&status=view`
                                ))
                            }>
                        <div className="cursor-pointer w-full flex place-content-start item-start text-base underline underline-offset-2 font-semibold text-black dark:text-white">
                             {/* {typeClaim === 'claim-other' ? data?.coid : typeClaim === 'claim-mileage' ? data?.cmid : data?.btb} */}
                            {data.chid}
                        </div>
                    </Link>
                    <div ref={starWrapper} className="cursor-pointer flex flex-row place-content-end items-end gap-1">
                        <div className="relative w-2/12 " >
                            <div id="1" className="absolute w-full h-full" onClick={() => {rating === "" || rating === 0 ? props.onRatingChange(`${data?.chid}-1`) : ''}}></div>
                            {
                                theme === 'dark' ? (
                                    <StarDark className="w-full"
                                      fill={ starPoint === `${data?.chid}-1` || 
                                             starPoint === `${data?.chid}-2` || 
                                             starPoint === `${data?.chid}-3` || 
                                             starPoint === `${data?.chid}-4` || 
                                             starPoint === `${data?.chid}-5` ?'#a16207' : '#ffffff'}/>
                                ) : (
                                    <StarLight className="w-full"
                                      fill={ starPoint === `${data?.chid}-1` || 
                                             starPoint === `${data?.chid}-2` || 
                                             starPoint === `${data?.chid}-3` || 
                                             starPoint === `${data?.chid}-4` || 
                                             starPoint === `${data?.chid}-5` ?'#a16207' : '#1b1b1b'}/>
                                )
                            }
                        </div>
                        <div className="relative w-2/12 " >
                            <div id="2" className="absolute w-full h-full" onClick={() => {rating === "" || rating === 0 ? props.onRatingChange(`${data?.chid}-2`) : ''}}></div>
                            {
                                theme === 'dark' ? (
                                    <StarDark className="w-full"
                                      fill={ starPoint === `${data?.chid}-2` || 
                                             starPoint === `${data?.chid}-3` || 
                                             starPoint === `${data?.chid}-4` || 
                                             starPoint === `${data?.chid}-5` ? "#d97706" : '#ffffff'}/>
                                ) : (
                                    <StarLight className="w-full"
                                      fill={ starPoint === `${data?.chid}-2` || 
                                             starPoint === `${data?.chid}-3` || 
                                             starPoint === `${data?.chid}-4` || 
                                             starPoint === `${data?.chid}-5` ? "#d97706" : '#1b1b1b'}/>
                                )
                            }
                            
                        </div>
                        <div className="relative w-2/12" >
                            <div id="3" className="absolute w-full h-full" onClick={() => {rating === "" || rating === 0 ? props.onRatingChange(`${data?.chid}-3`) : ''}}></div>
                            {
                                theme === 'dark' ? (
                                    <StarDark className="w-full"
                                      fill={ starPoint === `${data?.chid}-3` || 
                                             starPoint === `${data?.chid}-4` || 
                                             starPoint === `${data?.chid}-5`  ? "#f59e0b" : '#ffffff' }/>
                                ) : (
                                    <StarLight className="w-full"
                                      fill={ starPoint === `${data?.chid}-3` || 
                                             starPoint === `${data?.chid}-4` || 
                                             starPoint === `${data?.chid}-5` ? "#f59e0b" : '#1b1b1b' }/>
                                )
                            }
                            
                        </div>
                        <div className="relative w-2/12" >
                            <div id="4" className="absolute w-full h-full" onClick={() => {rating === "" || rating === 0 ? props.onRatingChange(`${data?.chid}-4`) : ''}}></div>
                            {
                                theme === 'dark' ? (
                                    <StarDark className="w-full"
                                      fill={ starPoint === `${data?.chid}-4` || 
                                             starPoint === `${data?.chid}-5` ? "#fbbf24" : '#ffffff'}/>
                                ) : (
                                    <StarLight className="w-full"
                                      fill={ starPoint === `${data?.chid}-4` || 
                                             starPoint === `${data?.chid}-5` ? "#fbbf24" : '#1b1b1b'}/>
                                )
                            }
                            
                        </div>
                        <div className="relative w-2/12" >
                            <div id="5" className="absolute w-full h-full" onClick={() => {rating === "" || rating === 0 ? props.onRatingChange(`${data?.chid}-5`) : ''}}></div>
                            {
                                theme === 'dark' ? (
                                    <StarDark className="w-full" fill={ starPoint === `${data?.chid}-5` ? "#fde047" : '#ffffff' }/>
                                ) : (
                                    <StarLight className="w-full" fill={ starPoint === `${data?.chid}-5` ? "#fde047" : '#1b1b1b'}/>
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className="w-full flex flex-col gap-2">
                    <div className="w-full text-sm font-semibold  dark:text-white">
                        IDR {new Intl.NumberFormat('de-DE').format(getAmount(dataClaim?.item2, dataClaim?.item3))}
                    </div>
                    <div className="w-full text-xs font-semibold text-gray-400 dark:text-white">{formatDate( data?.createdt !== undefined ? new Date(data?.createdt) : new Date())}</div>
                </div>
            </div>
        </div>
    )
}

export default function Rating(props) {

    const router = useRouter()

    const { user } = useUser()

    const { getClaimHeader, updateClaimHeader } = useClaim()
    const { getRatingData, updateRating } = useRating()

    const [fetchStatus, setFetchStatus] = useState(false)
    const [state, setState, newState] = useForm({
        dataRating: [],
        documentClicked: [],
        isLoading: false,
        feedBack: '',
        ratingClicked: ''
    })

    const getRating = async () => {
        let data = await getClaimHeader(user.id)
        let temp = [] 

        data?.map( item => {
            if (item.status == 0 && item.rating == 0) {
                temp.push(item)
            }
        })
        
        setFetchStatus(true)
        newState({
            dataRating: temp
        })

    }

    const updateClaimRating = async() => {
        let splitRatingClick = state.ratingClicked.split('-')
        let temp = {}

        state.dataRating?.map(item => {
            if (item.chid === splitRatingClick[0]) {
                temp = item
            }
        })

        let status = await updateClaimHeader({
            id: temp.id,
            chid: temp.chid,
            status: temp.status,
            uid_user: temp.uid_user,
            createdt: temp.createdt,
            rating: parseInt(splitRatingClick[1]),
            is_active: temp.is_active
        })
        
        if (status) toast.success("You have successfully rated this claim")
        else toast.error("Failed to rate this claim")

        // if (state.feedBack !== '') {
        //     let updateStatus = await updateRating(
        //         splitRatingClick[0],
        //         state.feedBack,
        //         splitRatingClick[1]
        //     )

        //     if (updateStatus) toast.success("Thank you for giving a rating")
        //     else errorHandler("There is an error when saving your ranking")
        // }
        // else errorHandler("Please Insert your feedback")

        setTimeout(() => {
            router.reload()
        }, 350)
    }

    useEffect(() => {
        if (!fetchStatus && user.nik !== undefined && state.dataRating.length === 0) getRating()
        
    },[user, fetchStatus, state.dataRating, state.ratingClicked])
    
    return (
        <Layout title="Rating" goBackPage="/" refresh={true}>

            <div className="w-full mt-20">
                {
                    state.dataRating.length > 0 ? (
                        <GridColumn>
                            {
                                state.dataRating.map((item, index) => {
                                    return (
                                        <div key={index} className="w-full">
                                            <CardRating data={item}
                                                        documentClicked={document => newState({documentClicked: document})}
                                                        onRatingChange={rating => {
                                                            newState({ratingClicked: rating})
                                                        }}
                                            />
                                        </div>
                                    )
                                })
                            }
                        </GridColumn>
                    ) : (
                        <>
                            {
                                fetchStatus && (
                                    <div className={`w-screen mt-52 flex flex-col place-content-center items-center`}>
                                        <h1 className="text-4xl font-bold">Yeay!</h1>
                                        <p className="text-sm mt-2 font-medium">You have no claim to rate</p>
                                    </div>
                                )
                            }
                        </>
                    )
                }
                
            </div>
            {
                (state.ratingClicked !== '') && (
                    <Modals typeClaim='danger' 
                            size='small' 
                            title="Rate Your Claim"
                            caption="Are you sure you want to rate this claim?"
                            onClose={() => newState({ratingClicked: ''})}>
                            {/* <Textarea name='feedBack' 
                                value={state.feedBack} 
                                onChange={setState} 
                                placeholder='Please insert your feedback'
                                rows={3}/> */}
                            <div className="w-full flex flex-row gap-2 mt-5 mb-5">
                                <div className="w-1/2 ">
                                    <Button size="flex" 
                                            className="select-none bg-red-400 hover:bg-red-500 py-3 text-xs xl:text-sm text-white" 
                                            onClick={() => newState({ratingClicked: ''})}>
                                        NO, CANCEL
                                    </Button>
                                </div>
                                <div className="w-1/2">
                                    <Button size="flex" 
                                            className="select-none bg-green-400 hover:bg-green-500 py-3 text-xs xl:text-sm text-white" 
                                            onClick={() => updateClaimRating()}
                                            isLoading={state.isLoading}>YES, PROCEED!</Button>
                                </div>
                            </div>
                    </Modals>
                )
            }

            {
                state.documentClicked.length !== 0 && (
                    <ShowDocument data={state.documentClicked} onClose={() => newState({documentClicked: []}) }/>
                )
            }
        </Layout>
    )
}