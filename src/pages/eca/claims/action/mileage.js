import axios from 'configs/kch-office/axios'
import { toast } from 'react-toastify'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import useForm from "helpers/useForm"
import queryString from 'query-string'

import useClaim from 'pages/api/eca/claim'
import useUser from 'pages/api/eca/user'

import ShowDocument from 'components/eca/Document/Show'

import LayoutDetail from "components/eca/Layout/Detail"
import StartingKM from 'components/eca/Mileage/StartingKM'
import EndingKM from 'components/eca/Mileage/EndingKM'
import errorHandler from 'configs/errorHandler'

export async function getServerSideProps(context) {
    // Pass data to the page via props
    return { 
        props: { 
            data: {}
        }
    }
}

export default function Mileage(props) {

    const router = useRouter()
    const { cmid } = router.query
    const { chid } = router.query
    const { status } = router.query

    const { getDetailUser } = useUser()
    const { getClaimMileage, updateClaimMileage, getClaimOtherMedia, deleteClaimOtherMedia } = useClaim()

    const [fetchStatus, setFetchStatus] = useState(false)
    const [currentStep, setCurrentStep] = useState('startingKm')
    const [step, setStep] = useState(['startingKm', 'endingKm'])
    const [user, setUser] = useState({})

    const [otherStatus, setOtherStatus] = useState('')
    const [state, setState, newState] = useForm({
        steps: {
            starting: {
                title: "Starting KM",
                // description: "Please make sure that your GPS is on!",  // Kalo maps sudah bisa di uncomment
                description: " ",

            },
            ending: {
                title: "Ending KM",
                // description: "Please make sure that your GPS is on!", // Kalo maps sudah bisa di uncomment
                description: " ",
            }
        },
        startTripData: props.data,
        isLoading: false,
        mounted: false,
        documentClicked: [],
    })


    const nextStep = () => {
        const next = step.indexOf(currentStep) + 1
        if (next < step.length) {
            setCurrentStep(step[next])
        }
    }

    const prevStep = () => {
        const prev = step.indexOf(currentStep) - 1
        if (prev >= 0) {
            setCurrentStep(step[prev])
        }
    }

    // Backup fetch data if getServerSideProps not working
    const getDataClaim = useCallback( async () => {
        const claimMileage = await getClaimMileage(cmid)
        const claimMileageUploaded = await getClaimOtherMedia(cmid)
        const userData = await getDetailUser()
        
        if (claimMileage.length > 0) {
            if (userData.id !== undefined) {
                newState({
                    startTripData : {
                        claimHeadId: chid,
                        claimMileageId: cmid,
                        claimMileageStatusApproval: claimMileage[0].status_approval,
                        claimMileageSuperiorApproval: claimMileage[0].superior_approval,
                        claimMileageHRDApproval: claimMileage[0].hrd_approval,
                        startingKM: claimMileage[0].start_km,
                        startingKMPosition: JSON.parse(claimMileage[0].metadata).startKMPosition !== undefined ? JSON.parse(claimMileage[0].metadata).startKMPosition : {},
                        startingKMDocumentsProve: claimMileage[0].upload_start,
                        endingKM: claimMileage[0].end_km,
                        endingKMDocumentsProve: claimMileage[0].upload_end,
                        endingKMPosition: JSON.parse(claimMileage[0].metadata).endKMPosition !== undefined ? JSON.parse(claimMileage[0].metadata).endKMPosition : {},
                        metadata: claimMileage[0].metadata,
                        claimMileageUploaded: claimMileageUploaded
                    }
                })
        
                if (status === 'update' && claimMileage[0].upload_start !== '') setCurrentStep('endingKm')
                else setCurrentStep('startingKm')
                setFetchStatus(true)
            }
            else errorHandler("There is an error when retrieving user data")
        } else router.push('/404')


    }, [getClaimMileage, cmid, getClaimOtherMedia, getDetailUser, router, newState, chid, status])

    const deleteDocument = async (document) => {
        let indexCoMedia = null;
        let coMediaItem = {}
        let userData = await getDetailUser(user.id)
        let data = {
            claimHeadId: state.startTripData.claimHeadId,
            claimMileageId: state.startTripData.claimMileageId,
            claimMileageStatusApproval: state.startTripData.claimMileageStatusApproval,
            claimMileageSuperiorApproval: state.startTripData.claimMileageSuperiorApproval,
            claimMileageHRDApproval: state.startTripData.claimMileageHRDApproval,
            startingKM: state.startTripData.startingKM,
            startingKMPosition: state.startTripData.startKMPosition,
            startingKMDocumentsProve: state.startTripData.startingKMDocumentsProve,
            endingKM: state.startTripData.endingKM,
            endingKMDocumentsProve: state.startTripData.endingKMDocumentsProve,
            endingKMPosition: state.startTripData.endingKMPosition,
            metadata: state.startTripData.metadata,
            claimMileageUploaded: state.startTripData.claimMileageUploaded
        }

        // Check document if used in claimMil data for prove startingKM document
        if (document === state.startTripData.startingKMDocumentsProve) {
            // Check data in table COMedia
            state.documentClicked.map((item, index) => {
                if (item.path === document) {
                    coMediaItem = item
                    indexCoMedia = index
                }
            })

            // Set state prove startingKM document to null
            data['startingKMDocumentsProve'] = ''
            data['claimMileageUploaded'] = state.documentClicked.splice(indexCoMedia, 1)
        }

        // Check document if used in claimMil data for prove endingKM document
        if (document === state.startTripData.endingKMDocumentsProve) {
            // Check data in table COMedia
            state.documentClicked.map((item) => {
                if (item.path === document) {
                    coMediaId = item.coid
                    indexCoMedia = index
                }
            })

            // Set state prove startingKM document to null
            data['endingKMDocumentsProve'] = ''
            data['claimMileageUploaded'] = state.documentClicked.splice(indexCoMedia, 1)
        }

        // Update Claim Mileage data
        let claimMileage = await updateClaimMileage({
            cmid: data['claimMileageId'],
            upload_start: data['startingKMDocumentsProve'],
            upload_end: data['endingKMDocumentsProve'],
        })

        if (claimMileage) {
            // Delete CoMedia data
            let status = await deleteClaimOtherMedia(coMediaItem.id)
            
            // Delete File in Storage
            if (status) {
                new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest()
                    xhr.open('DELETE', `/api/deleteFile/${document}`)
                    // xhr.withCredentials = true
                    xhr.setRequestHeader('Access-Control-Allow-Origin', `${process.env.NEXT_PUBLIC_API_STORAGE}`)
                    xhr.onload = () => {
                        const resp = JSON.parse(xhr.responseText)
                        toast.success("File deleted successfully")
                        newState({ startTripData : data })

                        router.push(`/eca/claims/detail?chid=${chid}`)

                    }
                    xhr.onerror = (evt) => { 
                        reject(evt) 
                        errorHandler("An Error when delete your file")
                    }
                    xhr.send()
                })
    
            } 
            else errorHandler("An Error when delete your file")
        } 
        else errorHandler("An Error when update claim mileage")

    }

    useEffect(() => {
        if (cmid != undefined && chid !== undefined && (status === 'update' || status === 'view')){
            if (!fetchStatus) {
                getDataClaim() 
                setFetchStatus(true)
            }
        }
        if (cmid === undefined && chid === undefined) setOtherStatus('create')
        else if (cmid !== undefined && status === 'view') setOtherStatus('view') 

    }, [chid, cmid, fetchStatus, getDataClaim, status])
    // if (!state.mounted) return null
    
    return (
        <LayoutDetail title="Action Claim Mileage" status={''} isBackPageMainFlow={otherStatus === 'create' ?  true : false} defaultBackPage='/eca/claims/action'>
            <div className="z-20 w-full px-4 pt-20 pb-4 fixed select-none bg-neutral-50 dark:bg-gray-900 drop-shadow-md">
                <p className="font-bold text-base md:text-lg text-center">{
                        otherStatus === 'create' ?  'Add New' : otherStatus === 'view' ? 'View' : 'Update'
                    } Claims
                </p>
            </div>


            <div className="z-10 mt-32 w-full h-full flex flex-col lg:flex-row place-content-center items-center
                            gap-2 px-6 pb-16 divide-x-0 lg:divide-x-2 divide-y-2 lg:divide-y-0 
                            overflow-y-scroll scroll-display-none">     
                <div className="w-full md:w-2/4 lg:w-1/3 px-2 md:px-0 xl:px-6 pb-6  flex flex-col ">
                    <div className="w-full select-none mb-4 mt-8">
                        <p className="font-semibold text-xl md:text-2xl">{currentStep === 'startingKm' ? state.steps.starting.title : state.steps.ending.title}</p>
                        <p className="font-light text-sm md:text-sm">{currentStep === 'startingKm' ? state.steps.starting.description : state.steps.ending.description}</p>
                    </div> 
                    {
                        currentStep === 'startingKm' && (
                            <StartingKM startKM={state.startTripData} nextStep={() => nextStep()} onChange={startState => newState({startTripData: startState})} documentClicked={documents => newState({ documentClicked: documents})} />
                        )
                    }

                    {
                        currentStep === 'endingKm' && (
                            <EndingKM startKM={state.startTripData} prevStep={() => prevStep()} documentClicked={documents => newState({ documentClicked: documents})}  />
                        )
                    }
                </div>
            </div>
            {
                state.documentClicked.length !== 0 && (
                    <div className="w-screen h-screen absolute top-0 left-0 z-40">
                        <ShowDocument data={state.documentClicked} 
                                      isUpdate={status === 'update' ? true : false} 
                                      onDeleteDocument={document => deleteDocument(document)}
                                      onClose={() => newState({documentClicked: []}) }/>
                    </div>
                )
            }
        </LayoutDetail>
    )
}