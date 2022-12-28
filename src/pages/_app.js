import { useState, useEffect } from 'react'
import {ToastContainer} from 'react-toastify'
import { useRouter } from 'next/router'
import Image from 'next/image'
import 'react-toastify/dist/ReactToastify.css'
import '../../tailwindcss/style.css'
import NProgress from 'nprogress'

import CubeLogoFull from '../../public/cube-logo-full.png'
// import "nprogress/nprogress.css"

function Loading(props) {
	
	

	


	return(
		<>	
			
		</>
	)
}

function MyApp({ Component, ...props }) {
	const router = useRouter()
	
	const [isMounted, setIsMounted] = useState(false)
	const [loading, setLoading] = useState(false)
	const color = '#7dd3fc'
	const height = 3

	useEffect(() => {
		setIsMounted(true);

		const handleStart = (url) => {
			if (url !== router.asPath) setLoading(true)
			NProgress.start()
		}

		const handleComplete = (url) => {
			if (url === router.asPath) {
				setTimeout(() => {
					NProgress.done()
					setLoading(false)
				}, 1000)
			}
			else {
				setLoading(false)
				NProgress.done()
			}
		}

		router.events.on('routeChangeStart', handleStart)
		router.events.on('routeChangeComplete', handleComplete)
		router.events.on('routeChangeError', handleComplete)

		return () => {
			router.events.off('routeChangeStart', handleStart)
			router.events.off('routeChangeComplete', handleComplete)
			router.events.off('routeChangeError', handleComplete)
		}
	}, [isMounted, router])

	if (!isMounted) return null;

	return (
    <>
		<style>{`
			.fade-in {
				opacity: 1;
				animation-name: fadeInOpacity;
				animation-iteration-count: .5s;
				animation-timing-function: ease-in;
				animation-duration: 1s;
			}
			
			@keyframes fadeInOpacity {
				0% {
					opacity: 0;
				}
				50% {
					opacity: 1;
				}
			}
			#nprogress {
				pointer-events: none;
			}
			#nprogress .bar {
				background: ${color};
				position: fixed;
				z-index: 999999;
				top: 0;
				left: 0;
				width: 100%;
				height: ${height}px;
			}
			#nprogress .peg {
				display: block;
				position: absolute;
				right: 0px;
				width: 100px;
				height: 100%;
				box-shadow: 0 0 10px ${color}, 0 0 5px ${color};
				opacity: 1;
				-webkit-transform: rotate(3deg) translate(0px, -4px);
				-ms-transform: rotate(3deg) translate(0px, -4px);
				transform: rotate(3deg) translate(0px, -4px);
			}
			#nprogress .spinner {
				display: "block";
				position: fixed;
				z-index: 999999;
				top: 15px;
				right: 15px;
			}
			#nprogress .spinner-icon {
				width: 18px;
				height: 18px;
				box-sizing: border-box;
				border: solid 2px transparent;
				border-top-color: ${color};
				border-left-color: ${color};
				border-radius: 50%;
				-webkit-animation: nprogresss-spinner 400ms linear infinite;
				animation: nprogress-spinner 400ms linear infinite;
			}
			.nprogress-custom-parent {
				overflow: hidden;
				position: relative;
			}
			.nprogress-custom-parent #nprogress .spinner,
			.nprogress-custom-parent #nprogress .bar {
				position: absolute;
			}
			@-webkit-keyframes nprogress-spinner {
				0% {
					-webkit-transform: rotate(0deg);
				}
				100% {
					-webkit-transform: rotate(360deg);
				}
			}
			@keyframes nprogress-spinner {
				0% {
					transform: rotate(0deg);
				}
				100% {
					transform: rotate(360deg);
				}
			}
		`}
		</style>
		{
			loading && (
				<div style={{"zIndex" : 1020}} className="fade-in fixed z-50 ease-linear transition-all delay-500 bg-gradient-shine w-screen h-screen overflow-hidden">
					<div className="relative w-full h-full flex flex-col place-content-center items-center">
						<Image src={CubeLogoFull} width={350} height={350} alt="cube-log" />

						<div className="mt-12 w-full h-auto flip-to-square">
							<div></div>
							<div></div>
							<div></div>
							<div></div>
							<div></div>
							<div></div>
							<div></div>
							<div></div>
							<div></div>
						</div>
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
			)
		}
		<div className={`${!loading ? 'fade-in' : 'hidden'}`}>
			<Component {...props.pageProps} />
		</div>
		<ToastContainer position='top-center' style={{zIndex: "999999"}}  hideProgressBar closeOnClick/>
    </>
	)
}

export default MyApp
