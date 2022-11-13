import { useState, useEffect } from 'react';

import NavbarDesktop from './navbar-device/desktop'
import NavbarMobile from './navbar-device/mobile'

export default function Navbar(props) {
    const [size, setWindowSize] = useState({
        width: undefined,
		height: undefined,
	})

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
            <div className="fixed top-0 w-screen h-auto flex flex-col gap-3" style={{ 'zIndex' : '9000' }}>
                <div className="w-full flex flex-row px-6 lg:px-12 pt-4 pb-2 xl:pt-1 fixed top-0 z-10 bg-white">
                {
                    size.width <= 1024 ? <NavbarMobile /> : <NavbarDesktop />
                }
                </div>
                <div className="w-full mt-20 xl:mt-16 pt-2 xl:pt-3 px-6 lg:px-12 fixed top-0 z-10 bg-white ">
                    <div className="w-full bg-green-900 border border-white h-0.5"></div>
                </div>
            </div>
            
        </>
    )
}