import { useEffect, useState } from 'react';
import Layout from '../../components/Layout.jsx';
import { getUsers, updateUserStatus } from '../../services/userService.js';
import { useSocket } from '../../hooks/useSocket.js';
import { useToast } from '../../context/ToastContext.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import { formatDate } from '../../utils/dateFormatter.js';
import { exportToCSV, exportToPDF } from '../../utils/exportUtils.js';
import { getAvatarInitials, getAvatarColor } from '../../utils/avatarUtils.js';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, userId: null, currentStatus: null });
  const { showToast } = useToast();

  const socket = useSocket();

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('user_connected', () => {
        loadUsers();
      });

      socket.on('user_disconnected', () => {
        loadUsers();
      });

      return () => {
        socket.off('user_connected');
        socket.off('user_disconnected');
      };
    }
  }, [socket]);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data.users);
      setFilteredUsers(data.users);
    } catch (error) {
      console.error('Error loading users:', error);
      showToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const handleStatusChangeClick = (userId, currentStatus) => {
    setConfirmDialog({
      isOpen: true,
      userId,
      currentStatus,
    });
  };

  const handleStatusChange = async () => {
    const { userId, currentStatus } = confirmDialog;
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await updateUserStatus(userId, newStatus);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
      showToast(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`, 'success');
    } catch (error) {
      console.error('Error updating user status:', error);
      showToast('Failed to update user status', 'error');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
          <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Users Management</h1>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Total: {users.length} users
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => exportToCSV(filteredUsers, 'users')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Export CSV
            </button>
            <button
              onClick={async () => {
                try {
                  await exportToPDF(filteredUsers, 'users', 'Users Export');
                  showToast('Users exported to PDF successfully', 'success');
                } catch (error) {
                  showToast(error.message || 'PDF export failed', 'error');
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Export PDF
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    {searchTerm ? 'No users found matching your search' : 'No users found'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 ${getAvatarColor(user.name)} rounded-full flex items-center justify-center text-white font-semibold`}>
                        {getAvatarInitials(user.name)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                          {user.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-200">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-300 capitalize">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === 'active'
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300'
                          : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleStatusChangeClick(user.id, user.status)}
                      className={`px-3 py-1 rounded transition ${
                        user.status === 'active'
                          ? 'text-red-600 hover:bg-red-50'
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                    >
                      {user.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>

        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog({ isOpen: false, userId: null, currentStatus: null })}
          onConfirm={handleStatusChange}
          title="Confirm Status Change"
          message={`Are you sure you want to ${confirmDialog.currentStatus === 'active' ? 'deactivate' : 'activate'} this user?`}
          confirmText={confirmDialog.currentStatus === 'active' ? 'Deactivate' : 'Activate'}
          type="danger"
        />
      </div>
    </Layout>
  );
};

export default Users;

