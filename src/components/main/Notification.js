  
import React, { useEffect } from 'react'

const Notification = ({ text, setIsNotificationOpen }) => {
    const closeNotification = () => {
        setIsNotificationOpen(false);
    }

    useEffect(() => {
        setTimeout(() => { setIsNotificationOpen(false); }, 3000);
    }, []);

    return (
        <div className="notification-container">
            <span>{text}</span>
            <div className="close-notification-container"><span className="close-notification" onClick={closeNotification}>x</span></div>
        </div>
    )
}

export default Notification;