import { useAppContext } from "@/context/AppContext"
import { useChatRoom } from "@/context/ChatContext"
import { SyntheticEvent, useEffect, useRef } from "react"
import Avatar from "react-avatar"

function ChatList() {
    const {
        messages,
        isNewMessage,
        setIsNewMessage,
        lastScrollHeight,
        setLastScrollHeight,
    } = useChatRoom()
    const { currentUser } = useAppContext()
    const messagesContainerRef = useRef<HTMLDivElement | null>(null)

    const handleScroll = (e: SyntheticEvent) => {
        const container = e.target as HTMLDivElement
        setLastScrollHeight(container.scrollTop)
    }

    useEffect(() => {
        if (!messagesContainerRef.current) return
        messagesContainerRef.current.scrollTop =
            messagesContainerRef.current.scrollHeight
    }, [messages])

    useEffect(() => {
        if (isNewMessage) {
            setIsNewMessage(false)
        }
        if (messagesContainerRef.current)
            messagesContainerRef.current.scrollTop = lastScrollHeight
    }, [isNewMessage, setIsNewMessage, lastScrollHeight])

    return (
        <div
            className="flex-grow overflow-auto rounded-md bg-lightHover p-4"
            ref={messagesContainerRef}
            onScroll={handleScroll}
        >
            {messages.map((message, index) => {
                const isCurrentUser = message.username === currentUser.username

                return (
                    <div
                        key={index}
                        className={`mb-4 flex ${isCurrentUser ? "justify-start" : "justify-end"}`}
                    >
                        <div className="flex max-w-[80%] gap-3">
                            {isCurrentUser && (
                                <Avatar name={message.username} size="40" round="8px" />
                            )}

                            <div
                                className={`rounded-lg px-4 py-2 shadow-md ${
                                    isCurrentUser
                                        ? "bg-primary text-white"
                                        : "bg-light text-dark"
                                }`}
                            >
                                <div className="mb-1 flex justify-between gap-4 text-xs text-gray-500">
                                    <span>{message.username}</span>
                                    <span>{message.timestamp}</span>
                                </div>
                                <p className="text-sm">{message.message}</p>
                            </div>

                            {!isCurrentUser && (
                                <Avatar name={message.username} size="40" round="8px" />
                            )}

                           
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default ChatList
