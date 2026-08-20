import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import { Signin } from "../../features/auth/SIgnIn"
import Admin from "../../features/dashboard/Admin"

const AppRouter = () => {
  return (
    <BrowserRouter>
    <Routes>
        <Route path="/signin" element={<Signin/>}/>
        <Route path="/dashboard" element={<Admin/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default AppRouter 