import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"

import Admin from "../../features/dashboard/Admin"
import { Protectedrouter } from "./Protectedrouter"
import NotFoundPage from "../../shared/pages/NotFoundPage"
import { Donor } from "../../features/dashboard/Donor"
import { Ngo } from "../../features/dashboard/Ngo"
import { SignIn } from "../../features/auth/SIgnIn"


const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/signin" element={<SignIn />} />
                <Route element={<Protectedrouter />}>
                    <Route path="/dashboard-admin" element={<Admin />} />
                    <Route path="/dashboard-donor" element={<Donor />} />
                    <Route path="/dashboard-ngo" element={<Ngo />} />
                </Route>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter 