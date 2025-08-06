import api from "@/api/serverapi"
import moment from "moment"
import { useState, useEffect } from "react"
import Avatar from "react-avatar"
import { FiClock, FiFile, FiLoader } from "react-icons/fi"
import { useParams } from "react-router-dom"
import DiffDialog from "../codeDifference/codeDiffComponent"

const FileEditHistoryComponent = ({ onClose }) => {
    const [historyData, setHistoryData] = useState([])
    const [showDiff, setshowDiff] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [selected, setselected] = useState(null)
    const { projectId } = useParams()

    const fetchData = async () => {
        try {
            console.log(projectId)
            setIsLoading(true)
            setError(null)
            const res = await api.get(`/fileStructure/history/${projectId}`)
            setHistoryData(res.data)
        } catch (err) {
            setError("Failed to load history data")
            console.error("Error fetching history:", err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [projectId])

    const handleSelect = (history: any) => {
        setselected(history)
        setshowDiff(true)
    }

    return (
        <>
            <div className="animate-in slide-in-from-top-2 absolute top-0 left-0 z-50 mt-2 max-h-96 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl duration-200">
                {/* Header */}
                <div className="border-b border-gray-100 px-4 py-3">
                    <div className="flex items-center justify-between">
                        <h3 className="flex items-center space-x-2 font-semibold text-gray-900">
                            <FiClock className="h-4 w-4" />
                            <span>File Edit History</span>
                        </h3>
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="text-gray-400 transition-colors hover:text-gray-600"
                            >
                                ×
                            </button>
                        )}
                    </div>
                </div>

                {/* History List */}
                <div className="max-h-80 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex h-40 items-center justify-center">
                            <FiLoader className="h-6 w-6 animate-spin text-gray-400" />
                        </div>
                    ) : error ? (
                        <div className="px-4 py-8 text-center">
                            <p className="text-sm text-red-500">{error}</p>
                            <button
                                onClick={fetchData}
                                className="mt-2 rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
                            >
                                Retry
                            </button>
                        </div>
                    ) : historyData && historyData.length > 0 ? (
                        <div className="py-2">
                            {historyData.map((item, index) => (
                                <div
                                    onClick={() => handleSelect(item)}
                                    key={item._id || index}
                                    className="group flex cursor-pointer items-start space-x-3 border-b border-gray-50 px-4 py-3 transition-colors last:border-b-0 hover:bg-gray-50"
                                >
                                    {/* Avatar */}
                                    <div className="relative flex-shrink-0">
                                        <Avatar
                                            size="36"
                                            textSizeRatio={2}
                                            round
                                            name={item.user.username || "User"}
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between">
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate font-medium text-gray-900">
                                                    {item.user.username ||
                                                        "Unknown User"}
                                                </p>
                                                <div className="mt-1 flex items-center space-x-1">
                                                    <FiFile className="h-3 w-3 text-gray-400" />
                                                    <p className="truncate text-sm text-gray-600">
                                                        {item.fileName}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="ml-2 flex-shrink-0 text-xs text-gray-500">
                                                {moment(
                                                    item.editedAt,
                                                ).fromNow()}
                                            </span>
                                        </div>

                                        {/* Optional: Show edit preview */}
                                        {item.previousContent &&
                                            item.newContent && (
                                                <div className="mt-2 text-xs text-gray-500">
                                                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-blue-700">
                                                        File edited
                                                    </span>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="px-4 py-8 text-center">
                            <FiClock className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                            <p className="text-sm text-gray-500">
                                No edit history found
                            </p>
                        </div>
                    )}
                </div>
            </div>
            {selected && (
                <DiffDialog
                    isOpen={showDiff}
                    onClose={() => setshowDiff(false)}
                    newCode={selected.newContent}
                    oldCode={selected.previousContent}
                />
            )}
        </>
    )
}

export default FileEditHistoryComponent
