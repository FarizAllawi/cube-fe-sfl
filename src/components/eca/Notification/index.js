import propTypes from 'prop-types'
import {useState, useEffect} from 'react'
import {useTheme} from 'next-themes'

import useNotification from 'pages/api/eca/notification'

import NotificationLight from "/public/images/svg/eca/notification-light.svg"
import NotificationDark from '/public/images/svg/eca/notification-dark.svg'

export default function Notification(props) {

    const { notifications } = useNotification()

    const [userNotification, setUserNotificaton] = useState(notifications)
    const [fetchStatus, setFetchStatus] = useState(false)
    const {theme} = useTheme()

    useEffect(() => {
        
        if (notifications.length === 0 && fetchStatus === false) {
            setUserNotificaton(notifications)
            setFetchStatus(true)
        }
        
    },[fetchStatus, notifications])

    return (
        <div className="py-3 px-3.5 rounded-full bg-white dark:bg-gray-700 drop-shadow-md hover:drop-shadow-sm  cursor-pointer">
            {
                theme === 'dark' ? (
                    <NotificationDark className="p-0.5" />
                ) : (
                    <NotificationLight className="p-0.5" />
                )
            }
            {
                notifications?.length > 0 && (
                    <div className="absolute flex h-4 w-4 top-2 right-2.5">
                        <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></div>
                        <div className="flex place-content-center items-center text-center rounded-full h-4 w-4 bg-red-500 text-white" style={{ fontSize: "8px"}}>
                            {notifications.length}
                        </div>
                    </div>
                )
            }
            
        </div>
    )
}

Notification.propTypes = {

}