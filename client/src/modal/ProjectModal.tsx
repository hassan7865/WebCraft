import React from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useForm, Controller } from 'react-hook-form'
import { FiX, FiUser, FiCalendar, FiUsers, FiTarget } from 'react-icons/fi'
import { Project } from '@/types/project'


export interface ProjectFormData {
  name: string
  description: string
  key: string
  status: 'active' | 'completed' | 'on-hold'
  avatarUrl: string
}

interface ProjectFormDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ProjectFormData) => void
  project?: Project | null
  mode: 'create' | 'edit'
}



const ProjectFormDialog: React.FC<ProjectFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  project,
  mode
}) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors, isLoading }
  } = useForm<ProjectFormData>({
    defaultValues: {
      name: project?.name || '',
      description: project?.description || '',
      key: project?.key || '',
      status: project?.status || 'active',
      avatarUrl: project?.avatarUrl 
    }
  })

  // Watch name to auto-generate key
  const watchedName = watch('name')
  React.useEffect(() => {
    if (mode === 'create' && watchedName) {
      const generatedKey = watchedName
        .toUpperCase()
        .replace(/[^A-Z0-9\s]/g, '')
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .substring(0, 4)
      
      if (generatedKey) {
        setValue('key', generatedKey)
      }
    }
  }, [watchedName, mode, setValue])

  // Reset form when project changes
  React.useEffect(() => {
    if (project && mode === 'edit') {
      reset({
        name: project.name,
        description: project.description || '',
        key: project.key,
        status: project.status,
        avatarUrl: project.avatarUrl 
      })
    } else if (mode === 'create') {
      reset({
        name: '',
        description: '',
        key: '',
        status: 'active',
        avatarUrl: ""
      })
    }
  }, [project, mode, reset])

  const handleFormSubmit = async (data: ProjectFormData) => {
    await onSubmit(data)
  }

  const statusOptions = [
    { value: 'active', label: 'Active', color: 'text-green-600' },
    { value: 'completed', label: 'Completed', color: 'text-[#00B8E9]' },
    { value: 'on-hold', label: 'On Hold', color: 'text-yellow-600' }
  ]


  return (
    <>
      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  {mode === 'create' ? 'Create New Project' : 'Edit Project'}
                </DialogTitle>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-[#f5f5f5] transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">

              {/* Project Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  {...register('name', { required: 'Project name is required' })}
                  type="text"
                  placeholder="Enter project name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8E9] focus:border-transparent transition-colors"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Project Key */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Key *
                </label>
                <input
                  {...register('key', { 
                    required: 'Project key is required',
                    maxLength: { value: 10, message: 'Key must be 10 characters or less' }
                  })}
                  type="text"
                  placeholder="PROJ"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8E9] focus:border-transparent transition-colors uppercase"
                  style={{ textTransform: 'uppercase' }}
                />
                {errors.key && (
                  <p className="mt-1 text-sm text-red-600">{errors.key.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  placeholder="Describe your project..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8E9] focus:border-transparent transition-colors resize-none"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B8E9] focus:border-transparent transition-colors"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-[#00B8E9] focus:ring-offset-2 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 text-sm font-medium text-white bg-[#00B8E9] rounded-lg hover:bg-[#0099c7] focus:outline-none focus:ring-2 focus:ring-[#00B8E9] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? 'Saving...' : (mode === 'create' ? 'Create Project' : 'Update Project')}
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    
    </>
  )
}

export default ProjectFormDialog