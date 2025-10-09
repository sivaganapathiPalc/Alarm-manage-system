import { useDispatch, useSelector } from 'react-redux';
import { LogOut, Lock } from 'lucide-react';
import { logout, selectUser } from './store/slices/authSlice';
import { MasterPage } from './pages/MasterPage';


export const Dashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const handleLogout = () => {
    dispatch(logout());
  };

  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return <MasterPage user={user} />;
      case 'operator':
        return <MasterPage user={user} />;
      case 'engineer':
        return <MasterPage user={user} />;
      case 'manager':
        return <MasterPage user={user} />;
      default:
        return <div>No dashboard available for this role.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Lock className="w-6 h-6 text-indigo-600" />
              <span className="text-xl font-bold text-gray-800">Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderDashboard()}
      </main>
    </div>
  );
};