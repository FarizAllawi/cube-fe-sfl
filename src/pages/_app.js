import { useState, useEffect } from 'react'
import {ToastContainer} from 'react-toastify'
import { useRouter } from 'next/router'
import Image from 'next/image'
import 'react-toastify/dist/ReactToastify.css'
import '../../tailwindcss/style.css'
import NProgress from 'nprogress'

import Logo from '../../public/images/pictures/kch-office/logo-kalbe.png'
// import "nprogress/nprogress.css"

function Loading() {
	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const color = '#87C141'
	const height = 3

	useEffect(() => {

		const handleStart = (url) => {
			if (url !== router.asPath) setLoading(true)
			NProgress.start()
		}

		const handleComplete = (url) => {
			if (url === router.asPath) {
				setTimeout(() => {
					NProgress.done()
					setLoading(false)
				}, 1250)
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
	})


	return loading ? (
		<>
			<style>{`
				#nprogress {
					pointer-events: none;
				}
				#nprogress .bar {
					background: ${color};
					position: fixed;
					z-index: 10000;
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
					z-index: 10000;
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
			<div className="fixed z-50 ease-linear transition-all delay-500 bg-green-900 w-screen h-screen overflow-hidden" style={{ "zIndex" : 1020}}>
				<div className="relative w-full h-full flex flex-col place-content-center items-center">
					<div className="w-full h-auto flip-to-square">
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
				</div>
			</div>
		</>
	) : (<></>)
}

function MyApp({ Component, ...props }) {
	return (
    <>
      <Loading/>
      <Component {...props.pageProps} />
      <ToastContainer position='top-right'  hideProgressBar closeOnClick/>
    </>
	)
}

export default MyApp
