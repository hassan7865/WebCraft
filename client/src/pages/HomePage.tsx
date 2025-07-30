import api from "@/api/serverapi"
import { showConfirmationToast } from "@/components/confirmation/showConfirmationDialog"
import Loader from "@/components/loader/loaderComponent"
import ProjectCard from "@/components/project/projectCard"
import ProjectFormDialog, { ProjectFormData } from "@/modal/ProjectModal"
import { avatarList } from "@/resources/data"
import { Project } from "@/types/project"
import UserState from "@/utils/UserState"
import React, { useState, useMemo, useEffect } from "react"
import toast from "react-hot-toast"
import {
    FiPlus,
    FiSearch,
    FiFilter,
    FiGrid,
    FiList,
    FiClock,
    FiTrendingUp,
} from "react-icons/fi"
import { useNavigate } from "react-router-dom"

const Home: React.FC = () => {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const [mode, setMode] = React.useState<"create" | "edit">("create")
    const [IsLoading, setIsLoading] = useState(false)
    const [editingProject, setEditingProject] = React.useState<Project | null>(
        null,
    )
    const [projects, setProjects] = useState<Project[]>([])
    const [stats, setStats] = useState({
        totalProjects: 0,
        doneProjects: 0,
        activeProjects: 0,
        averageProgress: 0,
    })
    const navigate = useNavigate()

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const userId = UserState.GetUserData()._id

            const [projectRes, statRes] = await Promise.all([
                api.get(`/project/list?userId=${userId}`),
                api.get(`/project/stats?userId=${userId}`),
            ])

            setProjects(projectRes.data.projects)
            setStats(statRes.data)
        } catch (error) {
            console.error("Error fetching data", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState<
        "all" | "active" | "completed" | "on-hold"
    >("all")
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

    const filteredProjects = useMemo(() => {
        return projects.filter((project) => {
            const matchesSearch =
                project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.createdBy.username
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            const matchesStatus =
                filterStatus === "all" || project.status === filterStatus

            return matchesSearch && matchesStatus
        })
    }, [projects, searchTerm, filterStatus])

    const handleProjectClick = (projectId: string) => {
        navigate(`/project/${projectId}`)
    }



    const handleCreateProject = () => {
        setMode("create")
        setEditingProject(null)
        setIsDialogOpen(true)
    }

    const handleEditProject = (project:Project) => {
        setMode("edit")
        setEditingProject(project)
        setIsDialogOpen(true)
    }

     const handleDelete = async (project: Project) => {
            const isConfirmed = await showConfirmationToast({
                title: "Delete Confirmation",
                message: `Are you sure you want to delete this project This action cannot be undone.`,
                variant: "danger",
                confirmText: "Yes, Delete",
                cancelText: "Cancel",
            })
    
            if (!isConfirmed) return
    
          
            const toastId = toast.loading(`Deleting Project...`)
    
            try {
                await api.delete(`/project/${project._id}`)
                toast.success(`Project deleted successfully`)
                fetchData()
            } catch (error) {
            } finally {
              
                toast.dismiss(toastId)
            }
        }

    const handleSubmit = async (data: ProjectFormData) => {
        try {
            let _id = null
            const avatarUrl =
                avatarList[Math.floor(Math.random() * avatarList.length)]
            if (mode == "edit") {
                _id = editingProject._id
            }
            await api.post("/project/save", {
                ...data,
                createdBy: UserState.GetUserData()._id,
                avatarUrl: avatarUrl.imgUrl,
                _id,
            })
            toast.success("Project Saved Successfully")
            fetchData()
            setIsDialogOpen(false)
        } catch {
            // Error handling
        } finally {
            // Cleanup
        }
    }

    return (
        <>
            {IsLoading ? (
                <Loader />
            ) : (
                <div
                    className="min-h-screen"
                    style={{ backgroundColor: "#f5f5f5" }}
                >
                    {/* Header Section */}
                    <div className="border-b border-gray-200 bg-white">
                        <div className="mx-auto px-4 py-6 sm:px-6 lg:px-8 xl:max-w-7xl">
                            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center sm:gap-0">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                        Projects
                                    </h1>
                                    <p className="mt-1 text-sm text-gray-600 sm:text-base">
                                        Manage and track your project portfolio
                                    </p>
                                </div>
                                <button
                                    onClick={handleCreateProject}
                                    className="flex w-full transform items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl sm:w-auto sm:gap-3 sm:px-6 sm:py-3 sm:text-base"
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
                                    <FiPlus className="h-4 w-4 sm:h-5 sm:w-5" />
                                    New Project
                                </button>
                            </div>

                            {/* Stats Cards */}
                            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
                                <div
                                    className="rounded-xl border bg-gradient-to-br from-cyan-50 to-cyan-100 p-4 sm:p-6"
                                    style={{ borderColor: "#00B8E9" + "33" }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p
                                                className="text-xs font-medium sm:text-sm"
                                                style={{ color: "#00B8E9" }}
                                            >
                                                Total Projects
                                            </p>
                                            <p className="text-xl font-bold text-gray-900 sm:text-2xl">
                                                {stats.totalProjects}
                                            </p>
                                        </div>
                                        <div
                                            className="flex h-10 w-10 items-center justify-center rounded-xl sm:h-12 sm:w-12"
                                            style={{
                                                backgroundColor: "#00B8E9",
                                            }}
                                        >
                                            <FiGrid className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-medium text-green-600 sm:text-sm">
                                                Completed
                                            </p>
                                            <p className="text-xl font-bold text-green-900 sm:text-2xl">
                                                {stats.doneProjects}
                                            </p>
                                        </div>
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500 sm:h-12 sm:w-12">
                                            <FiTrendingUp className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-4 sm:p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-medium text-orange-600 sm:text-sm">
                                                Active
                                            </p>
                                            <p className="text-xl font-bold text-orange-900 sm:text-2xl">
                                                {stats.activeProjects}
                                            </p>
                                        </div>
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 sm:h-12 sm:w-12">
                                            <FiClock className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-4 sm:p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-medium text-purple-600 sm:text-sm">
                                                Avg Progress
                                            </p>
                                            <p className="text-xl font-bold text-purple-900 sm:text-2xl">
                                                {stats.averageProgress}%
                                            </p>
                                        </div>
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500 sm:h-12 sm:w-12">
                                            <FiTrendingUp className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Filters and Controls */}
                            <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
                                <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                                    <div className="relative flex-1">
                                        <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400 sm:h-5 sm:w-5" />
                                        <input
                                            type="text"
                                            placeholder="Search projects..."
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                            className="w-full rounded-xl border border-gray-300 py-2 pl-9 pr-4 text-sm transition-all duration-200 focus:border-transparent focus:ring-2 sm:py-3 sm:pl-10 sm:text-base"
                                            onFocus={(e) => {
                                                e.target.style.outline = "none"
                                                e.target.style.borderColor =
                                                    "transparent"
                                                e.target.style.boxShadow = `0 0 0 2px #00B8E9`
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.boxShadow =
                                                    "none"
                                                e.target.style.borderColor =
                                                    "#d1d5db"
                                            }}
                                        />
                                    </div>

                                    <div className="relative flex-1 sm:flex-none">
                                        <select
                                            value={filterStatus}
                                            onChange={(e) =>
                                                setFilterStatus(
                                                    e.target.value as any,
                                                )
                                            }
                                            className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-2 pr-8 text-sm text-black transition-all duration-200 focus:border-transparent focus:ring-2 sm:py-3 sm:text-base"
                                            onFocus={(e) => {
                                                e.target.style.outline = "none"
                                                e.target.style.borderColor =
                                                    "transparent"
                                                e.target.style.boxShadow = `0 0 0 2px #00B8E9`
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.boxShadow =
                                                    "none"
                                                e.target.style.borderColor =
                                                    "#d1d5db"
                                            }}
                                        >
                                            <option value="all">
                                                All Status
                                            </option>
                                            <option value="active">
                                                Active
                                            </option>
                                            <option value="completed">
                                                Completed
                                            </option>
                                            <option value="on-hold">
                                                On Hold
                                            </option>
                                        </select>
                                        <FiFilter className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400 sm:h-5 sm:w-5" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between rounded-xl bg-gray-100 p-1">
                                    <button
                                        onClick={() => setViewMode("grid")}
                                        className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition-all duration-200 sm:gap-2 sm:px-3 sm:py-2 sm:text-sm ${
                                            viewMode === "grid"
                                                ? "bg-white shadow-sm"
                                                : "text-gray-600 hover:text-gray-900"
                                        }`}
                                        style={
                                            viewMode === "grid"
                                                ? { color: "#00B8E9" }
                                                : {}
                                        }
                                    >
                                        <FiGrid className="h-3 w-3 sm:h-4 sm:w-4" />
                                        <span>Grid</span>
                                    </button>
                                    <button
                                        onClick={() => setViewMode("list")}
                                        className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition-all duration-200 sm:gap-2 sm:px-3 sm:py-2 sm:text-sm ${
                                            viewMode === "list"
                                                ? "bg-white shadow-sm"
                                                : "text-gray-600 hover:text-gray-900"
                                        }`}
                                        style={
                                            viewMode === "list"
                                                ? { color: "#00B8E9" }
                                                : {}
                                        }
                                    >
                                        <FiList className="h-3 w-3 sm:h-4 sm:w-4" />
                                        <span>List</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Projects Section */}
                    <div className="mx-auto px-4 py-6 sm:px-6 lg:px-8 xl:max-w-7xl">
                        {filteredProjects.length > 0 ? (
                            <div
                                className={
                                    viewMode === "grid"
                                        ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                                        : "space-y-4"
                                }
                            >
                                {filteredProjects.map((project) => (
                                    <ProjectCard
                                        key={project._id}
                                        project={project}
                                        onProjectClick={handleProjectClick}
                                        onEdit={handleEditProject}
                                        onDelete={handleDelete}
                                        viewMode={viewMode}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center sm:py-16">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 sm:mb-6 sm:h-24 sm:w-24">
                                    <FiGrid className="h-8 w-8 text-gray-400 sm:h-12 sm:w-12" />
                                </div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-900 sm:mb-2 sm:text-xl">
                                    {searchTerm || filterStatus !== "all"
                                        ? "No projects found"
                                        : "No projects yet"}
                                </h3>
                                <p className="mx-auto mb-6 max-w-sm text-sm text-gray-600 sm:mb-8 sm:text-base">
                                    {searchTerm || filterStatus !== "all"
                                        ? "Try adjusting your search or filters to find what you're looking for."
                                        : "Get started by creating your first project and begin collaborating with your team."}
                                </p>
                                <button
                                    onClick={handleCreateProject}
                                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:shadow-xl sm:gap-3 sm:px-6 sm:py-3 sm:text-base"
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
                                    <FiPlus className="h-4 w-4 sm:h-5 sm:w-5" />
                                    Create Project
                                </button>
                            </div>
                        )}
                    </div>

                    <ProjectFormDialog
                        isOpen={isDialogOpen}
                        onClose={() => setIsDialogOpen(false)}
                        onSubmit={handleSubmit}
                        project={editingProject}
                        mode={mode}
                    />
                </div>
            )}
        </>
    )
}

export default Home