import errorHandler from 'configs/errorHandler'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import {toast} from 'react-toastify'
import Image from 'next/image'
import Link from 'next/link'
import useForm from "helpers/useForm"

import useClaim from 'pages/api/eca/claim'
import useUser from 'pages/api/eca/user'

import Input from 'components/eca/Forms/Input'
import Button from 'components/eca/Button'
import Upload from 'components/eca/Document/Upload'

import ArrowLeftDark from '/public/images/svg/eca/arrow-left-dark.svg'
import ArrowLeftLight from '/public/images/svg/eca/arrow-left-light.svg'
import PDFIcon from '/public/images/svg/eca/pdf-red.svg'

export default function EndingKM(props) {

    const {
        startKM
    } = props

    const router = useRouter()
    const { cmid } = router.query
    const { chid } = router.query
    const { status } = router.query

    const { 
        endTripClaimMileage, insertClaimOtherMedia
    } = useClaim()
    const { getDetailUser } = useUser()

    const [location, setLocation] = useState(false)
    const {theme, setTheme} = useTheme()
    const [mileageStatus, setMileageStatus] = useState('')
    const [isSubmitForm , setIsSubmitForm] = useState(false)
    const [user, setUser] = useState({})

    const metadata = JSON.parse(startKM.metadata)

    const imageLoader = ({src}) => {
        return src
    }

    const [state, setState, newState] = useForm({
        submitStatus: false,
        startingKMPosition: {
            lat: startKM.startingKM.lat !== undefined ? startKM.startingKM.lat : metadata?.startKMPosition?.lat !== undefined ? metadata.startKMPosition.lat : {},
            lng: startKM.startingKM.lng !== undefined ? startKM.startingKM.lng : metadata?.startKMPosition?.lng !== undefined ? metadata.startKMPosition.lng : {}
        },
        endingKMDocumentsProve: startKM.endingKMDocumentsProve,
        endingKM: (status === 'update' || status === 'view') && startKM.endingKM !== undefined ?  startKM.endingKM : 0,
        endingKMPosition: {
            lat:startKM?.endingKMPosition !== undefined ?  startKM?.endingKMPosition.lat :  metadata.endKMPosition?.lat,
            lng: startKM?.endingKMPosition !== undefined ?  startKM?.endingKMPosition.lng : metadata.endKMPosition?.lng
        },
        endingKMDocuments: [],
        distance: metadata.distance !== undefined ? metadata.distance : 0,
        claimMileageUploaded: startKM.claimMileageUploaded,
        claimMileageStatusApproval: startKM.claimMileageStatusApproval,
        claimMileageSuperiorApproval: startKM.claimMileageSuperiorApproval
    })

    const endTripSubmit = useCallback( async () => {
        let userData = await getDetailUser(user.id)
        let data = {
            cmid: cmid,
            chid: chid,
            upload_start: startKM.startingKMDocumentsProve,
            upload_end: startKM.endingKMDocumentsProve,
            start_km: parseInt(startKM.startingKM),
            end_km: parseInt(state.endingKM) < parseInt(startKM.startingKM) ? parseInt(startKM.startingKM) : parseInt(state.endingKM),
            metadata: JSON.stringify({
                startKMPosition: {},
                endKMPosition: {},
                distance: state.distance
            }),
            business_partner: "ask",
            superiorName: userData.superiorName,
            status_approval: 3,
            superior_approval: 2,
            hrd_approval: 3,
        }

        // CREATE END TRIP
        if (!isSubmitForm && mileageStatus === 'create') {
            let firstFile = state.endingKMDocuments[0]

            data['upload_end'] = firstFile?.storagePath
            if (firstFile?.storagePath !== undefined) {
                let claimMileage = await endTripClaimMileage(data)

                if (claimMileage !== '') {
                    if ((state.claimMileageStatusApproval === 4 || mileageStatus === 'create') && 
                        firstFile?.storagePath !== undefined !== undefined ){
    
                        // Insert Claim Other Media
                        if (data['cmid'] !== '' && data['chid'] !== undefined) {
                            // console.log("RUN CREATE END TRIP UPLOAD DOCUMENTS")
                            await Promise.all(
                                state.endingKMDocuments.map( (item) => {
                                    if (item.storagePath !== '' && item.storagePath !== undefined) {
                                        insertClaimOtherMedia({
                                            coid: data['cmid'],
                                            title: `${item?.name}`,
                                            path: `${item?.storagePath}`,
                                            extension: `${item?.extension.toLowerCase()}`,
                                            is_active: 1
                                        })
                                    }
                                })
                            );
                        }
                        else {                        
                            // SET ERROR MESSAGE
                            errorHandler("Failed to Save Documents")
                        }
                    }
    
                    toast.success("End Trip Successfully")
                    router.push('/eca/claims')
                }
                else errorHandler("There is an error when udate your claim mileage")
                newState({ submitStatus: false })

            }
            
        }     
        // newState({ submitStatus: false })
        // router.push('/claims')
    }, [chid, cmid, endTripClaimMileage, getDetailUser, insertClaimOtherMedia, mileageStatus, newState, router, startKM, state, user.id])

    const haversine = (start, end) => {
        const toRad = (x) => {
            return x * Math.PI / 180;
        }

        const R = 6371; // km

        const dLat = toRad(end.lat - start.lat);
        const dLon = toRad(end.lng - start.lng);
        const lat1 = toRad(start.lat);
        const lat2 = toRad(end.lat);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;

        return d;
    }

    const getLocation = useCallback(() => {
        // navigator.geolocation.getCurrentPosition((position) => {

        //     let distance = haversine(state.startingKMPosition, {
        //                                 lat: position.coords.latitude,
        //                                 lng: position.coords.longitude
        //                             })

        //     distance = Math.round(distance)
        //     let endKM = parseInt(startKM.startingKM) + distance
        //     newState({
        //         distance: distance,
        //         endingKM: endKM,
        //         endingKMPosition: {
        //             lat: position.coords.latitude,
        //             lng: position.coords.longitude
        //         },
        //     })
        // })  

        let endKM = parseInt(startKM.startingKM) + 0
            newState({
                distance: 0,
                endingKM: endKM,
                endingKMPosition: {},
            })

            setLocation(true)
    }, [newState, startKM.startingKM])

    const fetchUser = useCallback( async () => {
        let userData = await getDetailUser()

        if (userData.id !== undefined) setUser(userData)
        else errorHandler("There is an error when retrieving user data")

    }, [getDetailUser])

    useEffect(() => {
        if (cmid !== undefined && chid !== undefined && status == 'update' && mileageStatus === '' ) {
            fetchUser()
            setMileageStatus('create')
        }
        else if (cmid !== undefined && chid !== undefined && status === 'view' && mileageStatus === '') setMileageStatus('view')

        if (mileageStatus === 'create' && state.submitStatus === true) {
            if (state.endingKMDocuments[0]?.storagePath !== '' && state.endingKMDocuments[0]?.storagePath !== undefined) {
                endTripSubmit()
                setIsSubmitForm(true)
            }
            else if (state.endingKMDocuments[0]?.storagePath !== undefined) errorHandler('Please upload End KM documents')
        }

        if (mileageStatus === 'view'  && state.submitStatus === true) router.push(`/eca/claims/detail?chid=${chid}`)
        if ( !location && state.claimMileageStatusApproval === 4) getLocation()

    }, [state, user, isSubmitForm, cmid, chid, status, mileageStatus, router, location, fetchUser, getLocation, endTripSubmit])

    return (
        <>
            {
                state.claimMileageUploaded?.length > 0 && mileageStatus === 'view' && (
                    <div className="w-full md:px-0 pb-2 pt-4 flex flex-row">
                        <div className="cursor-pointer w-16 h-16 mr-4 relative " onClick={() => props.documentClicked(state.claimMileageUploaded)}>
                            {
                                state.claimMileageUploaded.map(item => {
                                    if (item.path === state.endingKMDocumentsProve) {
                                        return (
                                            <>
                                                {
                                                    item.extension  === 'pdf' ? (
                                                        <div className="w-full h-full flex place-content-center items-center bg-gray-700 rounded-full">
                                                            <PDFIcon className="w-full h-full p-3"/>
                                                        </div>
                                                    ) : (
                                                        <Image loader={imageLoader} src={`/api/getFile/${item.path}`} fill className="object-cover rounded-full" alt={item.title}/>
                                                    )
                                                }
                                            </>
                                        )
                                    }
                                })
                            }                  
                        </div>
                        <div className="w-3/4 pl-4 md:pl-2">
                            <p className="text-md text-gray-500 dark:text-white font-semibold">Document Uploaded</p>
                            <p className="mt-1 text-xs text-gray-500 dark:text-white font-normal" style={{ fontSize: "12px" }}>The document that you uploaded as Approve. Click document beside to see your file.</p>
                        </div>
                    </div>
                ) 
            }

            {/* <div className="w-full flex flex-col mt-4">
                <p className="w-full text-sm text-gray-500 dark:text-white font-semibold">Current Posisition</p>
                <p className="w-full text-gray-500 dark:text-white" style={{ fontSize:"10px"}}>
                    lat: {state.endingKMPosition?.lat} <span className="ml-2">lng: {state.endingKMPosition?.lng}</span>
                </p>

                <div className="relative w-full h-56 mt-2 drop-shadow-md">
                    <iframe src={`https://www.google.com/maps/embed/v1/directions?key=AIzaSyC_IbrRNOAbp8i_cXx67R3JuEk0LnvfT2w&origin=${startKM.startingKMPosition?.lat}, ${startKM.startingKMPosition?.lng}&destination=${state.endingKMPosition?.lat}, ${state.endingKMPosition?.lng}`}  
                            style={{ width: "100%", height:"100%",borderRadius: "1em"}}
                            loading="lazy"
                            referrerPolicy='no-referrer-when-downgrade'></iframe>
                </div>
            </div> */}
            
            {
                (mileageStatus !== 'view') && (
                    <div className="w-full">
                        <Upload labelName="Upload End KM" 
                                placeholder="Chose photo or drop your photos here"
                                maxFiles={1}
                                name="endingKMDocuments" 
                                value={state.endingKMDocuments} 
                                onChange={event => newState({ endingKMDocuments: event.target.value })}
                                uploadStatus={state.submitStatus}
                                uniqueFolder='1'
                                />   
                    </div>
                )
            }

            {
                // (state.endingKMPosition?.lng !== undefined && state.endingKMPosition?.lat !== undefined) && (
                    <>
                        <div className="relative w-full z-10">
                            <Input type='number' 
                                    name="endingKM" 
                                    labelName="End KM "  
                                    value={state.endingKM} 
                                    placeholder="Input your end kilometer trip" 
                                    isDisabled={mileageStatus === 'view' ? true : false}
                                    onChange={ (event) => {
                                        let distance = parseInt(event.target.value) - parseInt(startKM.startingKM)

                                        if (parseInt(distance)) {
                                            if (parseInt(distance) > 0) {
                                                newState({
                                                    distance: distance,
                                                    endingKM: event.target.value,
                                                })
                                            } else {
                                                newState({
                                                    distance: 0,
                                                    endingKM: event.target.value,
                                                })
                                            }

                                        } else {
                                            newState({
                                                distance: 0,
                                                endingKM: startKM.startingKM
                                            })
                                        }

                                    }}
                                    isRequired/>
                        </div>

                        <div className="relative w-full z-10">
                            <Input type='number' 
                                    name="distance" 
                                    labelName="Distance in KM "  
                                    value={state.distance} 
                                    placeholder="Input your end kilometer trip" 
                                    isDisabled={mileageStatus === 'view' ? true : false}
                                    onChange={ (event) => {
                                        let value = parseInt(event.target.value) === 'NaN' ? 0 : parseInt(event.target.value)
                                        let endKM = parseInt(startKM.startingKM) + parseInt(value)

                                        if (parseInt(endKM)) {
                                            newState({
                                                distance: event.target.value,
                                                endingKM: endKM
                                            }) 
                                        } else {
                                            newState({
                                                distance: 0,
                                                endingKM: startKM.startingKM
                                            })
                                        }
                                    }}
                                    isRequired/>
                        </div>

                    </>
                // )
            }
            

            <div className="w-full pt-2 pb-2 mt-10 flex flex-row place-content-end">
                <Link   href={`/eca/claims/action/mileage?cmid=${cmid}&chid=${chid}&status=${status === 'update' ? 'update' : status === 'view' ? 'view' : 'change-state'}`} 
                        className="w-1/2 select-none flex flex-row place-content-start items-center cursor-pointer" 
                        onClick={() => props.prevStep()}>
                        <div className="flex">
                            {
                                theme === 'dark' || (theme === 'system' && systemTheme === 'dark') ? <ArrowLeftDark className="rounded-full w-8/12" /> : <ArrowLeftLight className="rounded-full w-8/12" />
                            }
                        </div>
                        <div className="ml-2 flex text-black dark:text-white text-base">
                            Back
                        </div>
                </Link>
                
                <div className="w-1/2 flex place-content-end">    
                {
                    // (state.startingKMPosition.lat !== undefined && state.startingKMPosition.lng !== undefined ) && (
                        <Button size="small" 
                                className='bg-green-400 hover:bg-green-500 text-white' 
                                isLoading={state.isLoading}
                                onClick={ () => {
                                    if (status !== 'view') {
                                        
                                        if ( user.id !== undefined) {
                                            if (startKM.startingKMDocumentsProve === '') errorHandler("Please upload start trip document first")
                                            else if ( state.endingKMDocuments.length > 0 ) {
                                                newState({ submitStatus: true})
                                            }
                                            else errorHandler("Please fill the form to continue")

                                            
                                        }
                                        else {
                                            errorHandler("There is an error when retrieving user data")
                                            newState({ submitStatus: false})
                                        }
                                    }
                                    else router.push('/eca/claims/detail?chid='+chid)
                                }}>
                            { mileageStatus === 'create' || status === 'change-state'? 'End Trip' : mileageStatus === 'view' ? 'Done' : 'End Trip'}
                            {/* Submit */}
                        </Button>
                    // )
                }
                </div>
            </div>

        </>
    )
}
