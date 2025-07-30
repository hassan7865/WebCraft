export interface Task {
    _id?: string
    title: string
    status: "todo" | "inprogress" | "review" | "done"
    summary: string
    priority: "Low" | "Normal" | "High" | "Critical"
    assignee: {
        _id: string
        username: string
    }
    reporter: {
        _id: string
        username: string
    }
    dueDate?: Date | null
    tags?: string[]
    progress?: number
}
