import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import CubeLogo from '../../public/images/svg/cube-logo.svg'
import NotFound from '../../public/images/svg/not-found-error.svg'
import CubeLogoFont from '../../public/images/pictures/cube-logo-font.png'

export default function Page_404(props) {

    const router = useRouter()

    return (
        <>
            <Head>
				<title>CUBE - NOT FOUND</title>
			</Head>
            <div className="relatvie w-screen h-screen flex place-content-center max-h-screen overflow-hidden bg-gradient-shine ">
                
                <div className="absolute w-full h-full flex flex-col sm:flex-row gap-4 p-4 z-30">
                    <div className="relative w-full flex place-content-center h-1/3 sm:w-1/2 sm:h-full ">
                        <div className="absolute w-80 sm:w-full sm:top-48 md:top-36 xl:top-20">
                            <NotFound className='p-4' />
                        </div>
                    </div>
                    <div className="relative w-full h-2/3 sm:w-1/2 sm:h-full flex flex-col">
                        <div className="w-full sm:mt-24 flex flex-col" onClick={() => router.push('/')}>
                            <div className="w-full xl:w-11/12 font-semibold xl:font-light text-xl sm:text-2xl xl:text-4xl text-cyan-800">Oops, Looks like we can not find the page you want</div>
                        </div>
                        <div className="w-full h-full flex flex-col mt-6 xl:mt-12">
                            <div className="text-center text-base xl:text-lg font-light xl:font-semibold text-cyan-800">Chose the app you want to go</div>
                            <div className="w-full p-6 flex flex-row place-content-center items-center gap-4">
                                <Link href="/eca" className='cursor-pointer w-1/2 flex place-content-center items-center h-48 sm:h-56 p-4 bg-white bg-opacity-40 backdrop-blur-md border-2 border-gray-200 rounded-xl'>
                                    <div className="w-40 text-center">
                                        <div className="mt-4 text-3xl xl:text-5xl text-blue-300 text-logo-stroke-mobile xl:text-logo-stroke-desktop font-extrabold ">ECA</div>
                                        <div className="mb-4 text-xs tracking-normal text-blue-300 font-light">EMPLOYEE CLAIM APP</div>
                                    </div>
                                </Link>
                                <Link href="/kch-office" className='cursor-pointer w-1/2 flex place-content-center items-center h-48 sm:h-56 p-4 bg-white bg-opacity-40 backdrop-blur-md border-2 border-gray-200 rounded-xl'>
                                    <div className="w-40 text-center">
                                        <div className="mt-4 text-3xl xl:text-4xl text-green-900 text-logo-stroke-mobile xl:text-logo-stroke-desktop font-extrabold ">CHStar</div>
                                        <div className="mb-4 text-base xl:text-xl tracking-wider text-green-500 text-logo-stroke-mobile font-extrabold">KCH OFFICE</div>
                                    </div>
                                </Link>

                            </div>
                        </div>
                    </div>
                </div>
                

                <div className="absolute bottom-24">
                    <Image src={CubeLogoFont} width={150} height={150} alt="cube-logo-font"/>
                </div>
                <div className="relative w-full h-full overflow-hidden z-10">
                    <svg className="absolute h-1/4 bottom-0 left-0"
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