import axios from 'configs/axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'

import useUser from 'pages/api/kch-office/user'
import useForm from 'helpers/useForm'

import Input from 'components/kch-office/Forms/Input'
import Button from 'components/kch-office/Button'

import Logo from '../../../public/images/pictures/kch-office/logo-kalbe.png'
import Cartoon from '../../../public/images/pictures/kch-office/cartoon.png'

export default function Login(props) {
	const router = useRouter()

	const {login, isLoading} = useUser()

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
			password: state.password
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
				<title>KCH OFFICE - LOGIN</title>
			</Head>
            <div className="w-screen h-screen max-h-screen overflow-hidden  flex flex-col xl:flex-row ">
                <div className={`h-full xl:w-1/2 xl:h-full 2xl:pl-10 pb-20 ${size.width > 1280 && 'rounded-login'} bg-gradient-login`}>
					
					<div className="absolute top-10 left-0 w-28 h-12 px-2 py-2 xl:w-36 xl:h-14 flex place-content-center items-center rounded-r-2xl bg-white">
						<Image src={Logo} fill className=' py-2 px-2 ' quality={100} priority={true} alt="Logo-KCH" />
					</div>

					<div className="mt-24 pt-2 xl:mt-28 2xl:mt-32 ml-7 xl:ml-12 font-bold text-3xl xl:text-5xl text-white">
						Welcome Back!
					</div>

					<div className="relative h-full flex place-content-end">
						<div className="absolute w-full xl:w-11/12 xl:pl-14 2xl:pl-0  flex place-content-end">
							<Image src={Cartoon} 
									className="object-cover"
									quality={100} 
									priority={true} 
									alt="Cartoon" />
						</div>
					</div>
				

                </div>

                <div className="absolute xl:relative w-full xl:w-1/2 xl:h-full bottom-0 flex flex-col place-content-center items-center xl:bg-white">
                    
					<div className={`w-10/12 xl:w-7/12 2xl:w-6/12 p-2.5 xl:p-3 mt-32 ${ size.width < 1280 && size.height < 500 && 'mb-4' }
									flex flex-col place-content-center items-center 
									bg-gray-100 backdrop-blur-sm bg-opacity-40  xl:bg-opacity-100 rounded-3xl shadow-center`}>

						<div className="text-black text-xl font-semibold mt-1 mb-1.5 xl:mt-0.5 xl:mb-2">Log In</div>

						<div className="w-full h-full py-3 px-6 xl:py-5 xl:px-5
										flex flex-col gap-1 xl:gap-4 place-content-center items-center
										bg-white drop-shadow-sm rounded-3xl">
							
							<Input  type='email'
									name='email'
									value={state.email}
									onChange={setState}
									placeholder='Email' />

							<Input  type='password'
									name='password'
									value={state.password}
									onChange={setState}
									placeholder='Password' />

							<Button className='mt-2 w-1/2 bg-green-500 hover:bg-opacity-80 text-white' isLoading={isLoading} onClick={() => submitLoginForm()}>Log In</Button>

						</div>
					</div>
					
					{
						size.height > 500 && (
							<>
								<div className="mt-4 xl:mt-10 text-3xl xl:text-4xl text-green-900 text-logo-stroke-mobile xl:text-logo-stroke-desktop font-extrabold ">CHStar</div>
								<div className="mb-4 xl:mb-0 text-base xl:text-xl tracking-wide text-green-500 text-logo-stroke-mobile xl:text-logo-stroke-desktop font-extrabold">KCH OFFICE</div>
							</>
						)
					}
					
                </div>
            </div>
		</>
	)
}
