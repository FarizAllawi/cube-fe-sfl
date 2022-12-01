import axios from 'configs/kch-office/axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

import styles from '/styles/dashboard/Login.module.css'

import useUser from 'pages/api/user'
import useForm from 'helpers/useForm'

import Input from 'components/kch-office/Forms/Input'
import Button from 'components/kch-office/Button'
import Cube from 'components/Cube'

import Logo from '../../public/images/pictures/kch-office/logo-kalbe.png'
import CubeLogo from '../../public/images/svg/cube-logo.svg'

import Cartoon from '../../public/images/pictures/kch-office/cartoon.png'

export default function ResetPassword(props) {
	const router = useRouter()

	const {login ,isLoading} = useUser()
	const [errors, setErrors] = useState({})

	const [size, setWindowSize] = useState({
        width: undefined,
		height: undefined,
	})

	const [state, setState, newState] = useForm({
		email: '',
		password: '',
	})

	const submitLoginForm = async () => {
		await login({
			email: state.email,
			password: state.password,
			setErrors
		})
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
				<title>CUBE - RESET PASSWORD</title>
			</Head>

            <div className="absolute top-10 left-0 w-28 h-12 px-2 py-2 xl:w-36 xl:h-14 flex place-content-center items-center rounded-r-2xl bg-white drop-shadow-md border-1 border-gray-200">
                <Image src={Logo} fill className=' py-2 px-2 ' quality={100} priority={true} alt="Logo-KCH" />
            </div>

            

            <div className="relatvie w-screen h-screen max-h-screen overflow-hidden">
                <div className='absolute w-auto h-auto top-0 right-0 z-20'>
                    <div className="scale-15 sm:scale-25 -mt-28 sm:-mt-10 -mr-24 sm:-mr-16">
                        <Cube/>
                    </div>
                </div> 

                {/* <div className='absolute w-auto h-auto bottom-0 -left-100 z-10'>
                    <div className="scale-25 -mb-16 -ml-20 sm:-ml-16 h-auto ">
                        <Cube/>
                    </div>
                </div>  */}

                <div className="absolute w-full h-full flex place-content-center z-50">
                    <div className="xl:relative w-full xl:w-1/2 xl:h-full flex flex-col place-content-center items-center ">
                        
                        <div className={`w-10/12 sm:w-7/12 xl:w-7/12 2xl:w-6/12 p-2.5 xl:p-3 ${ size.width < 1280 && size.height < 500 && 'mb-4' }
                                        flex flex-col place-content-center items-center 
                                        border-2 border-gray-200
                                        backdrop-blur-sm
                                        bg-white bg-opacity-20 rounded-3xl`}>

                            <CubeLogo className='w-32 h-32 my-6'  />

                            <div className="text-black text-xl font-medium mt-1 xl:mt-0.5 xl:mb-2">Change Password</div>
                            <div className="text-black text-sm text-center font-light mt-1 mb-1.5 xl:mt-0.5 xl:mb-2 px-3 sm:px-6 xl:px-5">It seem you using default password, please change your password due security reason</div>

                            <div className="w-full h-full px-3 sm:px-6 xl:px-5
                                            flex flex-col gap-2 sm:gap-4 place-content-center
                                            ">
                                <Input  type='email'
                                        name='email'
                                        value={state.email}
                                        onChange={setState}
                                        errorResponse={!errors?.email ? 'Please match the requested field' : errors?.email[0]}
                                        errorStatus={errors?.email ? true : false}
                                        placeholder='Email' />

                                <Input  type='password'
                                        name='password'
                                        value={state.password}
                                        onChange={setState}
                                        errorResponse={!errors?.password ? 'Please match the requested field' : errors?.password[0]}
                                        errorStatus={errors?.password ? true : false}
                                        placeholder='Password' />

                                <div className="text-stone-400 text-sm font-light mt-1">
                                    Have a problem with your account? please contact the
                                    <Link href="" className="ml-1 text-sky-400">
                                        Administrator
                                    </Link>
                                </div>
                                <div className="w-full flex flex-row place-content-center items-center">
                                    <div className="w-full flex place-content-end">
                                        <Button type="primary" className='mt-2 w-1/3 bg-sky-300 border-2 border-sky-300 hover:bg-opacity-80 hover:border-opacity-80 text-white' isLoading={isLoading} onClick={() => submitLoginForm()}>Log In</Button>
                                    </div>
                                </div>

                            </div>
                        </div>
                        
                    </div>
                </div>
                <div className="relative w-screen h-full overflow-hidden z-10">
                    <div className="ocean">
                        <div className="wave"></div>
                        <div className="wave"></div>
                    </div>
                </div>

            </div>



		</>
	)
}
