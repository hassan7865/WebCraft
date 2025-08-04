import api from "@/api/serverapi"
import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useState, useEffect } from "react"
import Avatar from "react-avatar"
import Select from "react-select"

interface User {
    _id: string
    username: string
    email: string
}

interface InviteUserDialogProps {
    isOpen: boolean
    onClose: () => void
    projectId: string
}

const InviteUserDialog = ({
    isOpen,
    onClose,
    projectId,
}: InviteUserDialogProps) => {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [inviteStatus, setInviteStatus] = useState<
        "idle" | "loading" | "success" | "error"
    >("idle")

    // Search users from backend
    useEffect(() => {
        const searchUsers = async () => {
            if (searchQuery.length < 3) {
                setUsers([])
                return
            }

            setIsLoading(true)
            try {
                const response = await api.get("/user/search", {
                    params: { username: searchQuery },
                })
                setUsers(response.data.users)
            } catch (error) {
                setUsers([])
            } finally {
                setIsLoading(false)
            }
        }

        const debounceTimer = setTimeout(() => {
            searchUsers()
        }, 500)

        return () => clearTimeout(debounceTimer)
    }, [searchQuery])

    const handleInvite = async () => {
        if (!selectedUser) return

        setInviteStatus("loading")
        try {
            await api.post("/user/invite", {
                projectId,
                userId: selectedUser._id,
            })
            setInviteStatus("success")
            setTimeout(() => {
                onClose()
                setInviteStatus("idle")
                setSelectedUser(null)
                setSearchQuery("")
            }, 1500)
        } catch (error) {
            console.error("Error inviting user:", error)
            setInviteStatus("error")
        }
    }

    const formatOptionLabel = (user: User) => (
        <div className="flex items-center gap-3">
            <Avatar
                size="32"
                textSizeRatio={2}
                round
                name={user.username || "User"}
            />
            <div>
                <div className="font-medium text-gray-900">{user.username}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
            </div>
        </div>
    )

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900"
                                >
                                    Add User to Project
                                </Dialog.Title>

                                <div className="mt-4">
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Search users
                                    </label>
                                    <Select
                                        options={users}
                                        value={selectedUser}
                                        onChange={(user) =>
                                            setSelectedUser(user)
                                        }
                                        onInputChange={(value) =>
                                            setSearchQuery(value)
                                        }
                                        formatOptionLabel={formatOptionLabel}
                                        getOptionValue={(user) => user._id}
                                        getOptionLabel={(user) => user.username}
                                        isLoading={isLoading}
                                        isClearable
                                        placeholder="Type at least 3 characters to search..."
                                        noOptionsMessage={() =>
                                            searchQuery.length < 3
                                                ? "Type at least 3 characters to search"
                                                : "No users found"
                                        }
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        menuPortalTarget={document.body}
                                        styles={{
                                            menuPortal: (base) => ({
                                                ...base,
                                                zIndex: 9999,
                                            }),
                                            control: (base) => ({
                                                ...base,
                                                minHeight: "44px",
                                                borderRadius: "0.5rem",
                                                borderColor: "#d1d5db",
                                                "&:hover": {
                                                    borderColor: "#9ca3af",
                                                },
                                            }),
                                            option: (base, { isFocused }) => ({
                                                ...base,
                                                backgroundColor: isFocused
                                                    ? "#f3f4f6"
                                                    : "white",
                                                color: "#111827",
                                                ":active": {
                                                    backgroundColor: "#e5e7eb",
                                                },
                                            }),
                                        }}
                                    />
                                </div>

                                {inviteStatus === "success" && (
                                    <div className="mt-4 rounded-md bg-green-50 p-3 text-green-700">
                                         Member Added successfully!
                                    </div>
                                )}

                                {inviteStatus === "error" && (
                                    <div className="mt-4 rounded-md bg-red-50 p-3 text-red-700">
                                        Failed to Add. Please try
                                        again.
                                    </div>
                                )}

                                <div className="mt-6 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                        onClick={() => {
                                            onClose()
                                            setSelectedUser(null)
                                            setSearchQuery("")
                                            setInviteStatus("idle")
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        disabled={
                                            !selectedUser ||
                                            inviteStatus === "loading"
                                        }
                                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        onClick={handleInvite}
                                    >
                                        {inviteStatus === "loading" ? (
                                            <>
                                                <svg
                                                    className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                Adding...
                                            </>
                                        ) : (
                                            "Add Member"
                                        )}
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default InviteUserDialog
