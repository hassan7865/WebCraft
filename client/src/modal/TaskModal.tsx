import React, { useState } from "react"
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react"
import { useForm, Controller } from "react-hook-form"
import {
    FiX,
    FiUser,
    FiCalendar,
    FiTag,
    FiFlag,
    FiClipboard,
    FiPlus,
    FiLoader,
    FiChevronDown,
} from "react-icons/fi"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import api from "@/api/serverapi"
import { Task } from "@/types/task"
import toast from "react-hot-toast"
import Avatar from "react-avatar"
import UserState from "@/utils/UserState"

export interface TaskFormData {
    title: string
    status: "todo" | "inprogress" | "review" | "done"
    summary: string
    priority: "Low" | "Normal" | "High" | "Critical"
    assignees: string[] // Changed from assignee to assignees array
    reporter: string
    dueDate?: Date | null
    tags?: string[]
    progress?: number
}

interface TaskFormDialogProps {
    isOpen: boolean
    onClose: () => void
    task?: Task | null
    mode: "create" | "edit"
    teamMembers: { _id: string; username: string }[]
    projectId: string
    reloadTasks: () => Promise<void>
}

const TaskFormDialog: React.FC<TaskFormDialogProps> = ({
    isOpen,
    onClose,
    task,
    mode,
    teamMembers,
    projectId,
    reloadTasks,
}) => {
    const [newTag, setNewTag] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isAssigneeDropdownOpen, setIsAssigneeDropdownOpen] = useState(false)

    const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        setValue,
        formState: { errors, isLoading },
    } = useForm<TaskFormData>({
        defaultValues: {
            title: task?.title || "",
            status: task?.status || "todo",
            summary: task?.summary || "",
            priority: task?.priority || "Normal",
            assignees: task?.assignees?.map(a => typeof a === 'string' ? a : a._id) || [],
            dueDate: task?.dueDate ? new Date(task.dueDate) : null,
            tags: task?.tags || [],
            progress: task?.progress || 0,
        },
    })

    // Watch progress, tags, and assignees for dynamic updates
    const progress = watch("progress")
    const tags = watch("tags") || []
    const assignees = watch("assignees") || []

    // Reset form when task changes
    React.useEffect(() => {
        if (task && mode === "edit") {
            reset({
                title: task.title,
                status: task.status,
                summary: task.summary,
                priority: task.priority,
                assignees: task.assignees?.map(a => typeof a === 'string' ? a : a._id) || [],
                dueDate: task.dueDate ? new Date(task.dueDate) : null,
                tags: task.tags || [],
                progress: task.progress || 0,
            })
        } else if (mode === "create") {
            reset({
                title: "",
                status: "todo",
                summary: "",
                priority: "Normal",
                assignees: [],
                dueDate: null,
                tags: [],
                progress: 0,
            })
        }
    }, [task, mode, reset])

    const handleFormSubmit = async (data: TaskFormData) => {
        setIsSubmitting(true)

        try {
            const payload = {
                ...data,
                project: projectId,
                _id: mode === "edit" ? task._id : 0,
                reporter: UserState.GetUserData()._id,
            }

            await api.post("/task/save", payload)
            toast.success("Task Saved Successfully")
            reloadTasks().then(() => {
                onClose()
            })
        } catch (error) {
            console.error("Form submission error:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const addTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            const updatedTags = [...tags, newTag.trim()]
            setValue("tags", updatedTags)
            setNewTag("")
        }
    }

    const removeTag = (tagToRemove: string) => {
        const updatedTags = tags.filter((tag) => tag !== tagToRemove)
        setValue("tags", updatedTags)
    }

    const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault()
            addTag()
        }
    }

    // Assignee handling functions
    const toggleAssignee = (memberId: string) => {
        const currentAssignees = assignees || []
        const isAssigned = currentAssignees.includes(memberId)
        
        if (isAssigned) {
            setValue("assignees", currentAssignees.filter(id => id !== memberId))
        } else {
            setValue("assignees", [...currentAssignees, memberId])
        }
    }

    const removeAssignee = (memberId: string) => {
        setValue("assignees", assignees.filter(id => id !== memberId))
    }

    const getAssignedMembers = () => {
        return teamMembers.filter(member => assignees.includes(member._id))
    }

    const getUnassignedMembers = () => {
        return teamMembers.filter(member => !assignees.includes(member._id))
    }

    const statusOptions = [
        { value: "todo", label: "To Do", color: "text-gray-500" },
        { value: "inprogress", label: "In Progress", color: "text-blue-500" },
        { value: "review", label: "Review", color: "text-purple-500" },
        { value: "done", label: "Done", color: "text-green-500" },
    ]

    const priorityOptions = [
        { value: "Low", label: "Low", color: "text-gray-500" },
        { value: "Normal", label: "Normal", color: "text-blue-500" },
        { value: "High", label: "High", color: "text-orange-500" },
        { value: "Critical", label: "Critical", color: "text-red-500" },
    ]

    return (
        <Dialog
            open={isOpen}
            onClose={isSubmitting ? () => {} : onClose}
            className="relative z-50"
        >
            <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                    <div className="sticky top-0 rounded-t-2xl border-b border-gray-100 bg-white px-6 py-4">
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-xl font-semibold text-gray-900">
                                {mode === "create"
                                    ? "Create New Task"
                                    : "Edit Task"}
                            </DialogTitle>
                            <button
                                onClick={isSubmitting ? undefined : onClose}
                                disabled={isSubmitting}
                                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-[#f5f5f5] hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <FiX className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit(handleFormSubmit)}
                        className="space-y-6 p-6"
                    >
                        {/* Task Title */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Task Title *
                            </label>
                            <input
                                {...register("title", {
                                    required: "Task title is required",
                                    maxLength: {
                                        value: 100,
                                        message:
                                            "Title must be less than 100 characters",
                                    },
                                })}
                                type="text"
                                placeholder="Enter task title"
                                disabled={isSubmitting}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-[#00B8E9] disabled:cursor-not-allowed disabled:bg-gray-100"
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.title.message}
                                </p>
                            )}
                        </div>

                        {/* Summary */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Summary
                            </label>
                            <textarea
                                {...register("summary", {
                                    maxLength: {
                                        value: 500,
                                        message:
                                            "Summary must be less than 500 characters",
                                    },
                                })}
                                rows={3}
                                placeholder="Describe the task..."
                                disabled={isSubmitting}
                                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-[#00B8E9] disabled:cursor-not-allowed disabled:bg-gray-100"
                            />
                            {errors.summary && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.summary.message}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Status */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Status *
                                </label>
                                <Controller
                                    name="status"
                                    control={control}
                                    rules={{ required: "Status is required" }}
                                    render={({ field }) => (
                                        <>
                                            <select
                                                {...field}
                                                disabled={isSubmitting}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-[#00B8E9] disabled:cursor-not-allowed disabled:bg-gray-100"
                                            >
                                                {statusOptions.map((option) => (
                                                    <option
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.status && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.status.message}
                                                </p>
                                            )}
                                        </>
                                    )}
                                />
                            </div>

                            {/* Priority */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Priority *
                                </label>
                                <Controller
                                    name="priority"
                                    control={control}
                                    rules={{ required: "Priority is required" }}
                                    render={({ field }) => (
                                        <>
                                            <select
                                                {...field}
                                                disabled={isSubmitting}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-[#00B8E9] disabled:cursor-not-allowed disabled:bg-gray-100"
                                            >
                                                {priorityOptions.map(
                                                    (option) => (
                                                        <option
                                                            key={option.value}
                                                            value={option.value}
                                                        >
                                                            {option.label}
                                                        </option>
                                                    ),
                                                )}
                                            </select>
                                            {errors.priority && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.priority.message}
                                                </p>
                                            )}
                                        </>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Multiple Assignees */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Assignees ({assignees.length} selected)
                            </label>

                            {/* Selected assignees display */}
                            {assignees.length > 0 && (
                                <div className="mb-3 flex flex-wrap gap-2">
                                    {getAssignedMembers().map((member) => (
                                        <span
                                            key={member._id}
                                            className="inline-flex items-center rounded-full border border-[#00B8E9]/20 bg-[#00B8E9]/10 px-3 py-1 text-sm text-[#00B8E9]"
                                        >
                                            <Avatar
                                                size="20"
                                                textSizeRatio={2.5}
                                                round
                                                name={member.username}
                                                className="mr-2"
                                            />
                                            {member.username}
                                            <button
                                                type="button"
                                                onClick={() => removeAssignee(member._id)}
                                                disabled={isSubmitting}
                                                className="ml-2 text-[#00B8E9] hover:text-[#0099c7] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <FiX className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Assignee dropdown */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setIsAssigneeDropdownOpen(!isAssigneeDropdownOpen)}
                                    disabled={isSubmitting}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-left transition-colors focus:border-transparent focus:ring-2 focus:ring-[#00B8E9] disabled:cursor-not-allowed disabled:bg-gray-100 flex items-center justify-between"
                                >
                                    <div className="flex items-center">
                                        <FiUser className="mr-2 text-gray-400" />
                                        <span className="text-gray-500">
                                            {assignees.length === 0 
                                                ? "Select assignees..." 
                                                : `${assignees.length} member${assignees.length !== 1 ? 's' : ''} selected`
                                            }
                                        </span>
                                    </div>
                                    <FiChevronDown 
                                        className={`h-4 w-4 text-gray-400 transition-transform ${
                                            isAssigneeDropdownOpen ? 'rotate-180' : ''
                                        }`} 
                                    />
                                </button>

                                {isAssigneeDropdownOpen && (
                                    <div className="absolute z-[50] mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg max-h-60 overflow-y-auto">
                                        {teamMembers.length === 0 ? (
                                            <div className="px-4 py-3 text-sm text-gray-500">
                                                No team members available
                                            </div>
                                        ) : (
                                            teamMembers.map((member) => {
                                                const isSelected = assignees.includes(member._id)
                                                return (
                                                    <button
                                                        key={member._id}
                                                        type="button"
                                                        onClick={() => toggleAssignee(member._id)}
                                                        disabled={isSubmitting}
                                                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-between ${
                                                            isSelected ? 'bg-[#00B8E9]/5 text-[#00B8E9]' : 'text-gray-700'
                                                        }`}
                                                    >
                                                        <div className="flex items-center">
                                                            <Avatar
                                                                size="24"
                                                                textSizeRatio={2.5}
                                                                round
                                                                name={member.username}
                                                                className="mr-3"
                                                            />
                                                            <span className="text-sm">
                                                                {member.username}
                                                            </span>
                                                        </div>
                                                        {isSelected && (
                                                            <div className="w-4 h-4 bg-[#00B8E9] rounded-full flex items-center justify-center">
                                                                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </button>
                                                )
                                            })
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Click outside handler */}
                            {isAssigneeDropdownOpen && (
                                <div 
                                    className="fixed inset-0 z-0" 
                                    onClick={() => setIsAssigneeDropdownOpen(false)}
                                />
                            )}
                        </div>

                        {/* Due Date */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Due Date
                            </label>
                            <div className="relative">
                                <FiCalendar className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-gray-400" />
                                <Controller
                                    name="dueDate"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            selected={field.value}
                                            onChange={(date: Date | null) =>
                                                field.onChange(date)
                                            }
                                            placeholderText="Select due date"
                                            disabled={isSubmitting}
                                            className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 transition-colors focus:border-transparent focus:ring-2 focus:ring-[#00B8E9] disabled:cursor-not-allowed disabled:bg-gray-100"
                                            isClearable
                                            dateFormat="MMMM d, yyyy"
                                            minDate={new Date()}
                                            popperClassName="react-datepicker-popper"
                                            wrapperClassName="w-full"
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Tags
                            </label>

                            {/* Tag chips display */}
                            {tags.length > 0 && (
                                <div className="mb-3 flex flex-wrap gap-2">
                                    {tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center rounded-full border border-[#00B8E9]/20 bg-[#00B8E9]/10 px-3 py-1 text-sm text-[#00B8E9]"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                disabled={isSubmitting}
                                                className="ml-2 text-[#00B8E9] hover:text-[#0099c7] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <FiX className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Tag input */}
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
                                    <input
                                        type="text"
                                        value={newTag}
                                        onChange={(e) =>
                                            setNewTag(e.target.value)
                                        }
                                        onKeyPress={handleTagInputKeyPress}
                                        placeholder="Enter a tag"
                                        disabled={isSubmitting}
                                        className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 transition-colors focus:border-transparent focus:ring-2 focus:ring-[#00B8E9] disabled:cursor-not-allowed disabled:bg-gray-100"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={addTag}
                                    disabled={
                                        isSubmitting ||
                                        !newTag.trim() ||
                                        tags.includes(newTag.trim())
                                    }
                                    className="rounded-lg bg-[#00B8E9] px-4 py-3 text-white transition-colors hover:bg-[#0099c7] focus:outline-none focus:ring-2 focus:ring-[#00B8E9] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <FiPlus className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Progress */}
                        {mode === "edit" && (
                            <>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Progress ({progress || 0}%)
                                    </label>
                                    <div className="relative">
                                        <Controller
                                            name="progress"
                                            control={control}
                                            render={({ field }) => (
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    step="5"
                                                    value={field.value || 0}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            parseInt(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                    disabled={isSubmitting}
                                                    className="slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                                                    style={{
                                                        background: `linear-gradient(to right, #00B8E9 0%, #00B8E9 ${field.value || 0}%, #e5e7eb ${field.value || 0}%, #e5e7eb 100%)`,
                                                    }}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Reporter
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <Avatar
                                            size="32"
                                            textSizeRatio={2}
                                            round
                                            name={
                                                task?.reporter?.username ||
                                                "User"
                                            }
                                        />
                                        <span>
                                            {task?.reporter?.username ||
                                                "Unknown"}
                                        </span>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Form Actions */}
                        <div className="flex items-center justify-end space-x-3 border-t border-gray-100 pt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-[#00B8E9] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center justify-center rounded-lg bg-[#00B8E9] px-6 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-[#0099c7] focus:outline-none focus:ring-2 focus:ring-[#00B8E9] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <FiLoader className="mr-2 h-4 w-4 animate-spin" />
                                        {mode === "create"
                                            ? "Creating..."
                                            : "Updating..."}
                                    </>
                                ) : mode === "create" ? (
                                    "Create Task"
                                ) : (
                                    "Update Task"
                                )}
                            </button>
                        </div>
                    </form>
                </DialogPanel>
            </div>
        </Dialog>
    )
}

export default TaskFormDialog