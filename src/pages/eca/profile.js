import { useEffect, useState, useCallback } from 'react'
import { withSessionSsr } from "../../lib/withSession"
import CryptoJS from "crypto-js"
import { useTheme } from 'next-themes'
import {toast} from 'react-toastify'
import Image from 'next/image'

import capitalizeEachWord from "helpers/capitalizeEachWord"
import useForm from "helpers/useForm"
import useUserCube from "pages/api/user"
import useUserEca from "pages/api/eca/user"


import Button from 'components/eca/Button'
import LayoutDetail from "components/eca/Layout/Detail"
import Input from "components/eca/Forms/Input"

import ProfileImage from '/public/images/svg/eca/profile.svg'
import SignOutDark from '/public/images/svg/eca/icon-signout-dark.svg'
import SignOutLight from '/public/images/svg/eca/icon-signout-light.svg'
import errorHandler from 'configs/errorHandler'

export default function Profile(props) {
    const { theme } = useTheme()

    const { updateUser, getDetailUser} = useUserCube()
    const { login, isLoading } = useUserEca()

    const [fetchStatus, setFetchStatus] = useState(false)
    const [user, setUser] = useState({})

    const [state, setState, newState] = useForm({
        isLoading: false,
        mounted: false,
        bank: "",
        accountNumber: '',
    })

    const saveUpdate = async () => {
        let data = user
        
        if (state.bank !== '' && state.accountNumber !== '') {
            data['nama_rekening'] = state.bank
            data['no_rekening'] = state.accountNumber

            let account = await updateUser(data)
            // Sync User

            if (account) {
                let syncUser = await login({ email: account.email, password: account.password})
                if (syncUser) toast.success("Update Profile successfully")
                else errorHandler("Something went wrong when update your profile")
            }
            else errorHandler("Something went wrong when update your profile")
            
        }
        else toast.info('Please fill the form bellow')

    }

    const fetchData = useCallback( async () => {
        let response = await getDetailUser().then( data => {
            let dataUser = data

            setUser(dataUser)

            if (user.id === undefined) {
                if ((dataUser.nama_rekening === '' || dataUser.nama_rekening === null) && 
                    (dataUser.no_rekening === '' || dataUser.no_rekening === null)) {
                    toast.info("Please Insert your bank account into the form below")
                } 
                else {
                    newState({
                        bank: dataUser.nama_rekening,
                        accountNumber: dataUser.no_rekening
                    })
                }
            }
        })
        .catch( err => {
            errorHandler("There is an error when retrieving user data")
        })

    }, [getDetailUser, newState, user.id])

    useEffect(() => {
        if (!fetchStatus) {
            fetchData()
            setFetchStatus(true)
        }
    }, [fetchData, fetchStatus])
    
    return (
        <LayoutDetail title="Profile" 
                      status={''}
                      defaultBackPage='/eca'>
            
            <div className="relative w-full mt-24 ">
                <div className="mx-6 lg:mx-10 bg-blue-300 h-32 rounded-3xl"></div>
                <div className="absolute w-full h-32 top-0 flex place-content-center">
                    <div className="absolute top-16 lg:top-16  w-28 h-28 lg:w-32 lg:h-32 bg-green-200 border-8 border-white dark:border-gray-900 rounded-full">
                        {/* <Image src={ProfileImage} layout="fill" className=" object-contain rounded-full " alt="profile-image"/> */}
                        <ProfileImage className="p-4" />
                    </div>
                </div>
            </div>

            <div className="w-full flex place-content-center mt-12 lg:mt-16 font-semibold text-black dark:text-white">{capitalizeEachWord(user?.name)}</div>
            
            <div className="z-10 mt-8 w-full h-full flex flex-col lg:flex-row place-content-center
                            gap-4 px-2 pb-16 
                            overflow-y-scroll scroll-display-none">

                <div className="w-full md:w-2/4 lg:w-1/3  flex flex-col gap-2">
                    <div className="w-full px-2 md:px-0 xl:px-6 pb-6  flex flex-row gap-3">
                        <div className="flex flex-col gap-3">
                            <div className="text-xs md:text-sm font-medium">NIK</div>
                            <div className="text-xs md:text-sm font-medium">email</div>
                            <div className="text-xs md:text-sm font-medium">Department</div>
                            <div className="text-xs md:text-sm font-medium">Division</div>
                            <div className="text-xs md:text-sm font-medium">Level</div>
                        </div>
                        <div className="flex flex-col gap-2.5 md:gap-3">
                            <div className="font-light md:pt-0.5" style={{ fontSize: "12px" }}>: {user?.nik}</div>
                            <div className="font-light md:pt-0.5" style={{ fontSize: "12px" }}>: {user?.email}</div>
                            <div className="font-light md:pt-0.5" style={{ fontSize: "12px" }}>: {user?.deptName}</div>
                            <div className="font-light md:pt-0.5" style={{ fontSize: "12px" }}>: {user?.divName}</div>
                            <div className="font-light md:pt-0.5" style={{ fontSize: "12px" }}>: {user?.jobLvlName}</div>

                        </div>
                    </div>

                    <div className="w-full bg-gray-300 border border-gray-300 mb-3"></div>
                    
                    <div className="w-full px-2 md:px-0 xl:px-6 pb-6  flex flex-row gap-3">
                        <div className="flex flex-col gap-3">
                            <div className="text-xs md:text-sm font-medium">Superior NIK</div>
                            <div className="text-xs md:text-sm font-medium">Superior Name</div>
                        </div>
                        <div className="flex flex-col gap-2.5 md:gap-3">
                            <div className="font-light md:pt-0.5" style={{ fontSize: "12px" }}>: {user?.superiorNIK}</div>
                            <div className="font-light md:pt-0.5" style={{ fontSize: "12px" }}>: {capitalizeEachWord(user?.superiorName)}</div>
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-0 lg:h-96 bg-gray-300 border border-gray-300"></div>
                <div className="w-full md:w-2/4 lg:w-1/3 px-2 md:px-0 xl:px-6 pt-3 flex flex-col mb-5 -mt-5 items-center">
                    <div className="w-full">
                        <Input type='text' 
                            name="bank" 
                            labelName="Bank Name"  
                            value={state.bank} 
                            placeholder="BCA - Jhon Doe" 
                            onChange={setState} 
                            // isDisabled={btbStatus === 'view' ? true : false}
                            isRequired/>
                    </div>

                    
                    <div className="w-full">
                        <Input type='text' 
                               name="accountNumber"
                               labelName="Bank Account Number"  
                               value={state.accountNumber} 
                               placeholder="720XXXXX" 
                               onChange={setState} 
                               isRequired/>
                    </div>
                    
                    <div className="w-full flex place-content-end mt-2">
                        <Button size="small" 
                                className='bg-green-400 hover:bg-green-500 text-white' 
                                isLoading={state.isLoading}
                                onClick={ () => saveUpdate()}>
                            Update
                        </Button>
                    </div>
                </div>


            </div>

        </LayoutDetail>
    )
}