import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"

import Admin from "../../features/dashboard/Admin"
import { Protectedrouter } from "./Protectedrouter"
import NotFoundPage from "../../shared/pages/NotFoundPage"
import { Donor } from "../../features/dashboard/Donor"
import { Ngo } from "../../features/dashboard/Ngo"
import Auth from "../../features/auth/Auth"
import { AuthRouter } from "./AuthRouter"


const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AuthRouter />}>
                    <Route path="/auth" element={<Auth />} />
                </Route>
                <Route element={<Protectedrouter />}>
                    <Route path="/dashboard-admin" element={<Admin />} />
                    <Route path="/dashboard-donor" element={<Donor />} />
                    <Route path="/dashboard-ngo" element={<Ngo />} />
                </Route>
                <Route path="/" element={<Navigate to="/auth" replace />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter 