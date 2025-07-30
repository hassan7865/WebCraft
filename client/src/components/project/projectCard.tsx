import { Project } from "@/types/project"
import moment from "moment"
import Avatar from "react-avatar"
import { FiClock, FiUsers, FiEdit2, FiTrash2 } from "react-icons/fi"

const ProjectCard: React.FC<{
    project: Project
    onProjectClick: (id: string) => void
    onEdit: (project:Project) => void
    onDelete: (project: Project) => void
    viewMode: 'grid' | 'list'
}> = ({ project, onProjectClick, onEdit, onDelete, viewMode }) => {
    const statusColors = {
        active: 'bg-green-100 text-green-800',
        completed: 'bg-[#E6F7FC] text-[#00B8E9]',
        'on-hold': 'bg-yellow-100 text-yellow-800'
    }

    if (viewMode === 'list') {
        return (
            <div className="group bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                        <div className="w-12 h-12 rounded-lg bg-[#00B8E9] flex items-center justify-center text-white font-bold shadow-lg">
                            {project.avatarUrl ? (
                                <img src={project.avatarUrl} alt={project.name} className="w-full h-full rounded-lg object-cover" />
                            ) : (
                                project.key
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center space-x-2">
                                <h3
                                    className="font-semibold text-gray-900 group-hover:text-[#00B8E9] transition-colors cursor-pointer"
                                    onClick={() => onProjectClick(project._id)}
                                >
                                    {project.name}
                                </h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
                                    {project.status.replace('-', ' ')}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                                Created by {project.createdBy.username} • {moment(project.updatedAt).fromNow()}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-500 flex items-center space-x-1">
                            <FiUsers className="w-4 h-4" />
                            <span>{project.memberCount}</span>
                        </div>
                        <div className="w-20">
                            <div className="bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-[#00B8E9] h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${project.progress}%` }}
                                ></div>
                            </div>
                            <span className="text-xs text-gray-500 mt-1">{project.progress}%</span>
                        </div>

                        {/* Edit & Delete Buttons */}
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => onEdit(project)}
                                className="p-1 text-blue-600 hover:text-blue-800"
                                title="Edit"
                            >
                                <FiEdit2 />
                            </button>
                            <button
                                onClick={() => onDelete(project)}
                                className="p-1 text-red-600 hover:text-red-800"
                                title="Delete"
                            >
                                <FiTrash2 />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="group bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-[#00B8E9] flex items-center justify-center text-white font-bold shadow-lg">
                        {project.avatarUrl ? (
                            <img src={project.avatarUrl} alt={project.name} className="w-full h-full rounded-lg object-cover" />
                        ) : (
                            project.key
                        )}
                    </div>

                    {/* Edit & Delete Buttons */}
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => onEdit(project)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                            title="Edit"
                        >
                            <FiEdit2 />
                        </button>
                        <button
                            onClick={() => onDelete(project)}
                            className="p-1 text-red-600 hover:text-red-800"
                            title="Delete"
                        >
                            <FiTrash2 />
                        </button>
                    </div>
                </div>

                <div className="space-y-3">
                    <div>
                        <h3
                            className="font-semibold text-lg text-gray-900 group-hover:text-[#00B8E9] transition-colors cursor-pointer line-clamp-2"
                            onClick={() => onProjectClick(project._id)}
                        >
                            {project.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {project.description || "No description available"}
                        </p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <Avatar size="32" textSizeRatio={2} round name={project.createdBy?.username || "User"} />
                        <div className="flex items-center space-x-1">
                            <FiClock className="w-4 h-4" />
                            <span>{moment(project.updatedAt).fromNow()}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium text-gray-900">{project.progress}%</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-[#00B8E9] h-2 rounded-full transition-all duration-500"
                                style={{ width: `${project.progress}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                                <FiUsers className="w-4 h-4" />
                                <span>{project.memberCount} members</span>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
                                {project.status.replace('-', ' ')}
                            </span>
                        </div>

                        {/* Edit & Delete Buttons (Already added at top) */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjectCard
