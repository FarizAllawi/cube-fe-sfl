import axios from 'configs/kch-office/axios'
import CryptoJS from 'crypto-js'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

import useUser from 'pages/api/user'
import useForm from 'helpers/useForm'
import capitalizeEachWord from 'helpers/capitalizeEachWord'

import Input from 'components/kch-office/Forms/Input'
import Button from 'components/kch-office/Button'
import Cube from 'components/Cube'

import Logo from '../../public/images/pictures/kch-office/logo-kalbe.png'
import CubeLogo from '../../public/images/svg/cube-logo.svg'
import errorHandler from 'configs/errorHandler'

export default function ChangePassword(props) {
	const router = useRouter()

	const {updateUser, getDetailUser, user, isLoading} = useUser()
	const [errors, setErrors] = useState({})

	const [size, setWindowSize] = useState({
        width: undefined,
		height: undefined,
	})

	const [state, setState, newState] = useForm({
		password: '',
		confirmPassword: '',
	})

	const submitChangePassword = async () => {
        let dataUser = await getDetailUser()

        if (dataUser.uid_user !== undefined) {

            if (state.password !== state.confirmPassword) toast.info("Password and Confirm Password not match")
            else if (state.password === 'sayangsaka') toast.info("Please update your password")
            else {

                if (state.password.length < 8) toast.info('Minimum password is 8 character')
                else if (state.password.length > 15) toast.info("Maximum password is 15 character")
                else {

                    let key = CryptoJS.enc.Utf8.parse(process.env.NEXT_PUBLIC_AES_HASH_KEY)
                    let iv = CryptoJS.enc.Utf8.parse(process.env.NEXT_PUBLIC_AES_IV_KEY)
                    let encryptedPassword = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(state.password), key, {iv:iv, mode:CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7})
                    dataUser['password'] = encryptedPassword.ciphertext.toString(CryptoJS.enc.Base64)

                    let update = await updateUser(dataUser)
                    if (update === 200) {
                        await fetch('/api/auth/logout')
                        await fetch('/api/auth/login', {
                            body: JSON.stringify({
                                nik: dataUser.nik,
                                name: dataUser.name,
                                email: dataUser.email,
                                password: dataUser.password,
                                photo_profile: dataUser.photo_profile,
                                token: user.token,
                                uid_user: dataUser.uid_user,
                                defaultPassword: false
                            }),
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            method: 'POST'
                        })
                        router.push('/');
                    }
                    else errorHandler("There is an error when change your password, Please try again")
                }

            }
        }
        else errorHandler("There is an error when retrieving user data")

	}

	useEffect(() => {

        // Handler to call on window resize
		const handleResize = () => {
			// Set window width/height to state
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			})
		}

        window.addEventListener("resize", handleResize)
        handleResize()

        return () => {
            window.removeEventListener("resize", handleResize)
        }

    }, [])

	return (
		<>
			<Head>
				<title>CUBE - CHANGE PASSWORD</title>
			</Head>

            <div className="absolute top-10 left-0 w-28 h-12 px-2 py-2 xl:w-36 xl:h-14 flex place-content-center items-center rounded-r-2xl bg-white drop-shadow-md border-1 border-gray-200">
                <Image src={Logo} fill className=' py-2 px-2 ' quality={100} priority={true} alt="Logo-KCH" />
            </div>

            

            <div className="relatvie w-screen h-screen max-h-screen overflow-hidden bg-gradient-shine ">

				{
					size.width > 1024 && (
						<div className='absolute w-auto h-auto top-0 right-0 z-20'>
							<div className="scale-15 sm:scale-25 -mt-28 sm:-mt-10 -mr-24 sm:-mr-16">
								<Cube/>
							</div>
						</div> 
					)
				}

                <div className="fixed w-full h-full flex place-content-center z-50">
                    <div className="xl:relative w-full xl:w-1/2 xl:h-full flex flex-col place-content-center items-center">
                        
                        <div className={`w-10/12 sm:w-6/12 xl:w-7/12 2xl:w-6/12 p-2.5 xl:p-3 ${ size.width < 1280 && size.height < 500 && 'mb-4' }
                                        flex flex-col place-content-center items-center 
                                        border-2 border-gray-200
                                        backdrop-blur-sm
                                        bg-white bg-opacity-40 rounded-3xl`}>

                            <CubeLogo className='w-32 h-32 my-6'  />

                            <div className="text-black text-xl font-medium mt-1 xl:mt-0.5 xl:mb-2">Change Password</div>
                            <div className="text-black text-sm text-center font-light mt-1 mb-1.5 xl:mt-0.5 xl:mb-2 px-3 sm:px-6 xl:px-5">
                                {
                                    user?.defaultPassword ? "Hello "+ capitalizeEachWord(user.name) +' It looks like you using default password, please change your password due to security reason' : 'Type your new password'
                                }
                                
                            </div>

                            <div className="w-full h-full px-3 sm:px-6 xl:px-5
                                            flex flex-col gap-2 sm:gap-4 place-content-center
                                            ">
                                <Input  type='password'
                                        name='password'
                                        value={state.password}
                                        onChange={setState}
                                        errorResponse={!errors?.password ? 'Please match the requested field' : errors?.password[0]}
                                        errorStatus={errors?.password ? true : false}
                                        placeholder='Password' />

                                <Input  type='password'
                                        name='confirmPassword'
                                        value={state.confirmPassword}
                                        onChange={setState}
                                        errorResponse={!errors?.confirmPassword ? 'Please match the requested field' : errors?.password[0]}
                                        errorStatus={errors?.confirmPassword ? true : false}
                                        placeholder='Confirm your password' />

                                <div className="text-stone-400 text-sm font-light mt-1">
                                    Have a problem with your account? please contact the
                                    <Link href="" className="ml-1 text-sky-400">
                                        Administrator
                                    </Link>
                                </div>
                                <div className="w-full flex flex-row place-content-center items-center">
                                    <div className="w-full flex place-content-end">
                                        <Button type="primary" className='mt-2 w-1/3 bg-sky-300 border-2 border-sky-300 hover:bg-opacity-80 hover:border-opacity-80 text-white' isLoading={isLoading} onClick={() => submitChangePassword()}>Save</Button>
                                    </div>
                                </div>

                            </div>
                        </div>
                        
                    </div>
                </div>
                <div className="relative w-full h-full overflow-hidden z-10">
                    <svg className="absolute bottom-0 left-0"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            viewBox="0 24 150 28"
                            preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="a" x1="50%" x2="50%" y1="-10.959%" y2="100%">
                                <stop stopColor="#57BBC1" stopOpacity=".25" offset="0%"/>
                                <stop stopColor="#015871" offset="100%"/>
                            </linearGradient>
                            <path id="gentle-wave"
                                d="M-160 44c30 0 
                                    58-18 88-18s
                                    58 18 88 18 
                                    58-18 88-18 
                                    58 18 88 18
                                    v44h-352z" />
                        </defs>
                        <g className="parallax">
                            <use xlinkHref="#gentle-wave" x="50" y="0" fill="url(#a)"/>
                            <use xlinkHref="#gentle-wave" x="50" y="10" fill="url(#a)"/>
                            <use xlinkHref="#gentle-wave" x="50" y="5" fill="url(#a)"/>  
                        </g>
                    </svg>
                </div>

            </div>
		</>
	)
}
