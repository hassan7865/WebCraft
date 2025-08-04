import api from "@/api/serverapi"
import { showConfirmationToast } from "@/components/confirmation/showConfirmationDialog"
import Loader from "@/components/loader/loaderComponent"
import CardTemplate from "@/components/task/taskCardComponent"
import InviteUserDialog from "@/modal/InviteModal"
import TaskFormDialog from "@/modal/TaskModal"
import { Project } from "@/types/project"
import { Task } from "@/types/task"

import React, { useState, useMemo, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import toast from "react-hot-toast"
import {
    FiPlus,
    FiSearch,
    FiFilter,
    FiUser,
    FiCalendar,
    FiCheckCircle,
    FiClock,
    FiAlertCircle,
    FiBarChart2,
    FiGrid,
} from "react-icons/fi"
import { useNavigate, useParams } from "react-router-dom"

const statusColumns = [
    { id: "todo", title: "To Do" },
    { id: "inprogress", title: "In Progress" },
    { id: "review", title: "Review" },
    { id: "done", title: "Done" },
]

const KanbanBoard: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([])

    const [searchTerm, setSearchTerm] = useState("")
    const [filterPriority, setFilterPriority] = useState<string>("all")
    const [filterAssignee, setFilterAssignee] = useState<string>("all")
    const [showInvite, setshowInvite] = useState(false)
    const [showTaskDialog, setshowTaskDialog] = useState(false)
    const [mode, setmode] = useState<"create" | "edit">("create")
    const [project, setproject] = useState<Project>()
    const [assignees, setassignees] = useState([])
    const [Loading, setLoading] = useState(false)
    const [selectedTask, setselectedTask] = useState(null)
    const { projectId } = useParams()

    const fetchProject = async () => {
        try {
            setLoading(true)
            const res = await api.get(`/project/${projectId}`)
            setproject(res.data.project)
            setassignees(res.data.assignees)
        } catch {
        } finally {
            setLoading(false)
        }
    }

    const fetchTasks = async () => {
        try {
            setLoading(true)
            const res = await api.get(`/task/list/${projectId}`)
            setTasks(res.data)
        } catch {
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProject()
        fetchTasks()
    }, [])

    const navigate = useNavigate()

   console.log(tasks)
    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            const matchesSearch =
                task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.assignee.username
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())

            const matchesPriority =
                filterPriority === "all" || task.priority === filterPriority
            const matchesAssignee =
                filterAssignee === "all" ||
                task.assignee?.username === filterAssignee

            return matchesSearch && matchesPriority && matchesAssignee
        })
    }, [tasks, searchTerm, filterPriority, filterAssignee])

    // Group tasks by status
    const tasksByStatus = useMemo(() => {
        const grouped: Record<string, Task[]> = {
            todo: [],
            inprogress: [],
            review: [],
            done: [],
        }

        filteredTasks.forEach((task) => {
            grouped[task.status].push(task)
        })

        return grouped
    }, [filteredTasks])

    // Calculate stats
    const stats = useMemo(() => {
        const total = tasks.length
        const todo = tasks.filter((t) => t.status === "todo").length
        const inProgress = tasks.filter((t) => t.status === "inprogress").length
        const done = tasks.filter((t) => t.status === "done").length
        const avgProgress =
            tasks.reduce((sum, t) => sum + (t.progress || 0), 0) / total

        return {
            total,
            todo,
            inProgress,
            done,
            avgProgress: Math.round(avgProgress),
        }
    }, [tasks])

    const handleCreateTask = () => {
        setmode("create")
        setshowTaskDialog(true)
    }

    const handleWorkspaceClick = () => {
        navigate(`/editor/${projectId}`)
    }

    const handleEdit = (task: Task) => {
        setmode("edit")
        setselectedTask(task)
        setshowTaskDialog(true)
    }

    const handleDelete = async (task: Task) => {
        const isConfirmed = await showConfirmationToast({
            title: "Delete Confirmation",
            message: `Are you sure you want to delete this task This action cannot be undone.`,
            variant: "danger",
            confirmText: "Yes, Delete",
            cancelText: "Cancel",
        })

        if (!isConfirmed) return

        setLoading(true)
        const toastId = toast.loading(`Deleting task...`)

        try {
            await api.delete(`/task/${task._id}`)
            toast.success(`Task deleted successfully`)
            fetchTasks()
        } catch (error) {
        } finally {
            setLoading(false)
            toast.dismiss(toastId)
        }
    }

    const handleStatusChange = async (status: Task["status"], id: string) => {
        try {
            await api.patch(`/task/status`, { _id: id, status })
        } catch (error) {
            console.error("Failed to update task status:", error)
        }
    }

    const onDragEnd = (result: any) => {
        const { destination, source, draggableId } = result

        // Dropped outside the list
        if (!destination) return

        // Dropped in the same place
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return
        }

        // Find the task being dragged
        const task = tasks.find((t) => t._id === draggableId)
        if (!task) return

        // New status
        const newStatus = destination.droppableId as Task["status"]

        // Optimistically update UI
        const updatedTask = { ...task, status: newStatus }
        setTasks((prevTasks) =>
            prevTasks.map((t) => (t._id === draggableId ? updatedTask : t)),
        )

        // Persist the status change
        handleStatusChange(newStatus, draggableId)
    }

    const statusLabels: Record<string, { label: string; color: string }> = {
        todo: { label: "To Do", color: "bg-blue-100 text-blue-800" },
        inprogress: {
            label: "In Progress",
            color: "bg-yellow-100 text-yellow-800",
        },
        review: { label: "Review", color: "bg-purple-100 text-purple-800" },
        done: { label: "Done", color: "bg-green-100 text-green-800" },
    }

    if (Loading) {
        ;<Loader />
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: "#f5f5f5" }}>
            {/* Header Section */}
            <div className="border-b border-gray-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center sm:gap-0">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                {project?.name}
                            </h1>
                            <p className="mt-2 text-sm text-gray-600 sm:text-base">
                                Organize and track your tasks efficiently
                            </p>
                        </div>
                        <div className="flex w-full flex-wrap items-center justify-end gap-3 sm:w-auto">
                            <button
                                onClick={() => handleWorkspaceClick()}
                                className="flex items-center gap-2 rounded-xl bg-gray-200 px-4 py-2 font-medium text-gray-800 transition-all duration-200 hover:bg-gray-300 sm:px-5 sm:py-2.5"
                            >
                                <FiGrid className="h-5 w-5" />
                                <span className="hidden sm:inline">
                                    Workspace
                                </span>
                            </button>
                            <button
                                onClick={() => setshowInvite(true)}
                                className="flex items-center gap-2 rounded-xl px-4 py-2 font-medium text-white shadow-lg transition-all duration-200 hover:shadow-xl sm:px-5 sm:py-2.5"
                                style={{
                                    backgroundColor: "#00B8E9",
                                    background:
                                        "linear-gradient(135deg, #00B8E9 0%, #0099cc 100%)",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background =
                                        "linear-gradient(135deg, #0099cc 0%, #007aa3 100%)"
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background =
                                        "linear-gradient(135deg, #00B8E9 0%, #0099cc 100%)"
                                }}
                            >
                                <FiPlus className="h-5 w-5" />
                                <span className="hidden sm:inline">
                                    Add Members
                                </span>
                            </button>
                            <button
                                onClick={handleCreateTask}
                                className="flex items-center gap-2 rounded-xl px-4 py-2 font-medium text-white shadow-lg transition-all duration-200 hover:shadow-xl sm:px-5 sm:py-2.5"
                                style={{
                                    backgroundColor: "#00B8E9",
                                    background:
                                        "linear-gradient(135deg, #00B8E9 0%, #0099cc 100%)",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background =
                                        "linear-gradient(135deg, #0099cc 0%, #007aa3 100%)"
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background =
                                        "linear-gradient(135deg, #00B8E9 0%, #0099cc 100%)"
                                }}
                            >
                                <FiPlus className="h-5 w-5" />
                                <span className="hidden sm:inline">
                                    Create Task
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                        <div
                            className="rounded-xl border bg-gradient-to-br from-cyan-50 to-cyan-100 p-4 sm:p-6"
                            style={{ borderColor: "#00B8E9" + "33" }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p
                                        className="text-sm font-medium"
                                        style={{ color: "#00B8E9" }}
                                    >
                                        Total Tasks
                                    </p>
                                    <p className="text-xl font-bold text-gray-900 sm:text-2xl">
                                        {stats.total}
                                    </p>
                                </div>
                                <div
                                    className="flex h-10 w-10 items-center justify-center rounded-xl sm:h-12 sm:w-12"
                                    style={{ backgroundColor: "#00B8E9" }}
                                >
                                    <FiBarChart2 className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-600">
                                        In Progress
                                    </p>
                                    <p className="text-xl font-bold text-blue-900 sm:text-2xl">
                                        {stats.inProgress}
                                    </p>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 sm:h-12 sm:w-12">
                                    <FiClock className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-600">
                                        Completed
                                    </p>
                                    <p className="text-xl font-bold text-green-900 sm:text-2xl">
                                        {stats.done}
                                    </p>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500 sm:h-12 sm:w-12">
                                    <FiCheckCircle className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-purple-600">
                                        Avg Progress
                                    </p>
                                    <p className="text-xl font-bold text-purple-900 sm:text-2xl">
                                        {stats.avgProgress || 0}%
                                    </p>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500 sm:h-12 sm:w-12">
                                    <FiAlertCircle className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters and Controls */}
                    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <div className="flex w-full flex-col items-start gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
                            <div className="relative w-full sm:max-w-md sm:flex-1">
                                <FiSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search tasks..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full rounded-xl border border-gray-300 py-2 pl-10 pr-4 transition-all duration-200 focus:border-transparent focus:ring-2 sm:py-3"
                                    onFocus={(e) => {
                                        e.target.style.outline = "none"
                                        e.target.style.borderColor =
                                            "transparent"
                                        e.target.style.boxShadow = `0 0 0 2px #00B8E9`
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.boxShadow = "none"
                                        e.target.style.borderColor = "#d1d5db"
                                    }}
                                />
                            </div>

                            <div className="relative w-full sm:w-auto">
                                <select
                                    value={filterPriority}
                                    onChange={(e) =>
                                        setFilterPriority(e.target.value)
                                    }
                                    className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-2 pr-8 text-black transition-all duration-200 focus:border-transparent focus:ring-2 sm:py-3"
                                    onFocus={(e) => {
                                        e.target.style.outline = "none"
                                        e.target.style.borderColor =
                                            "transparent"
                                        e.target.style.boxShadow = `0 0 0 2px #00B8E9`
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.boxShadow = "none"
                                        e.target.style.borderColor = "#d1d5db"
                                    }}
                                >
                                    <option value="all">All Priorities</option>
                                    <option value="Critical">Critical</option>
                                    <option value="High">High</option>
                                    <option value="Normal">Normal</option>
                                    <option value="Low">Low</option>
                                </select>
                                <FiFilter className="pointer-events-none absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                            </div>

                            <div className="relative w-full sm:w-auto">
                                <select
                                    value={filterAssignee}
                                    onChange={(e) =>
                                        setFilterAssignee(e.target.value)
                                    }
                                    className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-2 pr-8 text-black transition-all duration-200 focus:border-transparent focus:ring-2 sm:py-3"
                                    onFocus={(e) => {
                                        e.target.style.outline = "none"
                                        e.target.style.borderColor =
                                            "transparent"
                                        e.target.style.boxShadow = `0 0 0 2px #00B8E9`
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.boxShadow = "none"
                                        e.target.style.borderColor = "#d1d5db"
                                    }}
                                >
                                    <option value="all">All Assignees</option>
                                    {assignees.map((assignee) => (
                                        <option
                                            key={assignee.username}
                                            value={assignee.username}
                                        >
                                            {assignee.username}
                                        </option>
                                    ))}
                                </select>
                                <FiUser className="pointer-events-none absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Kanban Board Section */}
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                    <DragDropContext onDragEnd={onDragEnd}>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {statusColumns.map((column) => (
                                <Droppable
                                    key={column.id}
                                    droppableId={column.id}
                                >
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className="rounded-lg bg-gray-50 p-3 sm:p-4"
                                        >
                                            <h3 className="mb-3 flex items-center gap-2 text-base font-semibold sm:mb-4 sm:text-lg">
                                                <span
                                                    className={`rounded px-2 py-1 text-xs font-medium sm:text-sm ${statusLabels[column.id]?.color}`}
                                                >
                                                    {statusLabels[column.id]
                                                        ?.label || column.title}
                                                </span>
                                            </h3>
                                            <div className="space-y-2">
                                                {tasksByStatus[column.id]?.map(
                                                    (task, index) => (
                                                        <Draggable
                                                            key={task._id}
                                                            draggableId={
                                                                task._id
                                                            }
                                                            index={index}
                                                        >
                                                            {(provided) => (
                                                                <div
                                                                    ref={
                                                                        provided.innerRef
                                                                    }
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                >
                                                                    <CardTemplate
                                                                        task={
                                                                            task
                                                                        }
                                                                        onEdit={
                                                                            handleEdit
                                                                        }
                                                                        onDelete={
                                                                            handleDelete
                                                                        }
                                                                    />
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ),
                                                )}
                                                {provided.placeholder}
                                            </div>
                                        </div>
                                    )}
                                </Droppable>
                            ))}
                        </div>
                    </DragDropContext>
                </div>
            </div>
            <InviteUserDialog
                isOpen={showInvite}
                onClose={() => setshowInvite(false)}
                projectId={projectId}
            />
            <TaskFormDialog
                isOpen={showTaskDialog}
                mode={mode}
                projectId={projectId}
                reloadTasks={fetchTasks}
                onClose={() => setshowTaskDialog(false)}
                teamMembers={assignees}
                task={mode == "edit" ? selectedTask : null}
            />
        </div>
    )
}

export default KanbanBoard
