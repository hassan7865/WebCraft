import Users from "@/components/common/Users"

import useResponsive from "@/hooks/useResponsive"


function UsersView() {
  
    const { viewHeight } = useResponsive()


  

    return (
        <div className="flex flex-col p-4" style={{ height: viewHeight }}>
            <h1 className="view-title">Users</h1>
            {/* List of connected users */}
            <Users />
            
        </div>
    )
}

export default UsersView
