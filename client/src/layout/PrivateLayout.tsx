import HeaderComponent from "@/components/header/headerComponent"
import UserState from "@/utils/UserState"
import { Navigate, Outlet } from "react-router-dom"

const PrivateRoute = () => {
    const currentUser = UserState.GetUserData()
   

    return currentUser ? (
        <>
            <HeaderComponent />
            <Outlet />
        </>
    ) : (
        <Navigate to="/" replace />
    )
}

export default PrivateRoute
