import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { useDropzone } from 'react-dropzone'

import useUser from 'pages/api/user'

import errorHandler from 'configs/errorHandler'

import ProfileInitial from "components/kch-office/ProfileInitial"
import Layout from "components/kch-office/Layout"
import Button from 'components/kch-office/Button'

import capitalizeEachWord from 'helpers/capitalizeEachWord'

import ChangePasswordIcon from '/public/images/svg/kch-office/change-password-white.svg'
import EditIcon from '../../../public/images/svg/kch-office/edit-icon-white.svg'

import { toast } from 'react-toastify'
import { Router } from 'next/router'

export default function Profile(props) {
    const router = useRouter()
    const { getUser, getDetailUser, updateUser, setUser } = useUser()

    const [user, setUserProfile] = useState({})
    const [isEdit, setIsEdit] = useState(false)
    const [progress, setProgress] = useState(0)

    const imageLoader = ({src}) => {
        return src
    }

    const uploadFile = async (event) => {

        let type = event.target.files[0].type
        if (type.split('/')[0] !== "image") return errorHandler("Unsuported File Type")
        
        setIsEdit(true)

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()

            xhr.open('POST', `/api`)
            // xhr.withCredentials = true
            // xhr.setRequestHeader("Cache-Control", "no-cache");
            // xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            // xhr.setRequestHeader("X-File-Name", files.name);
            // xhr.setRequestHeader('Access-Control-Allow-Origin', `${process.env.NEXT_PUBLIC_API_STORAGE}`)
            // xhr.setRequestHeader('Accept', files.type)
            // xhr.setRequestHeader('Access-Control-Allow-Method', 'POST, OPTIONS, GET, PUT, DELETE, PATCH')
            // xhr.setRequestHeader('Access-Control-Allow-Headers','Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, Accept, Origin, Cache-Control, X-Requested-With, Depth, User-Agent, If-Modified-Since, X-File-Size, X-Requested-With, X-File-Name, If-None-Match')
            // xhr.setRequestHeader('Access-Control-Allow-Headers', "X-Requested-With, X-File-Name, Content-Type, multipart/form-data, Origin, authorization, Accept, SMCHALLENGE")
            
            xhr.onload = async () => {
                const resp = JSON.parse(xhr.responseText)
                user['photo_profile'] = resp.data.filePath
                let update = await updateUser(user)
                let userSession = await getUser()

                if (update === 200) {

                    let updateUserSession = {
                        nik: userSession.nik,
                        name: userSession.name,
                        email: userSession.email,
                        photo_profile: user.photo_profile,
                        token: userSession.token,
                        uid_user: userSession.uid_user,
                    }


                    await getUser()
                    await fetch('/api/auth/login', {
                        body: JSON.stringify(updateUserSession),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        method: 'POST'
                    })

                    setUser(updateUserSession)
                    setUserProfile(user)
                    toast.success("Profile Picture Updated")
                }
                
                setIsEdit(false)
                resolve(resp.data)
            }

            xhr.onerror = (evt) => {
                setError(true)
                reject(evt)
            }

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentage = (event.loaded/event.total) * 100
                    setProgress(Math.round(percentage))
                }
            }

            const formData = new FormData()
            formData.append('Files', event.target.files[0])
            xhr.send(formData)
        })

    }

    useEffect(() => {

        const getUser = async () => {
            let user = await getDetailUser()
            setUserProfile(user)
        }

        if (user?.name === undefined) getUser()

    }, [user, getDetailUser])

    return (
        <>
            <Layout>
                <div className="w-full flex place-content-center">
                    <div className="mt-10 sm:mt-20 w-full sm:mx-10 xl:mb-24 2xl:mb-0 rounded-3xl  xl:w-1/3 h-auto bg-green-500 bg-opacity-40">
                        <div className="w-full pt-3 pb-1 text-center text-base sm:text-2xl text-green-900 font-semibold">PROFILE</div>
                        <div className="w-full h-full px-8 sm:px-10 flex flex-col bg-green-900 rounded-3xl">
                            <div className="w-full h-48 sm:h-52 flex flex-col gap-4 place-content-center items-center">
                                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-500">
                                    {
                                        user?.photo_profile === null || user?.photo_profile === undefined ? (
                                            <ProfileInitial name={user?.name} width="" height="full" className='text-xl xl:text-2xl'/>
                                        ) : (
                                            <Image  fill
                                                    loader={imageLoader}
                                                    src={`${process.env.NEXT_PUBLIC_API_STORAGE}/files/get?filePath=${user.photo_profile}`} 
                                                    className="object-contain rounded-full" 
                                                    alt="profile-image"/>
                                        )
                                    }

                                    {
                                        !isEdit ? (
                                            <>
                                                <label htmlFor="button-file" className="cursor-pointer absolute bottom-0 -right-2 w-8 h-8 flex place-content-center items-center bg-green-500 hover:bg-opacity-90 border border-green-900 rounded-full">
                                                    <EditIcon className="p-1.5" />
                                                </label>
                                                <input accept="image/*" id="button-file" type="file" onChange={uploadFile} style={{ display: 'none' }} />
                                            </>
                                        ) : (
                                            <div className="absolute top-0 w-16 h-16 sm:w-20 sm:h-20 flex place-content-center items-center bg-black bg-opacity-80 rounded-full">
                                                <div className="absolute w-8 h-8 sm:w-8 sm:h-8 flex place-content-center items-center bg-green-500 text-xs text-white rounded-full">
                                                    { progress }%
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>



                                <div className="text-lg sm:text-lg text-white font-semibold">{capitalizeEachWord(user?.name)}</div>
                            </div>

                            <div className="w-full flex flex-col gap-3">
                                <div className="w-full flex flex-row">
                                    <div className="w-2/5 sm:w-1/3 text-white text-sm  font-medium">NIK</div>
                                    <div className="w-3/5 sm:w-2/3 text-white text-xs sm:text-sm font-medium">: {user?.nik}</div>
                                </div>
                                <div className="w-full flex flex-row">
                                    <div className="w-2/5 sm:w-1/3 text-white text-sm  font-medium">Email</div>
                                    <div className="w-3/5 sm:w-2/3 text-white text-xs sm:text-sm font-medium">: {user?.email}</div>
                                </div>
                                <div className="w-full flex flex-row">
                                    <div className="w-2/5 sm:w-1/3 text-white text-sm  font-medium">Department</div>
                                    <div className="w-3/5 sm:w-2/3 text-white text-xs sm:text-sm font-medium">: {user?.deptName}</div>
                                </div>
                                <div className="w-full flex flex-row">
                                    <div className="w-2/5 sm:w-1/3 text-white text-sm  font-medium">Division</div>
                                    <div className="w-3/5 sm:w-2/3 text-white text-xs sm:text-sm font-medium">: {user?.divName}</div>
                                </div>
                                <div className="w-full flex flex-row">
                                    <div className="w-2/5 sm:w-1/3 text-white text-sm  font-medium">Level</div>
                                    <div className="w-3/5 sm:w-2/3 text-white text-xs sm:text-sm font-medium">: {user?.jobLvlName}</div>
                                </div>
                                <div className="w-full flex flex-row">
                                    <div className="w-2/5 sm:w-1/3 text-white text-sm  font-medium">Golongan</div>
                                    <div className="w-3/5 sm:w-2/3 text-white text-xs sm:text-sm font-medium">: {user?.golongan}</div>
                                </div>
                                <div className="w-full flex flex-row mt-6">
                                    <div className="w-2/5 sm:w-1/3 text-white text-sm font-medium">Superior NIK</div>
                                    <div className="w-3/5 sm:w-2/3 text-white text-xs sm:text-sm font-medium">: {user?.superiorNIK}</div>
                                </div>
                                <div className="w-full flex flex-row">
                                    <div className="w-2/5 sm:w-1/3 text-white text-sm font-medium">Superior Name</div>
                                    <div className="w-3/5 sm:w-2/3 text-white text-xs sm:text-sm font-medium"> : {capitalizeEachWord(user?.superiorName)}</div>
                                </div>
                            </div>
                        </div>
                        <Button size="flex"
                                className="py-1.5 xl:py-2 text-sm xl:text-base mt-3 bg-green-500"
                                prependIcon={<ChangePasswordIcon className='p-1' />}
                                onClick={() => router.push('/change-password')}>
                            Change Password
                        </Button>
                    </div>
                </div>
            </Layout>
            <div className="fixed w-full py-2 text-xs text-center xl:text-sm font-medium text-black text-opacity-50 bottom-0 bg-white">
                Created With ❤️ Made By Talent Kampus Merdeka Batch 3
            </div>
        </>
    )
}