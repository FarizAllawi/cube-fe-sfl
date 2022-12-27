import axios from 'configs/kch-office/axios'
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/router"
import { useTheme } from "next-themes"
import Link from 'next/link'
import Image from 'next/image'
import queryString from 'query-string'
import errorHandler from 'configs/errorHandler'
import { toast } from 'react-toastify'


import Button from "components/eca/Button"
import LayoutDetail from "components/eca/Layout/Detail"
import ShowDocument from "components/eca/Document/Show"
import Modals from "components/eca/Modals"
import BadgeStatus from 'components/eca/Badge'

import useUserECA from 'pages/api/eca/user'
import useClaim from 'pages/api/eca/claim'
import useNotification from 'pages/api/eca/notification'

import capitalizeEachWord from 'helpers/capitalizeEachWord'
import formatDate from 'helpers/formatDate'
import PencilDark from '/public/images/svg/eca/pencil-dark.svg'
import TrashDark from '/public/images/svg/eca/trash-dark.svg'
import SearchDark from '/public/images/svg/eca/search-dark.svg'
import PDFIcon from '/public/images/svg/eca/pdf-red.svg'

function CardClaims(props) {

    const { data } = props
    const [deleteClicked, setDeleteClicked] = useState('')
    const [claimMedia, setClaimMedia] = useState([])

    const [fetchStatus, setFetchStatus] = useState(false)
    const { getClaimOtherMedia } = useClaim()

    const imageLoader = ({src}) => {
        return src
    }

    const getClaimMedia = useCallback(async () => {
        let claimOTherMedia = await getClaimOtherMedia(data.hasOwnProperty('coid') ? data?.coid : data?.cmid)
        setClaimMedia(claimOTherMedia)
    },[data, getClaimOtherMedia])

    useEffect(() => {
        if (!fetchStatus) {
            getClaimMedia()
            setFetchStatus(true)
        }
    },[fetchStatus, getClaimMedia])

    return (
        <div className="w-full py-4 px-3 flex flex-col gap-2 items-start bg-white dark:bg-gray-700 drop-shadow-md hover:drop-shadow-sm rounded-3xl cursor-pointer">
            <div className="w-full flex flex-row uppercase font-light tracking-wide text-blue-300 divide-x-2" style={{ fontSize: '10px' }}>
                    <BadgeStatus type='badge' status={data.status_approval} feature={props.type}/>
            </div>  

            <div className="w-full flex flex-row gap-2 mt-2.5">
                <div className="w-2/12 h-full">
                    {
                        claimMedia?.length > 0 && (
                            <div className="relative w-14 h-14 rounded-full border-4 border-blue-300" onClick={() => props.documentClicked(claimMedia)}>
                            {
                                    claimMedia[0]?.extension  === 'pdf' ? (
                                        <div className="w-full h-full flex place-content-center items-center bg-gray-700 rounded-full">
                                            <PDFIcon className="w-full h-full p-3"/>
                                        </div>
                                    ) : (
                                        <Image loader={imageLoader} src={`/api/getFile/${props.type === 'other' ? data.upload_prove : data.upload_start}`} fill className="object-cover rounded-full" alt="Image-Document-1"/>
                                    )
                                }
                                
                                { (claimMedia.length - 1 !== 0) && (
                                    <div className="absolute p-0.5 bg-blue-400 -top-1 right-0 rounded-full text-xs font-semibold tracking-widest text-white">
                                        +{claimMedia.length - 1}
                                    </div>
                                )}

                                {/* <Image loader={imageLoader} src={`${ process.env.NEXT_PUBLIC_API_STORAGE}/files/get?filePath=${props.type === "other" ? data.upload_prove : data.upload_start}`} layout="fill" className="object-cover rounded-full" alt={props.title}/> */}
                            </div>
                        )
                    }
                </div>
                <div className="w-7/12 h-full flex flex-col gap-2">
                    <div className="w-full pl-1 text-sm font-semibold text-black dark:text-white leading-4">{props.type === 'other' ? data.co_type.split('-')[1] : "Claim Mileage"}</div>
                    <div className="w-full pl-1 text-sm font-normal text-black dark:text-white">IDR {new Intl.NumberFormat('de-DE').format(data.amount)}</div>
                    <div className="w-full pl-1 text-xs text-gray-400 font-light dark:text-gray-300">
                        <div className="w-full text-xs flex flex-row gap-2" style={{ fontSize: '11px'}}>
                            <div>{data.createdt !== undefined && data.createdt !== null ? formatDate(new Date(Date.parse(data.createdt))) : '-'}</div>
                        </div>
                    </div>
                    <div className="w-full pl-1 text-xs font-normal text-gray-400" style={{ fontSize: '11px'}}>Description : {data.co_desc}</div>
                    { data.reject_desc && (<div className="w-full pl-1 text-xs font-medium text-black dark:text-gray-300" style={{ fontSize: '11px'}}>Reason: <span className="text-red-400">{data.reject_desc}</span></div>)}
                </div>
                <div className="w-3/12 h-full flex flex-row gap-1 place-content-end items-center">
                    {
                        (props.type === 'other' ? data.status_approval === 3 : props.type === 'mileage' && data.status_approval === 4 ) ? (
                            <>
                                <div className="w-8 h-8">
                                    <Link href={`${data.hasOwnProperty('coid') ? `/eca/claims/action/other?coid=${data.coid}&chid=${props.chid}&status=update` : `/eca/claims/action/mileage?cmid=${data.cmid}&chid=${props.chid}&status=update`}`}>
                                        <div className="w-full h-full flex place-content-center items-center bg-yellow-400 hover:bg-yellow-500 rounded-full">
                                            <PencilDark className="p-1"/>
                                        </div>
                                    </Link>
                                </div>
                                <div className="w-8 h-8 ">
                                    <div className="w-full h-full flex place-content-center items-center bg-red-400 hover:bg-red-500 rounded-full" onClick={() => deleteClicked === '' ?  props.deleteClicked(data.hasOwnProperty('coid') ? `delete-${data.coid}`:  `delete-${data.cmid}`) : props.deleteClicked('')}>
                                        <TrashDark className="p-1" />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="w-8 h-8">
                                {/* <Link href={`/rating?id=${data.coid}`}>
                                    <div className="w-full h-full flex place-content-center items-center bg-blue-400 hover:bg-blue-500 rounded-full">
                                        <SearchDark className="p-1" />
                                    </div>
                                </Link> */}
                                <Link href={`${data.hasOwnProperty('coid') ? `/eca/claims/action/other?coid=${data.coid}&chid=${props.chid}&status=view` : `/eca/claims/action/mileage?cmid=${data.cmid}&chid=${props.chid}&status=view`}`}>
                                    <div className="w-full h-full flex place-content-center items-center bg-blue-400 hover:bg-blue-500 rounded-full">
                                        <SearchDark className="p-1" />
                                    </div>
                                </Link>
                            </div>
                        )
                    }
                    
                </div>
            </div>
            
            

            <div className="w-full flex flex-row place-content-start items-center mt-2 tracking-wide font-normal text-gray-400" style={{ fontSize: '10px'}}>
                {
                    props.type === 'mileage' && (
                        <>
                            <div className="w-1/2 flex flex-row gap-2">
                                <div>SUPERIOR APPROVAL:</div>
                                <div>{data.superior_dt !== undefined  && data.superior_dt !== null ? formatDate(new Date(Date.parse(data.superior_dt))) : '-'}</div>
                            </div>
                            <div className="w-1/2 flex flex-row gap-2">
                                <div>HRD APPROVAL:</div>
                                <div>{data.superior_dt !== undefined  && data.superior_dt !== null ? formatDate(new Date(Date.parse(data.superior_dt))) : '-'}</div>
                            </div>
                        </>
                    )
                }
                {
                    props.type === 'other' && (
                        <>
                            <div className="w-full flex flex-row gap-2">
                                <div>SUPERIOR APPROVAL:</div>
                                <div>{data.superior_dt !== undefined  && data.superior_dt !== null ? formatDate(new Date(Date.parse(data.superior_dt))) : '-'}</div>
                            </div>
                        </>
                    )
                }
                    
            </div>
        </div>
    )
}

// export async function getServerSideProps(context) {

//     return {
//          props: { 
//         } 
//     }
// }

export default function Claims(props) {

    const router = useRouter()
    const { insertNotification, sendEmail } = useNotification()
    const { 
        getCHBundle,
        getClaimOtherMedia,
        deleteClaimOtherMedia,
        deleteClaimHeader,
        deleteClaimOther,
        deleteClaimMileage,
        updateClaimHeader,
        updateClaimOther,
        updateClaimMileage,
        isLoading
    } = useClaim()
    const { getDetailUser, getUserByNik } = useUserECA()

    // console.log(props.data.item1)

    const [fetchStatus, setFetchStatus] = useState(false)
    const [user, setUser] = useState({})
    
    const [dataClaim, setDataClaim] = useState([])
    const [claimHead, setClaimHead] = useState([])
    const [deleteClicked, setDeleteClicked] = useState('')
    const [documentClicked, setDocumentClicked] = useState([])

    const submitClaimHeader = async (chid) => {
        // Validate End Trip Before Submit
        let detailUser = await getDetailUser()
        let detailSuperior = await getUserByNik(detailUser.superiorNIK)
        
        let statusEndTrip = true
        dataClaim.item2.map( (item, index) => {
            if ((item.end_km === 0 || item.end_km === undefined) &&
                (item.upload_end === '' || item.upload_end === undefined)) {
                return statusEndTrip = false
            }
        })

        if (statusEndTrip) {

            await Promise.all([
                updateClaimHeader({
                    chid: chid, uid_user: user.id, status: 2, rating: 0, is_active:1 
                }),
                dataClaim.item2.map( (item, index) => {
                    updateClaimMileage({
                        cmid: item.cmid,
                        chid: item.chid,
                        upload_start: item.upload_start,
                        upload_end: item.upload_end,
                        start_km: item.start_km,
                        end_km: item.end_km,
                        metadata: item.metadata,
                        business_partner: "SFL",
                        superiorName: item.superiorName,
                        status_approval: 3,
                        superior_approval:2,
                        hrd_approval:3
                    })
                    
                }),
                dataClaim.item3.map( (item, index) => {
                    updateClaimOther({
                        coid: item.coid,
                        chid: chid,
                        co_type: item.co_type,
                        co_desc: item.co_desc,
                        amount: parseInt(item.amount),
                        upload_prove: item.upload_prove,
                        business_partner: item.business_partner,
                        status_approval: 2,
                        superiorName: item.superiorName,
                        superior_approval: 2,
                        superior_dt: '',
                        is_active: 1,
                        reject_desc: "",
                        activity_dt: item.activity_dt,
                        activity_location_name: item.activity_location_name,
                        activity_location_address: item.activity_location_address,
                        business_partner_job_position: item.business_partner_job_position,
                        business_partner_company: item.business_partner_company,
                        business_partner_type: item.business_partner_type
                    })
                }),
            ]);

            await insertNotification({
                nik: detailUser.superiorNIK,
                header: 'claims-Claim Need Approval',
                description: `Claim ${chid} from ${capitalizeEachWord(detailUser.name)} needs your approval`,
            })

            sendEmail({
                email: detailSuperior.email,
                header: 'Claim Need Approval',
                description: `Claim ${chid} from ${capitalizeEachWord(detailUser.name)} needs your approval`
            })

            
            setTimeout(() => {
                 toast.success("Claim header submited successfully")
                 router.push('/eca/claims') 
            }, 300)
            
        }
        else errorHandler("There are unfinished claim mileages")
    }

    const deleteClaimOthers = async () => {
        let id = deleteClicked.split('-')[1]
        let claimMedia = await getClaimOtherMedia(id)

        if (claimMedia?.length !== 0 && claimMedia !== undefined) {
            await Promise.all(
                claimMedia?.map((item) => {
                    deleteClaimOtherMedia(item.coid)
                    new Promise((resolve, reject) => {
                        const xhr = new XMLHttpRequest()
                        xhr.open('DELETE', `/api/deleteFile=${item.path}`)
                        // xhr.withCredentials = true
                        xhr.setRequestHeader('Access-Control-Allow-Origin', `${process.env.NEXT_PUBLIC_API_STORAGE}`)
                        xhr.onload = () => {
                            console.log("Success Delete File")
                        }
                        xhr.onerror = (evt) => { reject(evt) }
                        xhr.send()
                    })
                })
            )
        }
        
        `${id[0]}${id[1]}` === 'CO' ? await deleteClaimOther(id) : await deleteClaimMileage(id)

        if (dataClaim.item2.length <= 1 && dataClaim.item3.length <= 1) {
            await deleteClaimHeader(claimHead[0].chid)
            router.push('/eca/claims')
        }
        else setTimeout(() => router.reload(), 500)
    }

    // Backup fetch data if getServerSideProps not working
    const getDataClaim =  useCallback( async () => {
        let { chid } = router.query
        let claim = await getCHBundle(chid)
        let userData = await getDetailUser()

        setUser(userData)
        
        if (claim?.item2?.length > 0 || claim?.item3?.length > 0) {
            setDataClaim(claim)
            setClaimHead(claim.item1)

        } else router.push('/404')

    }, [getCHBundle, getDetailUser, router])


    useEffect(() => {
        if (!fetchStatus) {
            getDataClaim()
            setFetchStatus(true)
        }
    }, [fetchStatus, getDataClaim])

    return (
        <>
        <LayoutDetail title="Detail of Claims" 
                      detailId={router.query.id} 
                      status={claimHead[0]?.status !== undefined  && claimHead[0]?.status === 3 ? 'draft' : 'view'}
                    //   status={claimHead[0].status}
                      defaultBackPage='/eca/claims' 
                      isSubmitLoading={isLoading}
                      onSubmitClick={() => user.id !== undefined ? submitClaimHeader(claimHead[0].chid) : false}>

            <div className="w-full px-4 mt-20 select-none">
                <p className="font-bold text-base md:text-lg text-center">Claim : {claimHead[0]?.chid}</p>
            </div>

            <div className={`${deleteClicked !== '' ? 'overflow-y-hidden ' : 'overflow-y-scroll scroll-display-none'} select-none w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-max px-4 gap-2 pb-20`}>
                {
                    dataClaim.item2?.map((item, index) => {
                        return (
                            <CardClaims key={index} data={item} chid={claimHead[0].chid} type="mileage" documentClicked={document => setDocumentClicked(document)} deleteClicked={deleteClick=> setDeleteClicked(deleteClick)}/>
                        )
                    })
                }

                {
                    dataClaim.item3?.map((item, index) => {
                        return (
                            <CardClaims key={index} data={item} chid={claimHead[0].chid} type="other" documentClicked={ document => setDocumentClicked(document)} deleteClicked={deleteClick=> setDeleteClicked(deleteClick)}/>
                        )
                    })
                }
            </div>  
            
        </LayoutDetail>
        {
            documentClicked.length !== 0 && (
                <div className="w-screen h-screen absolute top-0 z-40 ">
                    <ShowDocument data={documentClicked} onClose={() => setDocumentClicked([]) }/>
                </div>
            )
        }
        {
            (deleteClicked !== '') && (
                <div className="absolute top-0 z-40 ">
                    <Modals type='danger' 
                            size='small' 
                            title="Delete Claim"
                            caption="Are you sure you want to delete this claim?"
                            onClose={() => setDeleteClicked('')}>
                            <div className="w-full flex flex-row gap-2 mt-5 mb-5">
                                <div className="w-1/2 ">
                                    <Button size="flex" className="select-none bg-red-400 hover:bg-red-500 py-3 text-xs xl:text-sm text-white" onClick={() => setDeleteClicked('')}>NO, CANCEL</Button>
                                </div>
                                <div className="w-1/2">
                                    <Button size="flex" className="select-none bg-green-400 hover:bg-green-500 py-3 text-xs xl:text-sm text-white" isLoading={isLoading} onClick={() => deleteClaimOthers()}>YES, PROCEED!</Button>
                                </div>
                            </div>
                    </Modals>
                </div>
            )
        }
        </>
    )
}