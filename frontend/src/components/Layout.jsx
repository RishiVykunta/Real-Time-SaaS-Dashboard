import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path
      ? 'bg-primary-100 text-primary-700 border-r-4 border-primary-600'
      : 'text-gray-700 hover:bg-gray-100';
  };

  const getDashboardPath = () => {
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'manager') return '/manager';
    return '/profile';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-primary-600">SaaS Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Admin Portal</p>
        </div>

        <nav className="mt-6">
          <Link
            to={getDashboardPath()}
            className={`flex items-center px-6 py-3 ${isActive(getDashboardPath())}`}
          >
            <span className="mr-3">📊</span>
            Dashboard
          </Link>

          {user?.role === 'admin' && (
            <>
              <Link
                to="/admin/users"
                className={`flex items-center px-6 py-3 ${isActive('/admin/users')}`}
              >
                <span className="mr-3">👥</span>
                Users
              </Link>
              <Link
                to="/admin/activities"
                className={`flex items-center px-6 py-3 ${isActive('/admin/activities')}`}
              >
                <span className="mr-3">📝</span>
                Activities
              </Link>
            </>
          )}

          {user?.role === 'manager' && (
            <Link
              to="/manager/analytics"
              className={`flex items-center px-6 py-3 ${isActive('/manager/analytics')}`}
            >
              <span className="mr-3">📈</span>
              Analytics
            </Link>
          )}

          <Link
            to="/profile"
            className={`flex items-center px-6 py-3 ${isActive('/profile')}`}
          >
            <span className="mr-3">👤</span>
            Profile
          </Link>
        </nav>

        <div className="absolute bottom-0 w-64 p-6 border-t bg-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-gray-800">{user?.name}</p>
              <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

export default Layout;

