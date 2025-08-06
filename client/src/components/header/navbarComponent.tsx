import React, { useState } from "react"
import Avatar from "react-avatar"
import { FiChevronDown, FiLogOut, FiClock } from "react-icons/fi"
import FileEditHistoryComponent from "../history/historyComponent"
import { Link } from "react-router-dom"

interface NavbarProps {
    userName?: string
    userEmail?: string
    onSignOut?: () => void
    className?: string
}

const NavbarComponent: React.FC<NavbarProps> = ({
    userName,
    userEmail,
    onSignOut,
    className = "",
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isHistoryOpen, setisHistoryOpen] = useState(false)

    const handleSignOut = () => {
        setIsDropdownOpen(false)
        if (onSignOut) {
            onSignOut()
        }
    }

    return (
        <>
            <nav
                className={`sticky top-0 z-[100] border-b border-gray-200 bg-white bg-white/95 backdrop-blur-sm ${className}`}
            >
                <div className="mx-auto px-6">
                    <div className="flex h-16 items-center justify-between">
                        <Link to="/dashboard">
                            <div className="flex items-center space-x-4">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-lg">
                                    <span className="text-sm font-bold text-white">
                                        {"{W}"}
                                    </span>
                                </div>
                                <div className="hidden sm:block">
                                    <h1 className="text-xl font-bold text-gray-900">
                                        WebCraft
                                    </h1>
                                    <p className="-mt-1 text-xs text-gray-500">
                                        Dashboard
                                    </p>
                                </div>
                            </div>
                        </Link>

                        {/* Right Section */}
                        <div className="flex items-center space-x-4">
                            {/* User Dropdown */}

                           

                            <div className="relative">
                                <button
                                    onClick={() =>
                                        setIsDropdownOpen(!isDropdownOpen)
                                    }
                                    className="group flex items-center space-x-3 rounded-lg p-2 transition-all duration-200 hover:bg-gray-100"
                                >
                                    <div className="relative">
                                        <Avatar
                                            size="32"
                                            textSizeRatio={2}
                                            round
                                            name={userName || "User"}
                                        />
                                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500 shadow-sm"></div>
                                    </div>
                                    <div className="hidden text-left md:block">
                                        <p className="text-sm font-medium text-gray-900 transition-colors group-hover:text-blue-600">
                                            {userName}
                                        </p>
                                    </div>
                                    <FiChevronDown
                                        className={`h-4 w-4 text-gray-500 transition-all duration-200 ${
                                            isDropdownOpen
                                                ? "rotate-180 text-blue-500"
                                                : "group-hover:text-gray-700"
                                        }`}
                                    />
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="animate-in slide-in-from-top-2 absolute right-0 z-50 mt-2 w-72 rounded-xl border border-gray-200 bg-white py-2 shadow-xl duration-200">
                                        <div className="border-b border-gray-100 px-4 py-3">
                                            <div className="flex items-center space-x-3">
                                                <div className="relative">
                                                    <Avatar
                                                        size="32"
                                                        textSizeRatio={2}
                                                        round
                                                        name={
                                                            userName || "User"
                                                        }
                                                    />
                                                    <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white bg-green-500"></div>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-900">
                                                        {userName}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {userEmail}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-100 py-2">
                                            <button
                                                onClick={handleSignOut}
                                                className="group flex w-full items-center space-x-3 px-4 py-3 text-left text-sm text-red-600 transition-all duration-200 hover:bg-red-50"
                                            >
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 transition-colors group-hover:bg-red-200">
                                                    <FiLogOut className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <span className="font-medium">
                                                        Sign Out
                                                    </span>
                                                    <p className="text-xs text-red-500">
                                                        End your session
                                                    </p>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default NavbarComponent
