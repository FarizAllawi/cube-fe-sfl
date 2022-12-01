import { useState, useEffect } from 'react';

import NavbarDesktop from './navbar-device/desktop'
import NavbarMobile from './navbar-device/mobile'

export default function Navbar(props) {
    const [mounted, setMounted] = useState(false)
    const [size, setWindowSize] = useState({
        width: undefined,
		height: undefined,
	})

    useEffect(() => {
        setMounted(true)
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
    if (!mounted) return null

    return ( 
        <>
            <div className="w-screen h-auto pl-1 pr-3 lg:px-4 pt-2 xl:pt-1 flex flex-row fixed top-0 z-10 bg-neutral-50 dark:bg-gray-900">
            {
                    size.width <= 1024 ? <NavbarMobile /> : <NavbarDesktop />
            }
            </div>
        </>
    )
}