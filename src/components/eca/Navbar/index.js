import { useState, useEffect } from 'react';

import NavbarDesktop from './navbar-device/desktop'
import NavbarMobile from './navbar-device/mobile'

export default function Navbar(props) {
    const [mounted, setMounted] = useState(false)
    const [size, setWindowSize] = useState({
        width: undefined,
		height: undefined,
	})

    const [updateLocalStorage, setUpdateLocalStorage] = useState(false)

    const initLocalStorage = () => {
        localStorage.setItem('current-page', '/eca') // Hompage route path
        localStorage.setItem('navigation-page', JSON.stringify([]))  //set empty navigation page
        setUpdateLocalStorage(true)
    }
    

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

        if (!updateLocalStorage) initLocalStorage()

        window.addEventListener("resize", handleResize)
        handleResize()

        return () => {
            window.removeEventListener("resize", handleResize)
        }

    }, [updateLocalStorage])
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