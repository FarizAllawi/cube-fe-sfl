import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import Image from 'next/image'
import useForm from "helpers/useForm"

import useClaim from 'pages/api/eca/claim'
import useUser from 'pages/api/eca/user'

import errorHandler from 'configs/errorHandler'

import Input from 'components/eca/Forms/Input'
import Button from 'components/eca/Button'
import Upload from 'components/eca/Document/Upload'

import PDFIcon from '/public/images/svg/eca/pdf-red.svg'

export default function StartingKM(props) {

    const router = useRouter()
    const { cmid } = router.query
    const { chid } = router.query
    const { status } = router.query
    const { startKM } = props
    
    const [fetchStatus, setFetchStatus] = useState(false)
    const [mileageStatus, setMileageStatus] = useState('')
    const [isSubmitForm , setIsSubmitForm] = useState(false)
    const [isGetStartKM, setIsGetStartKm] = useState(false)
    const [claimHead, setClaimHead] = useState(chid !== undefined ? chid : '')
    const [user, setUser] = useState({})
    
    const { 
        getDraftClaimHead,
        getClaimMileageDetail,
        getClaimMileageMedia,
        getClaimOtherMedia,
        insertClaimHead,
        insertClaimMileage,
        updateClaimMileage,
        insertClaimOtherMedia
    } = useClaim()
    const { getDetailUser } = useUser()
    
    
    const [state, setState, newState] = useForm({
        submitStatus: false,
        // claimHeadId: startKM.claimHeadId,
        // claimMileageId: startKM.claimMileageId,
        // claimMileageStatusApproval: startKM.claimMileageStatusApproval !== undefined ? startKM.claimMileageStatusApproval : 4,
        // claimMileageSuperiorApproval: startKM.claimMileageSuperiorApproval !== undefined ? startKM.claimMileageSuperiorApproval : 3,
        // claimMileageHRDApproval: startKM.claimMileageHRDApproval !== undefined ? startKM.claimMileageHRDApproval : 4,
        // startingKM: startKM.startingKM !== undefined ? startKM.startingKM : 0,
        // startingKMPosition: {},
        // startingKMDocuments: [],
        // metadata: startKM.metadata !== undefined ? startKM.metadata : JSON.stringify(""),
        // claimMileageUploaded: startKM.claimMileageUploaded !== undefined ? startKM.claimMileageUploaded : [],
        // startingKMDocumentsProve: startKM.startingKMDocumentsProve  !== undefined ? startKM.startingKMDocumentsProve : '',
        // endingKMDocumentsProve: startKM.endingKMDocumentsProve !== undefined ? startKM.endingKMDocumentsProve : '',
        // endingKM: startKM.endingKM !== undefined ? startKM.endingKM : 0,
        claimHeadId: '',
        claimMileageId: '',
        claimMileageStatusApproval: 4,
        claimMileageSuperiorApproval: 3,
        claimMileageHRDApproval: 4,
        startingKM: 0,
        startingKMPosition: {},
        startingKMDocuments: [],
        metadata: JSON.stringify(""),
        claimMileageUploaded: [],
        startingKMDocumentsProve:'',
        endingKMDocumentsProve: '',
        endingKM: 0,
        endingKMPosition : {},
        endingKMDocuments: [],
        documentClicked: [],
        
    })

    const imageLoader = ({src}) => {
        return src
    }

    const getClaimHead = useCallback( async () => {
        let claimHead = await getDraftClaimHead(user.id)
        if (claimHead === '') claimHead = await insertClaimHead({ uid_user: user.id, status: 3, rating: 0, is_active:1 })
        return claimHead
    }, [getDraftClaimHead, insertClaimHead, user.id])
    
    const startTripSubmit = useCallback(async () => {
        let userData = await getDetailUser(user.id)
        let claimMileage = cmid !== undefined ? cmid : ''
        let claimHeadId = claimHead
        
        if (claimHeadId === '' && !isSubmitForm) {
            claimHeadId = await getClaimHead()
            setClaimHead(claimHeadId)
        }

        let startingKMState = state 

        // Create Start Trip 
        if (claimHeadId !== '' && !isSubmitForm && mileageStatus === 'create') {

            let firstFile = state.startingKMDocuments[0]

            // Check is File Uploaded to Server
            if (!isSubmitForm && firstFile?.storagePath !== undefined) {

                // Insert Claim Mileage
                startingKMState['startingKMDocumentsProve'] = firstFile?.storagePath
                claimMileage = await insertClaimMileage({
                    chid: claimHeadId,
                    upload_start: firstFile?.storagePath,
                    upload_end: '',
                    start_km: parseInt(state.startingKM),
                    end_km: 0,
                    metadata: JSON.stringify({
                        startKMPosition:{},
                        endKMPosition: {},
                        distance: 0,
                    }),
                    business_partner: "ask",
                    superiorName: userData.superiorName,
                    status_approval: state.claimMileageStatusApproval,
                    superior_approval: state.claimMileageSuperiorApproval,
                    hrd_approval: state.claimMileageHRDApproval,
                })
            }

            if (claimMileage === '') {
                errorHandler("Failed to add mileage")
                router.push('/eca/claims')
            }

            if (claimMileage !== '' && claimMileage !== undefined) {
                startingKMState['claimMileageId'] = claimMileage
    
                // Insert Claim Other Media
                if (state.startingKMDocuments[0]?.storagePath !== '' && 
                    state.startingKMDocuments[0]?.storagePath !== undefined) {
                        
                    state.startingKMDocuments.map( async (item) => {
                        if (item.storagePath !== '' && item.storagePath !== undefined) {
                            await insertClaimOtherMedia({
                                coid: startingKMState.claimMileageId,
                                title: `${item?.name}`,
                                path: `${item?.storagePath}`,
                                extension: `${item?.extension.toLowerCase()}`,
                                is_active: 1
                            })
                        }
                    })

                    toast.success("Start Trip Successfully")
                }
            }
            else errorHandler("Failed to upload documents")
        }

        newState({ submitStatus: false })
        let statusApproval = state.claimMileageStatusApproval != undefined && state.claimMileageStatusApproval === 3 ? 'view' : 'update'
        // startingKMState['claimHeadId'] = claimHeadId
        // router.push(`/claims/action/mileage?cmid=${claimMileage}&chid=${claimHeadId}&status=${statusApproval}`)
        // props.nextStep()

        if ((status === 'view' || status === 'update') && state.startingKMDocumentsProve !== '' ) props.nextStep()
        else if (mileageStatus === 'create') router.push('/eca/claims')

    },[claimHead, cmid, getClaimHead, getDetailUser, insertClaimMileage, insertClaimOtherMedia, isSubmitForm, mileageStatus, newState, props, router, state, status, user.id])

    const updateTrip = useCallback( async () => {

        let startingKMState = state 

        // Update Claim Mileage for update File
        if (cmid !== undefined && !isSubmitForm && mileageStatus === 'view'){
            let firstFile = state.startingKMDocuments[0]
            
            if (!isSubmitForm && firstFile?.storagePath !== undefined) {

                let status = await updateClaimMileage({
                    cmid: cmid,
                    upload_start: firstFile?.storagePath,
                    upload_end: '',
                })

                // Insert Claim Other Media
                if (!status) errorHandler("Failed to update claim mileage")
                else {
                    // Insert Claim Other Media
                    let item = {}

                    state.startingKMDocuments.map( async (document) => {
                        if (document.storagePath !== '' && document.storagePath !== undefined) item = document
                    })

                    let claimOtherMedia = {
                        coid: cmid,
                        title: `${item?.name}`,
                        path: `${item?.storagePath}`,
                        extension: `${item?.extension.toLowerCase()}`,
                        is_active: 1
                    }

                    await insertClaimOtherMedia(claimOtherMedia)

                    let claimUploaded = [] 
                    claimUploaded.push(claimOtherMedia)

                    startingKMState['startingKM'] = startKM.startingKM
                    startingKMState['claimMileageUploaded'] = claimUploaded
                    startingKMState['startingKMDocumentsProve'] = item?.storagePath
                    props.onChange(startingKMState)
                    toast.success("Start Trip Updated Sucessfully")
                    return router.push(`/eca/claims/detail?chid=${chid}`)
                }
            }

        }

        setIsSubmitForm(false)
    },[chid, cmid, insertClaimOtherMedia, isSubmitForm, mileageStatus, props, router, startKM.startingKM, state, updateClaimMileage])

    const getLocation = useCallback( () => {
        navigator.geolocation.getCurrentPosition((position) => {
            newState({
                startingKMPosition: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
            })
        })  
    }, [newState])

    const getData = useCallback( async () => {
        let userData = await getDetailUser()
        
        if (userData.id !== undefined) setUser(userData)
        else errorHandler("There is an error when retrieving user data")

    },[getDetailUser] )

    useEffect(() => {
        if (!fetchStatus && !isGetStartKM && cmid !== undefined && chid !== undefined && (status == 'update' || status == 'view') && startKM.claimHeadId !== undefined && user.id === undefined) {
            
            // Get User Data
            getData()

            let metadata = JSON.parse(startKM.metadata)
            newState({
                claimHeadId: startKM.claimHeadId,
                claimMileageId: startKM.claimMileageId,
                claimMileageStatusApproval: startKM.claimMileageStatusApproval,
                claimMileageSuperiorApproval: startKM.claimMileageSuperiorApproval,
                claimMileageHRDApproval: startKM.claimMileageHRDApproval,
                startingKM: startKM.startingKM,
                startingKMPosition: metadata.startKMPosition,
                startingKMDocuments: [],
                metadata: JSON.stringify(""),
                claimMileageUploaded: startKM.claimMileageUploaded,
                startingKMDocumentsProve: startKM.startingKMDocumentsProve,
                endingKMDocumentsProve: startKM.endingKMDocumentsProve,
                endingKM: startKM.endingKM,
                endingKMPosition : metadata.endKMPosition,
            })
            
            setMileageStatus('view')
            setIsGetStartKm(true)
            setFetchStatus(true)
        } else if (!fetchStatus && cmid === undefined && chid === undefined && status === undefined) {
            // Get User Data
            getData()
            setMileageStatus('create')
            setFetchStatus(true)
        }


        if (user.id !== undefined &&  mileageStatus === 'create' && state.submitStatus === true && 
            state.startingKMDocuments[0]?.storagePath !== '' && state.startingKMDocuments[0]?.storagePath !== undefined) {
                startTripSubmit()
                setIsSubmitForm(true)
        }

        if (user.id !== undefined && !isSubmitForm  &&  mileageStatus === 'view' && state.submitStatus === true && 
            state.startingKMDocuments[0]?.storagePath !== '' && state.startingKMDocuments[0]?.storagePath !== undefined) {
                updateTrip()
                setIsSubmitForm(true)
        }

        if (user.id !== undefined  && state.startingKMDocumentsProve !== ""  && (mileageStatus === 'update' || mileageStatus === 'view') && state.submitStatus === true) {
            startTripSubmit()
            setIsSubmitForm(true)
        }

        if (state.startingKMPosition?.lat === undefined && status === undefined) getLocation()
        
    }, [fetchStatus, getData, getLocation, isSubmitForm, mileageStatus, startTripSubmit, isGetStartKM, chid, cmid, startKM, state, newState, status, updateTrip, user.id])

    console.log(mileageStatus)

    return (
        <>
        {
            state.claimMileageUploaded?.length > 0 && (mileageStatus === 'update' || mileageStatus === 'view') && (
                <div className="w-full md:px-0 pb-2 pt-4 flex flex-row">
                    <div className="cursor-pointer w-16 h-16 mr-4 relative " onClick={() => props.documentClicked(state.claimMileageUploaded)}>
                        {
                            state.claimMileageUploaded.map(item => {
                                if (item.path === state.startingKMDocumentsProve) {
                                    return (
                                        <>
                                            {
                                                item.extension  === 'pdf' ? (
                                                    <div className="w-full h-full flex place-content-center items-center bg-gray-700 rounded-full">
                                                        <PDFIcon className="w-full h-full p-3"/>
                                                    </div>
                                                ) : (
                                                    <Image loader={imageLoader} src={`/api/getFile/${item.path}`} fill className="object-cover rounded-full" alt="Image-Document-1"/>
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
            {
                (state.claimMileageStatusApproval === 4) && (
                    <div className="w-full">
                        {
                            state.startingKMDocumentsProve === '' && (
                                <Upload labelName="Upload Starting KM" 
                                        placeholder="Chose photo or drop your photos here"
                                        maxFiles={1}
                                        name="startingKMDocuments" 
                                        value={state.startingKMDocuments} 
                                        onChange={setState}
                                        uploadStatus={state.submitStatus}
                                        uniqueFolder='1'
                                        />    
                            )
                        }
                                
                    </div>
                )
            }

            <div className="relative w-full z-10">
                <Input type='number' 
                        name="startingKM" 
                        labelName="starting KM "  
                        value={status === 'update' ? startKM.startingKM : state.startingKM} 
                        placeholder="Input your start kilometer trip" 
                        onChange={setState}
                        isDisabled={mileageStatus === 'view' ? true : false}
                        isRequired/>
            </div>
            
            

            {/* {
                (state.startingKMPosition?.lng !== undefined && state.startingKMPosition?.lat !== undefined) && (
                    <div className="w-full flex flex-col mt-4">
                        <p className="w-full text-sm text-gray-500 dark:text-white font-semibold">Start Posisition</p>
                        <p className="w-full text-gray-500 dark:text-white" style={{ fontSize:"10px"}}>
                            lat: {state.startingKMPosition?.lat} <span className="ml-2">lng: {state.startingKMPosition?.lng}</span>
                        </p>

                        <div className="relative w-full h-56 mt-2 drop-shadow-md">
                            <iframe src={`https://www.google.com/maps/embed/v1/directions?key=AIzaSyC_IbrRNOAbp8i_cXx67R3JuEk0LnvfT2w&origin=${state.startingKMPosition?.lat}, ${state.startingKMPosition?.lng}&destination=${state.startingKMPosition?.lat}, ${state.startingKMPosition?.lng}`}  
                                    style={{ width: "100%", height:"100%",borderRadius: "1em"}}
                                    loading="lazy"
                                    referrerPolicy='no-referrer-when-downgrade'></iframe>
                        </div>

                    </div>
               )
            } */}
            


            <div className="w-full pt-2 pb-2 mt-10 flex place-content-end">
                {
                    // (state.startingKM !== 0 && state.startingKMPosition?.lat !== undefined && state.startingKMPosition?.lng !== undefined ) && (
                        <Button size="small" 
                                className='bg-green-400 hover:bg-green-500 text-white' 
                                isLoading={state.isLoading}
                                onClick={ () => {

                                    if (state.startingKMDocuments?.length > 0 && (startKM.startingKM !== 0 || state.startingKM !== 0 ) && ( status !== 'view' || mileageStatus === 'view' || mileageStatus === 'create' )) {
                                        newState({ submitStatus: true})
                                    }
                                    else if ( (state.startingKMDocumentsProve === "" || state.startingKMDocuments?.length === 0 ) && (startKM.startingKM === 0 || state.startingKM === 0 ) && (status !== 'view' || mileageStatus === 'view' || mileageStatus === 'create' )) {
                                        errorHandler("Please fill the form to continue")
                                        newState({ submitStatus: false})
                                    }
                                    else if( state.startingKMDocumentsProve !== ""  && state.startingKM !== 0 && mileageStatus === 'view' ) props.nextStep()
                                }}>
                            { mileageStatus === 'create'  && status !== 'update' && status !== 'view' && status !== 'change-state' ? 'Start Trip' : 'Next' }
                        </Button>
                    // )
                }
            </div>
            
        </>
    )
}