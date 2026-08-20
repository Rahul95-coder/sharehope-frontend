import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

export const Protectedrouter = () => {

    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user"))

    if (!user || !user.email || !user.password || !user.role) {
        return <Navigate to="/signin" state={{ from: location }} replace />
    }

    return <Outlet/>
}
