export interface Project {
    _id: string
    name: string
    key: string
    avatarUrl?: string
    createdBy: {
        username: string
        email?: string
    }
    
    updatedAt: Date
    status: 'active' | 'completed' | 'on-hold'
    progress: number
    memberCount: number
    description?: string
    createdAt:Date
}
