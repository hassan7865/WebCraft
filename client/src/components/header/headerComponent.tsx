import { useState } from "react"
import NavbarComponent from "./navbarComponent"
import UserState from "@/utils/UserState"
import { useNavigate } from "react-router-dom"

const HeaderComponent: React.FC = () => {
    const User = UserState.GetUserData()
    const navigate = useNavigate()

    const handleSignOut = () => {
        UserState.DeleteUser()
        navigate("/auth")
    }

    return (
        <NavbarComponent
            userName={User.username}
            userEmail={User.email}
            onSignOut={handleSignOut}
        />
    )
}

export default HeaderComponent
