import HeaderComponent from "@/components/header/headerComponent"
import UserState from "@/utils/UserState"
import { Navigate, Outlet } from "react-router-dom"

const PrivateRoute = () => {
    const currentUser = UserState.GetUserData()
    console.log(currentUser)

    return currentUser ? (
        <>
            <HeaderComponent />
            <Outlet />
        </>
    ) : (
        <Navigate to="/auth" replace />
    )
}

export default PrivateRoute
