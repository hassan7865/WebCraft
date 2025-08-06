// User interface for consistency
export interface User {
    _id: string
    username: string
}

// Main Task interface
export interface Task {
    _id?: string
    title: string
    status: "todo" | "inprogress" | "review" | "done"
    summary: string
    priority: "Low" | "Normal" | "High" | "Critical"
    assignees?: User[] // Made optional with default empty array
    reporter: User
    dueDate?: Date | null
    tags?: string[]
    progress?: number
    project?: string // You might want this for the project reference
    createdAt?: Date
    updatedAt?: Date
}

