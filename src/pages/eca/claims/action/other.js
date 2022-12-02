import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { withSessionSsr } from "lib/withSession"
import { toast } from 'react-toastify'
import axios from 'configs/eca/axios'
import errorHandler from 'configs/errorHandler'
import Image from 'next/image'

import useClaim from 'pages/api/eca/claim'
import useUser from 'pages/api/eca/user'

import useForm from "helpers/useForm"
import convertDateTime from 'helpers/convertDateTime'

import LayoutDetail from "components/eca/Layout/Detail"
import Select from "components/eca/Forms/Select"
import InputDate from "components/eca/Forms/Date"
import Input from 'components/eca/Forms/Input'
import InputCurrency from 'components/eca/Forms/Currency'
import Textarea from 'components/eca/Forms/Textarea'
import Upload from 'components/eca/Document/Upload'
import ShowDocument from 'components/eca/Document/Show'

import MoneyGray from '/public/images/svg/eca/money-gray.svg'
import ProfileGray from '/public/images/svg/eca/profile-gray.svg'
import PDFIcon from '/public/images/svg/eca/pdf-red.svg'

export const getServerSideProps = async (context) => {

    const { referer } = context.req.headers 

    let pathReferer = ''
    if (referer !== undefined) {
        let url = new URL(referer)
        pathReferer = url.pathname
    }

    return { 
        props: { 
            pathReferer: pathReferer
        } 
    }
}

export default function Other(props) {

    const router = useRouter()

    const { coid } = router.query
    const { chid } = router.query
    const { status } = router.query 
    
    const [fetchStatus, setFetchStatus] = useState(false)
    const [user, setUser] = useState({})
    const { getDetailUser } = useUser()

    const { 
        getClaimMaster,
        getDraftClaimHead, 
        getClaimOtherData,
        insertClaimHead, 
        insertClaimOther ,
        updateClaimOther, 
        insertClaimOtherMedia,
        getClaimOtherMedia,
        deleteClaimOtherMedia
    } = useClaim()

    const ninetyDaysBefore = (2160  * 60) * 60 * 1000 // 2160 hours = 90 days
    const currentDate = new Date()

    const [claimHead, setClaimHead] = useState(chid !== undefined ? chid : '')
    const [isSubmitForm, setIsSubmitForm] = useState(false)
    const [otherStatus, setOtherStatus] = useState('')
    const [state, setState, newState] = useForm({
        submitStatus: false,
        activitiesData: [],
        activities: '',
        activitiesDate: currentDate,
        activitiesAmount: 0,
        activitiesDescription: '',
        activitiesLocationAddress: '',
        activitiesLocationName: '',
        activitiesReceipt: [],
        businessPartnerName: '',
        businessPartnerPosition: '',
        businessPartnerCompany: '',
        businessPartnerCompanyType: '',
        activitiesReceiptTemp: '',
        claimOtherStatus: 0,
        claimOtherMedia: [],
        documentClicked: [],
        submitForm: false
    })

    const fetchData = useCallback( async() => {
        let activityData = await getClaimMaster()
        let userData = await getDetailUser()

        if (userData.id !== undefined) setUser(userData)
        else errorHandler("There is an error when retrieving user data")

        if (activityData.length !== 0) newState({ activitiesData: activityData })
        else errorHandler("An Error when trying to get Activities List")

        setFetchStatus(true)

    }, [getClaimMaster, getDetailUser, newState])

    const getClaimData = useCallback( async (coid) => {
        let coMedia = []
        let claimOther = await getClaimOtherData(coid)
        let claimOtherMedia = await getClaimOtherMedia(coid)
        coMedia = claimOtherMedia

        newState({
            activities: claimOther.co_type,
            activitiesAmount: claimOther.amount,
            activitiesDescription: claimOther.co_desc,
            activitiesDate: new Date(claimOther.activity_dt),
            activitiesReceiptTemp: claimOther.upload_prove,
            activitiesLocationName: claimOther.activity_location_name,
            activitiesLocationAddress: claimOther.activity_location_address,
            businessPartnerName: claimOther.business_partner,
            businessPartnerPosition: claimOther.business_partner_job_position,
            businessPartnerCompany: claimOther.business_partner_company,
            businessPartnerCompanyType: claimOther.business_partner_type,
            claimOtherStatus: claimOther.status_approval,
            claimOtherMedia: coMedia,
        })
    },[getClaimOtherMedia, getClaimOtherData, newState])

    const getClaimHead = useCallback(async (userId) => {
        let claimHead = await getDraftClaimHead(userId)
        if (claimHead === '') claimHead = await insertClaimHead({ uid_user: userId, status: 3, rating: 0,is_active:1 })
        return claimHead
    }, [getDraftClaimHead, insertClaimHead])

    const submitClaim = useCallback(async () => {
        let userData = await getDetailUser(user.id)
        let claimOtherId = coid !== undefined ? coid : ''
        let claimHeadId = claimHead

        if (claimHeadId === '' && !isSubmitForm) {
            claimHeadId = await getClaimHead(user.id)
            setClaimHead(claimHeadId)
        }

        let data = {
            coid: claimOtherId,
            chid: claimHeadId,
            co_type: state.activities,
            co_desc: state.activitiesDescription,
            amount: parseInt(state.activitiesAmount),
            business_partner: state.businessPartnerName,
            status_approval: 3,
            superiorName: userData.superiorName,
            superior_approval: 3,
            superior_dt: '',
            is_active: 1,
            reject_desc: "",
            activity_dt: convertDateTime(state.activitiesDate),
            activity_location_name: state.activitiesLocationName,
            activity_location_address: state.activitiesLocationAddress,
            business_partner_job_position: state.businessPartnerPosition,
            business_partner_company: state.businessPartnerCompany,
            business_partner_type: state.businessPartnerCompanyType
        }

        if (!isSubmitForm && claimHeadId !== undefined && otherStatus === 'update' && state.claimOtherMedia.length > 0 && state.claimOtherStatus === 3) {
            data['upload_prove'] = state.activitiesReceiptTemp
            await updateClaimOther(data)
            toast.success("Update other claim successsfully")
        } 
        
        // Insert Claim Other
        if (!isSubmitForm && claimHead !== undefined && otherStatus === 'create') {
            
            if (claimHeadId !== '' && claimHeadId !== undefined) {
                data['upload_prove'] = `${state.activitiesReceipt[0].storagePath}`
                claimOtherId = await insertClaimOther(data)
                toast.success("Create other claim successsfully")
            } 
            else errorHandler("An error when create other claim")

        }

        // Insert Claim Other Media
        if (!isSubmitForm && claimHeadId !== undefined && (state.claimOtherStatus === 3 || (otherStatus === 'create' || otherStatus === 'update')) && 
            state.activitiesReceipt[0]?.storagePath !== '' && state.activitiesReceipt[0]?.storagePath !== undefined) {

            
            if (claimOtherId !== '' && claimOtherId !== undefined) {
                await Promise.all(
                    state.activitiesReceipt.map( (item) => {
                        if (item.storagePath !== '' && item.storagePath !== undefined) {
                            insertClaimOtherMedia({
                                coid: claimOtherId,
                                title: `${item?.name}`,
                                path: `${item?.storagePath}`,
                                extension: `${item?.extension.toLowerCase()}`,
                                is_active: 1
                            })
                        }
                    })
                );
            }
        }
        
        setTimeout(() => {router.push('/eca/claims')}, 500)
    }, [
        claimHead,
        coid,
        getClaimHead,
        getDetailUser,
        insertClaimOther,
        insertClaimOtherMedia,
        isSubmitForm,
        otherStatus,
        router,
        state,
        updateClaimOther,
        user.id
    ])

    const deleteDocument = async (document) => {
        // validate is document use in claim other data as a prove document 
        if (document === state.activitiesReceiptTemp && state.claimOtherMedia?.length === 1) toast.info("Please Upload new file to delete first file")
        else {
            let userData = await getDetailUser(user.id)
            let indexCoMedia = null
            let item = {}
            let data = {
                coid: coid,
                chid: claimHead,
                co_type: state.activities,
                co_desc: state.activitiesDescription,
                amount: parseInt(state.activitiesAmount),
                business_partner: state.businessPartnerName,
                status_approval: 3,
                superiorName: userData.superiorName,
                superior_approval: 3,
                superior_dt: '',
                is_active: 1,
                reject_desc: "",
                activity_dt: convertDateTime(state.activitiesDate),
                activity_location_name: state.activitiesLocationName,
                activity_location_address: state.activitiesLocationAddress,
                business_partner_job_position: state.businessPartnerPosition,
                business_partner_company: state.businessPartnerCompany,
                business_partner_type: state.businessPartnerCompanyType
            }

            state.claimOtherMedia.map( (media, index) => {
                if (media.path === document) {
                    item = media
                    indexCoMedia = index
                }
            })
            
            let status = await deleteClaimOtherMedia(item.id) 

            if (status) {
                new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest()
                    xhr.open('DELETE', `/api/deleteFile/${document}`)
                    // xhr.withCredentials = true
                    xhr.setRequestHeader('Access-Control-Allow-Origin', `${process.env.NEXT_PUBLIC_API_STORAGE}`)
                    xhr.onload = () => {
                    }
                    xhr.onerror = (evt) => { 
                        reject(evt) 
                        errorHandler("An Error when delete your file")
                    }
                    xhr.send()
                })

                if (indexCoMedia === 0) {
                    data['upload_prove'] = state.claimOtherMedia[1].path
                    await updateClaimOther(data)
                } 
            
                toast.success("Delete file successfully")
                router.push(`/eca/claims/detail?chid=${chid}`)
            }
            else errorHandler("An error whene delete your file")
        }
    }

    const imageLoader = ({src}) => {
        return src
    }

    useEffect(() => {

        if (!fetchStatus) fetchData()

        if (coid !== undefined && chid !== undefined && status === 'update' && state.activities === '') {
            setOtherStatus('update')
            getClaimData(coid)
        }
        else if (coid !== undefined && status === 'view'  && state.activities === '') {
            setOtherStatus('view')
            getClaimData(coid)
        }
        else if (coid === undefined && chid === undefined  && state.activities === '') setOtherStatus('create')

        if (state.submitStatus && !isSubmitForm && otherStatus === 'create' && state.activitiesReceipt[0]?.storagePath !== undefined) {
            submitClaim()
            setIsSubmitForm(true)
        }

        if (state.submitStatus && !isSubmitForm && otherStatus === 'update') {
            submitClaim()
            setIsSubmitForm(true)
        }
        
    }, [fetchStatus, state, fetchData, getClaimData, isSubmitForm, otherStatus, status, submitClaim ,chid, coid])
    // state.activities, state.activitiesData, state.claimHead, state.submitStatus

    return (
        <LayoutDetail title="Action Other Claim" 
                      detailFeature='claim'
                      detailFeatureFormButton={''} 
                      status={otherStatus}
                      isSubmitLoading={isSubmitForm}
                      isBackPageMainFlow={otherStatus === 'create' ?  true : false}
                      defaultBackPage='/eca/claims/action'
                      onSubmitClick={() => {
                        console.log(state)

                        if (status === 'update' ||
                            state.activities !== '' && 
                            state.activitiesAmount !== 0 && 
                            state.activitiesDescription !== '' && 
                            state.activitiesReceipt.length !== 0 &&
                            user.id !== undefined ) {
                                newState({ submitStatus: true })
                        } 
                        else errorHandler("Please fill the form before submit")
                      }}>
            <div className="z-20 w-full px-4 pt-20 pb-4 fixed select-none bg-neutral-50 dark:bg-gray-900 drop-shadow-md">
                <p className="font-bold text-base md:text-lg text-center">{otherStatus === 'create' ? 'Add New' : otherStatus === 'view' ? 'View' : 'Update'} Claims</p>
            </div>

            <div className="z-10 mt-32 w-full h-full flex flex-col lg:flex-row place-content-center items-center
                            gap-4 px-2 pb-16 
                            overflow-y-scroll scroll-display-none">
                

                <div className="w-full md:w-2/4 lg:w-1/3  px-2 md:px-0 xl:px-6 pb-6  flex flex-col ">
                {
                   state.claimOtherMedia.length !== 0  && otherStatus !== 'create'  && (
                        <div className="w-full md:px-0 pb-2 pt-4 flex flex-row">
                            
                            <div className="w-1/4 h-16 lg:h-12 relative " onClick={() => newState({ documentClicked: state.claimOtherMedia})}>
                                <div className="z-40 absolute top-0 left-4 cursor-pointer">
                                    <div className="relative w-16 h-16 rounded-full border-4 border-blue-300">
                                        {
                                            state.claimOtherMedia[0]?.extension  === 'pdf' ? (
                                                <div className="w-full h-full flex place-content-center items-center bg-gray-700 rounded-full">
                                                    <PDFIcon className="w-full h-full p-3"/>
                                                </div>
                                            ) : (
                                                <Image loader={imageLoader} src={`${ process.env.NEXT_PUBLIC_API_STORAGE}files/get?filePath=${state.claimOtherMedia[0]?.path}`} fill className="object-cover rounded-full" alt={state.claimOtherMedia[0]?.title}/>
                                            )
                                        }
                                    </div>
                                </div>
                                {
                                    state.claimOtherMedia[1]?.path !== undefined && (
                                        <div className="z-30 top-0 left-2 absolute cursor-pointer">
                                            <div className="relative w-16 h-16 rounded-full border-4 border-green-300">
                                            {
                                                state.claimOtherMedia[1]?.extension  === 'pdf' ? (
                                                    <div className="w-full h-full flex place-content-center items-center bg-gray-700 rounded-full">
                                                        <PDFIcon className="w-full h-full p-3"/>
                                                    </div>
                                                ) : (
                                                    <Image loader={imageLoader} src={`${ process.env.NEXT_PUBLIC_API_STORAGE}files/get?filePath=${state.claimOtherMedia[1]?.path}`} fill className="object-cover rounded-full" alt={state.claimOtherMedia[1]?.title}/>
                                                )
                                            }
                                            </div>
                                        </div>
                                    )
                                }
                                {
                                    state.claimOtherMedia[2]?.path !== undefined && (
                                        <div className="z-10 top-0 left-0 absolute cursor-pointer">
                                            <div className="relative w-16 h-16 rounded-full border-4 border-yellow-300">
                                            {
                                                state.claimOtherMedia[2]?.extension  === 'pdf' ? (
                                                    <div className="w-full h-full flex place-content-center items-center bg-gray-700 rounded-full">
                                                        <PDFIcon className="w-full h-full p-3"/>
                                                    </div>
                                                ) : (
                                                    <Image loader={imageLoader} src={`${ process.env.NEXT_PUBLIC_API_STORAGE}files/get?filePath=${state.claimOtherMedia[2]?.path}`} fill className="object-cover rounded-full" alt={state.claimOtherMedia[2]?.title}/>
                                                )
                                            }
                                            </div>
                                        </div>
                                    )
                                }                    
                            </div>
                            <div className="w-3/4 pl-4 md:pl-2">
                                <p className="text-md text-gray-500 dark:text-white font-semibold">Document Recipt</p>
                                <p className="mt-1 text-xs text-gray-500 dark:text-white font-normal" style={{ fontSize: "12px" }}>The document that you uploaded as Approve. Click document beside to see your file or add document in the form upload bellow</p>
                            </div>
                        </div>
                   ) 
                }
                    <div className="w-full z-20">
                        <Select name='activities' 
                                labelName="Activities" 
                                value={state.activities.split('-')[1]} 
                                onClick={setState} 
                                placeholder="Select Activities"
                                isDisabled={otherStatus === 'view' ? true : false}
                                isRequired>
                            {
                                state.activitiesData.map((item, index) => {
                                    return (
                                        <option key={index} value={`${item.mcid}-${item.claim_name}`}>{item.claim_name}</option>
                                    )
                                })
                            }
                        </Select>
                    </div>

                    <div className="relative w-full z-10">
                        <InputDate name="activitiesDate" 
                                   labelName="Day Activities Take"  
                                   value={state.activitiesDate} 
                                   currentDateStatus={true}
                                   placeholder="Select date your activities" 
                                   onChange={setState} 
                                   minDate={ninetyDaysBefore}
                                   isDisabled={otherStatus === 'view' ? true : false}
                                   isRequired/>
                    </div>

                    <div className="w-full">
                        <InputCurrency  name="activitiesAmount" 
                                        labelName="Amount"  
                                        value={state.activitiesAmount} 
                                        placeholder="Input amount" 
                                        onChange={setState} 
                                        append={<MoneyGray className="p-0.5" />}
                                        isDisabled={otherStatus === 'view' ? true : false}
                                        isRequired/>
                    </div>

                    <div className="w-full">
                        <Textarea name="activitiesDescription" 
                                labelName="Description"  
                                value={state.activitiesDescription} 
                                placeholder="Your activity description heree.." 
                                rows={4}
                                onChange={setState} 
                                isDisabled={otherStatus === 'view' ? true : false}
                                isRequired/>
                    </div>
                    
                    {
                        otherStatus !== 'view' && (
                            <div className="w-full">
                                <Upload labelName="Upload Receipt" 
                                        name="activitiesReceipt" 
                                        value={state.activitiesReceipt} 
                                        onChange={setState}
                                        uniqueFolder='1'
                                        uploadStatus={state.submitStatus}
                                        />
                            </div>
                        )
                    }
                </div>
                

                {
                    state.activities.split('-')[0] === '931' && (
                        <>
                            <div className="w-9/12 lg:w-0 lg:h-96 bg-gray-300 border border-gray-300"></div>
                            <div className="w-full md:w-2/4 lg:w-1/3 px-2 md:px-0 xl:px-6 pt-3 flex flex-col ">
                                <div className="w-full">
                                    <Input type='text' 
                                        name="activitiesLocationName" 
                                        labelName="Activities Location Name "  
                                        value={state.activitiesLocationName} 
                                        placeholder="Insert your activities location name heree..." 
                                        onChange={setState} 
                                        isDisabled={otherStatus === 'view' ? true : false}
                                        isRequired/>
                                </div>

                                <div className="w-full">
                                    <Textarea name="activitiesLocationAddress" 
                                            labelName="Activities Location Address"  
                                            value={state.activitiesLocationAddress} 
                                            placeholder="Insert your activity location address heree.." 
                                            rows={4}
                                            onChange={setState} 
                                            isDisabled={otherStatus === 'view' ? true : false}
                                            isRequired/>
                                </div>

                                <div className="w-full">
                                    <Input type='text' 
                                        name="businessPartnerName" 
                                        labelName="Business Partner Name"  
                                        value={state.businessPartnerName} 
                                        placeholder="Business partner name" 
                                        onChange={setState} 
                                        isDisabled={otherStatus === 'view' ? true : false}
                                        isRequired
                                        append={<ProfileGray className="p-1" />}/>
                                </div>

                                <div className="w-full">
                                    <Input type='text' 
                                        name="businessPartnerPosition" 
                                        labelName="Partner Position"  
                                        value={state.businessPartnerPosition} 
                                        placeholder="Business partner position" 
                                        onChange={setState} 
                                        isRequired/>
                                </div>
                                <div className="w-full">
                                    <Input type='text' 
                                        name="businessPartnerCompany" 
                                        labelName="Partner Company"  
                                        value={state.businessPartnerCompany} 
                                        placeholder="Business partner company" 
                                        onChange={setState} 
                                        isDisabled={otherStatus === 'view' ? true : false}
                                        isRequired/>
                                </div>
                                <div className="w-full">
                                    <Input type='text' 
                                        name="businessPartnerCompanyType" 
                                        labelName="Partner Company Type"  
                                        value={state.businessPartnerCompanyType} 
                                        placeholder="Business partner company type" 
                                        onChange={setState} 
                                        isDisabled={otherStatus === 'view' ? true : false}
                                        isRequired/>
                                </div>
                            </div>
                        </>
                    )
                }
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