import { useEffect } from 'react' 
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'


import useUser from 'pages/api/user'

import CubeLogo from '../../public/images/svg/cube-logo.svg'
import CubeLogoFont from '../../public/images/pictures/cube-logo-font.png'
import SignOutLight from '/public/images/svg/eca/icon-signout-light.svg'

export default function Home(props) {

    const {user, logout} = useUser()

    useEffect( () => {

    }, [])

    return (
        <>
            <Head>
				<title>CUBE - Choose App</title>
			</Head>
            <div className="relatvie w-screen h-screen flex place-content-center max-h-screen overflow-hidden bg-gradient-shine ">

                <div className="absolute w-full flex flex-row place-content-center items-center px-4 xl:px-12 top-12 z-30">
                    <div className="w-1/3">
                        <CubeLogo className='w-20 h-20 sm:w-24 sm:h-24 my-6'/>
                    </div>
                    <div className="w-2/3 flex flex-col gap-2">
                        <div className="w-full text-base lg:text-lg text-right">
                            Hello, {user.name}
                        </div>
                        <div className="w-full flex place-content-end">
                            <div className="w-12 h-12 flex place-content-center items-center rounded-full bg-white drop-shadow-md hover:drop-shadow-sm  cursor-pointer" onClick={() => logout()}>
                                <SignOutLight className="p-0.5"/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute select-none w-full h-full flex flex-col place-content-center items-center z-20">
                    <div className="w-full sm:w-1/2 p-6 sm:p-2 flex flex-row place-content-center items-center gap-4">

                        <Link href="/eca" className='cursor-pointer w-1/2 flex place-content-center items-center h-48 sm:h-56 p-4 bg-white bg-opacity-40 backdrop-blur-md border-2 border-gray-200 rounded-xl'>
                            <div className="w-40 text-center">
                                <div className="mt-4 text-3xl xl:text-5xl text-blue-300 text-logo-stroke-mobile xl:text-logo-stroke-desktop font-extrabold ">ECA</div>
                                <div className="mb-4 text-xs tracking-normal text-blue-300 font-light">EMPLOYEE CLAIM APP</div>
                            </div>
                        </Link>
                        {/* <Link href="/kch-office" className='cursor-pointer w-1/2 flex place-content-center items-center h-48 sm:h-56 p-4 bg-white bg-opacity-40 backdrop-blur-md border-2 border-gray-200 rounded-xl'>
                            <div className="w-40 text-center">
                                <div className="mt-4 text-3xl xl:text-4xl text-green-900 text-logo-stroke-mobile xl:text-logo-stroke-desktop font-extrabold ">CHStar</div>
                                <div className="mb-4 text-base xl:text-xl tracking-wider text-green-500 text-logo-stroke-mobile font-extrabold">KCH OFFICE</div>
                            </div>
                        </Link> */}

                        <div href="#" className='select-none w-1/2 flex place-content-center items-center h-48 sm:h-56 p-4 bg-black bg-opacity-20 backdrop-blur-md border-2 border-gray-200 rounded-xl'>
                            <div className="w-40 text-center">
                                <div className="mt-4 text-3xl xl:text-2xl text-gray-100 text-logo-stroke-mobile xl:text-logo-stroke-desktop font-extrabold ">CHStar</div>
                                <div className="mb-4 text-base xl:text-l tracking-wider text-gray-100 text-logo-stroke-mobile font-extrabold">KCH OFFICE</div>
                                <div className="mb-4 text-base xl:text-4xl tracking-wider text-green-500 text-logo-stroke-mobile font-extrabold">Coming Soon!</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-24">
                    <Image src={CubeLogoFont} width={150} height={150} alt="cube-logo-font"/>
                </div>

                <div className="relative w-full h-full overflow-hidden z-10">
                    <svg className="absolute w-full -bottom-10 left-0"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            viewBox="0 24 150 28"
                            width="1600"
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