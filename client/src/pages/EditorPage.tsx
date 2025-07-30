import api from "@/api/serverapi"
import SplitterComponent from "@/components/SplitterComponent"
import ConnectionStatusPage from "@/components/connection/ConnectionStatusPage"
import Loader from "@/components/loader/loaderComponent"
import Sidebar from "@/components/sidebar/Sidebar"
import WorkSpace from "@/components/workspace"
import { useAppContext } from "@/context/AppContext"
import { useChatRoom } from "@/context/ChatContext"
import { useFileSystem } from "@/context/FileContext"
import { useSocket } from "@/context/SocketContext"
import useFullScreen from "@/hooks/useFullScreen"
import useUserActivity from "@/hooks/useUserActivity"
import { FileSystemItem } from "@/types/file"
import { SocketEvent } from "@/types/socket"
import { USER_STATUS, User } from "@/types/user"

import UserState from "@/utils/UserState"
import { getInitialFileStructure, setInitialFileStructure } from "@/utils/file"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useLocation, useNavigate, useParams } from "react-router-dom"

function EditorPage() {
    // Listen user online/offline status
    useUserActivity()
    // Enable fullscreen mode
    useFullScreen()
    const { projectId } = useParams()
    const { status, setCurrentUser, setStatus } = useAppContext()
    const {setMessages} = useChatRoom()
    const [IsLoading, setIsLoading] = useState(false)
    const { setFileStructure, setOpenFiles, setActiveFile } = useFileSystem()
    const { socket } = useSocket()
    const location = useLocation()

    useEffect(() => {
        const user: User = {
            username: UserState.GetUserData().username,
            projectId,
        }
        setCurrentUser(user)

        socket.connect()
        setStatus(USER_STATUS.ATTEMPTING_JOIN)
        socket.emit(SocketEvent.JOIN_REQUEST, user)


        fetchFileStructure()
        fetchChats()
    }, [])

  useEffect(() => {
    const wasOnEditorPage = location.pathname.startsWith("/editor/");
    return () => {
        if (wasOnEditorPage && !location.pathname.startsWith("/editor/")) {
            console.log("Disconnected");
            socket.disconnect();
            setStatus(USER_STATUS.DISCONNECTED);
        }
    };
}, [location.pathname]);

    const fetchFileStructure = async () => {
        setIsLoading(true)
        try {
            const res = await api.get(`/fileStructure/${projectId}`)
            if (res.data?.fileStructure) {
                initializeStructure(res.data.fileStructure)
            } else {
                initializeStructure(getInitialFileStructure())
            }
          
        } catch (err) {
            console.error("Failed to fetch:", err)
            initializeStructure(getInitialFileStructure())
        } finally {
            setIsLoading(false)
        }
    }

    const fetchChats=async()=>{
         setIsLoading(true)
        try{
            const res = await api.get(`/chat/${projectId}`)
            if(res.data.chats.length > 0){
                setMessages(res.data.chats)
            }
            
        }
        catch (err) {
            console.error("Failed to fetch:", err)
           
        } finally {
            setIsLoading(false)
        }
    }

    const initializeStructure = (structure: FileSystemItem) => {
        setFileStructure(structure)
        const initialOpenFiles = structure.children ?? []
        setOpenFiles(initialOpenFiles)
        setActiveFile(initialOpenFiles[0] ?? null)
    }
   

    if (status === USER_STATUS.CONNECTION_FAILED) {
        return <ConnectionStatusPage />
    }

    if (IsLoading) {
        return <Loader />
    }

    return (
        <SplitterComponent>
            <Sidebar />
            <WorkSpace />
        </SplitterComponent>
    )
}

export default EditorPage
