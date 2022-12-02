import { useCallback, useEffect, useState } from 'react'
import axios from 'configs/eca/axios'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import errorHandler from 'configs/errorHandler'
import queryString from 'query-string'

import useBtb from 'pages/api/eca/btb'
import useUser from 'pages/api/eca/user'

import useForm from "helpers/useForm"

import LayoutDetail from "components/eca/Layout/Detail"
import Select from "components/eca/Forms/Select"
import InputDate from "components/eca/Forms/Date"
import InputCurrency from 'components/eca/Forms/Currency'
import Input from 'components/eca/Forms/Input'
import Textarea from 'components/eca/Forms/Textarea'

import MoneyGray from '/public/images/svg/eca/money-gray.svg'
import ProfileGray from '/public/images/svg/eca/profile-gray.svg'

export default function ActionBTB(props) {

    const router = useRouter()

    const { getDetailUser } = useUser()

    const { bhid } = router.query
    const { bcid } = router.query
    const { status } = router.query

    const { getClaimMaster, getDraftBTBHead, getBTBChildData, insertBTBHead, insertBTBChild, updateBTBChild } = useBtb()

    const ninetyDaysBefore = (2160  * 60) * 60 * 1000 // 2160 hours = 90 days
    const currentDate = new Date()

    const [user , setUser] = useState({})
    const [fetchBTB, setFetchBTB] = useState(false)
    const [fetchStatus, setFetchStatus] = useState(false)
    const [btbStatus, setBTBStatus] = useState('')
    const [state, setState, newState] = useForm({
        btbHead: '',
        btbStatusApproval:  3,
        btbSuperiorApproval: 3,
        activities: '',
        activitiesDate: currentDate,
        activitiesData: [],
        activitiesAmount: 0,
        activitiesDescription: '',
        activitiesLocationName: '',
        activitiesLocationAddress: '',
        businessPartnerName: '',
        businessPartnerPosition: '',
        businessPartnerCompany: '',
        businessPartnerCompanyType: '',
    })

    const getBTBHead = async (userId) => {
        let btbHead = await getDraftBTBHead(userId)
        if (btbHead === '') btbHead = await insertBTBHead({ uid_user: userId, status: 3, rating: 0,is_active:1 })
        return btbHead
    }

    const actionBTB = async () => {
        let btbHead  = bhid!== undefined ?  bhid : await getBTBHead(user.id)
        let data = {
            bhid: btbHead,
            bc_type: state.activities,
            bc_desc: state.activitiesDescription,
            amount: state.activitiesAmount,
            status_approval: state.btbStatusApproval,
            superior_approval: state.btbSuperiorApproval,
            superiorName: user.superiorName,
            reject_desc: "",
            activity_dt: state.activitiesDate,
            activity_location_name: state.activitiesLocationName,
            activity_location_address: state.activitiesLocationAddress,
            business_partner: state.businessPartnerName,
            business_partner_job_position: state.businessPartnerPosition,
            business_partner_company: state.businessPartnerCompany,
            business_partner_type: state.businessPartnerCompanyType,
            is_active: 1,
            submitStatus: false,
        }


        if (state.activitiesAmount > 0){
            if (btbHead !== undefined && btbStatus === 'update' && state.btbStatusApproval === 3) {
                data['bcid'] = bcid
                let btb = await updateBTBChild(data)

                if (btb) toast.success("Update btb successsfully")
                else errorHandler("An error when update btb")

            } else {
                let btb = await insertBTBChild(data) 

                if (btb !== '') toast.success("Create btb successsfully")
                else errorHandler("An error when create btb")

            }

            setTimeout(() => {
                router.push('/eca/btb')
            }, 1000)    
        }
        else errorHandler("Amount must be greater than 0")

        newState({ submitStatus: false})
    }
    
    const fetchData = useCallback( async () => {

        let { bhid } = router.query
        let { bcid } = router.query
        let { status } = router.query

        let userData = await getDetailUser()
        setUser(userData)

        if (userData.id !== undefined) {
            
            let data = {}
            let activityData = await getClaimMaster()
            
            if (activityData.length > 0) data['activitiesData'] = activityData
            else errorHandler("An Error when trying to get Activities")
            
            if (bcid !== undefined) {
                let childData = await getBTBChildData(bcid)

                if (childData.bcid !== undefined) {    
                    data = {
                        ...data,
                        btbHead: childData.bhid,
                        btbStatusApproval:  3,
                        btbSuperiorApproval: 3,
                        activities: childData.bc_type,
                        activitiesDate: new Date(childData.activity_dt),
                        activitiesAmount: childData.amount,
                        activitiesDescription: childData.bc_desc,
                        activitiesLocationName: childData.activity_location_name,
                        activitiesLocationAddress: childData.activity_location_address,
                        businessPartnerName: childData.business_partner,
                        businessPartnerPosition: childData.business_partner_job_position,
                        businessPartnerCompany: childData.business_partner_company,
                        businessPartnerCompanyType: childData.business_partner_type,
                    }
                }
                else router.push('/404')
            }
            

            if (bcid === undefined && bhid === undefined && status === undefined) setBTBStatus('create')

            if (bcid !== undefined && bhid !== undefined && status === 'update') setBTBStatus('update')
            
            if (bcid !== undefined && bhid === undefined && status === 'view' ) setBTBStatus('view')

            newState(data)
            
        }
        else errorHandler("There is an error when retrieving user data")

        setFetchStatus(true)

    }, [getBTBChildData, getClaimMaster, getDetailUser, newState, router])

    useEffect(() => {
        if (!fetchStatus) fetchData()
    }, [fetchData, fetchStatus])

    return (
        <LayoutDetail title="Action BTB" 
                      detailFeature='btb'
                    //   detailFeatureFormButton={state.activities.split('-')[1]} 
                      isBackPageMainFlow={btbStatus === 'create' ?  true : false}
                      defaultBackPage='/eca/btb'
                      status={btbStatus}
                      isSubmitLoading={state.submitStatus}
                      onSubmitClick={() => {
                        if (!state.submitStatus) {
                            newState({ submitStatus: true })
                            actionBTB()
                        }
                    }}>
            <div className="z-20 w-full px-4 pt-20 pb-4 fixed select-none bg-neutral-50 dark:bg-gray-900 drop-shadow-md">
                <p className="font-bold text-base md:text-lg text-center">{btbStatus === 'create' ? 'Add New' : btbStatus === 'view' ? 'Detail' : 'Update'} BTB</p>
            </div>

            <div className="z-10 mt-32 w-full h-full flex flex-col lg:flex-row place-content-center items-center
                            gap-4 px-2 pb-16 
                            overflow-y-scroll scroll-display-none">

                <div className="w-full md:w-2/4 lg:w-1/3  px-2 md:px-0 xl:px-6 pb-6  flex flex-col ">
                    <div className="w-full z-20">
                        <Select name='activities' 
                                labelName="Activities" 
                                value={state.activities.split('-')[1]} 
                                onClick={setState} 
                                placeholder="Select Activities"
                                isDisabled={btbStatus === 'view' ? true : false}
                                isRequired>
                            {
                                state.activitiesData?.map((item, index) => {
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
                                   placeholder="Select date your activities" 
                                   currentDateStatus={true}
                                   onChange={setState} 
                                   minDate={ninetyDaysBefore}
                                   isDisabled={btbStatus === 'view' ? true : false}
                                   isRequired/>
                    </div>

                    <div className="w-full">
                    <InputCurrency  name="activitiesAmount" 
                                        labelName="Amount"  
                                        value={state.activitiesAmount} 
                                        placeholder="Input amount" 
                                        onChange={setState} 
                                        append={<MoneyGray className="p-0.5" />}
                                        isDisabled={btbStatus === 'view' ? true : false}
                                        isRequired/>
                    </div>

                    <div className="w-full">
                        <Textarea name="activitiesDescription" 
                                labelName="Description"  
                                value={state.activitiesDescription} 
                                placeholder="Your activity description heree.." 
                                rows={4}
                                onChange={setState} 
                                isDisabled={btbStatus === 'view' ? true : false}
                                isRequired/>
                    </div>
                </div>
                

                {
                    state.activities.split('-')[0] === '931' && (
                        <>
                            <div className="w-9/12 lg:w-0 lg:h-96 bg-gray-300 border border-gray-300"></div>
                            <div className="w-full md:w-2/4 lg:w-1/3 px-2 md:px-0 xl:px-6 pt-3 flex flex-col mb-5">
                                <div className="w-full">
                                    <Input type='text' 
                                        name="activitiesLocationName" 
                                        labelName="Activities Location Name "  
                                        value={state.activitiesLocationName} 
                                        placeholder="Activities Location Name" 
                                        onChange={setState} 
                                        isDisabled={btbStatus === 'view' ? true : false}
                                        isRequired/>
                                </div>

                                <div className="w-full">
                                    <Textarea name="activitiesLocationAddress" 
                                            labelName="Activities Location Address"  
                                            value={state.activitiesLocationAddress} 
                                            placeholder="Your activity location address heree.." 
                                            rows={4}
                                            onChange={setState} 
                                            isDisabled={btbStatus === 'view' ? true : false}
                                            isRequired/>
                                </div>

                                <div className="w-full">
                                    <Input type='text' 
                                        name="businessPartnerName" 
                                        labelName="Business Partner Name"  
                                        value={state.businessPartnerName} 
                                        placeholder="Business partner name" 
                                        onChange={setState} 
                                        isDisabled={btbStatus === 'view' ? true : false}
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
                                        isDisabled={btbStatus === 'view' ? true : false}
                                        isRequired/>
                                </div>
                                <div className="w-full">
                                    <Input type='text' 
                                        name="businessPartnerCompanyType" 
                                        labelName="Partner Company Type"  
                                        value={state.businessPartnerCompanyType} 
                                        placeholder="Business partner company type" 
                                        onChange={setState} 
                                        isDisabled={btbStatus === 'view' ? true : false}
                                        isRequired/>
                                </div>
                            </div>
                        </>
                    )
                }
            </div>
        </LayoutDetail>
    )
}