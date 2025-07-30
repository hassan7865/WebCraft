import { Task } from "@/types/task"
import Avatar from "react-avatar"
import { FiCalendar, FiUser, FiEdit, FiTrash2 } from "react-icons/fi"

const CardTemplate = (props: any) => {
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "Critical":
                return "#ef4444"
            case "High":
                return "#f97316"
            case "Normal":
                return "#00B8E9"
            case "Low":
                return "#10b981"
            default:
                return "#6b7280"
        }
    }

    const task = props.task as Task
    const onEdit = props.onEdit
    const onDelete = props.onDelete

    return (
        <div className="kanban-card m-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
            <div className="mb-3 flex items-start justify-between">
                <div className="flex-1">
                    <h4 className="mb-1 text-sm font-semibold leading-tight text-gray-900">
                        {task.title}
                    </h4>
                    <p className="line-clamp-2 text-xs text-gray-600">
                        {task.summary}
                    </p>
                </div>
                <div
                    className="ml-2 mt-1 h-2 w-2 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: getPriorityColor(task.priority) }}
                />
            </div>

            {task.progress !== undefined && task.progress > 0 && (
                <div className="mb-3">
                    <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs text-gray-500">Progress</span>
                        <span className="text-xs font-medium text-gray-700">
                            {task.progress}%
                        </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-gray-200">
                        <div
                            className="h-1.5 rounded-full transition-all duration-300"
                            style={{
                                width: `${task.progress}%`,
                                backgroundColor: "#00B8E9",
                            }}
                        />
                    </div>
                </div>
            )}

            {task.tags && task.tags.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-1">
                    {task.tags.slice(0, 2).map((tag, index) => (
                        <span
                            key={index}
                            className="rounded-full px-2 py-1 text-xs font-medium"
                            style={{
                                backgroundColor: "#00B8E9" + "20",
                                color: "#00B8E9",
                            }}
                        >
                            {tag}
                        </span>
                    ))}
                    {task.tags.length > 2 && (
                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500">
                            +{task.tags.length - 2}
                        </span>
                    )}
                </div>
            )}

            <div className="mb-3 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                    {task.assignee ? (
                        <>
                            <Avatar
                                size="32"
                                textSizeRatio={2}
                                round
                                name={task.assignee?.username || "User"}
                            />
                            <span>{task.assignee.username}</span>
                        </>
                    ) : (
                        <>
                            <FiUser className="h-4 w-4" />
                            <span>Unassigned</span>
                        </>
                    )}
                </div>

                {task.dueDate && (
                    <div className="flex items-center gap-1">
                        <FiCalendar className="h-3 w-3" />
                        <span>
                            {new Date(task.dueDate).toLocaleDateString(
                                "en-US",
                                {
                                    month: "short",
                                    day: "numeric",
                                },
                            )}
                        </span>
                    </div>
                )}
            </div>

            {/* Improved Buttons Section */}
            <div className="mt-2 flex justify-end gap-2 border-t border-gray-100 pt-2">
                <button
                    onClick={() => onEdit && onEdit(task)}
                    className="flex items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition-all duration-200 hover:bg-blue-100 hover:text-blue-700"
                >
                    <FiEdit className="h-3.5 w-3.5" />
                    Edit
                </button>
                <button
                    onClick={() => onDelete && onDelete(task)}
                    className="flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-all duration-200 hover:bg-red-100 hover:text-red-700 hover:shadow-sm"
                >
                    <FiTrash2 className="h-3.5 w-3.5" />
                    Delete
                </button>
            </div>
        </div>
    )
}

export default CardTemplate
