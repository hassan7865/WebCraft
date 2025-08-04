import { Navigate, Outlet } from 'react-router-dom';
import UserState from '@/utils/UserState';

const PublicLayout = () => {
  const currentUser = UserState.GetUserData();

  
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  
  return <Outlet />;
};

export default PublicLayout;
