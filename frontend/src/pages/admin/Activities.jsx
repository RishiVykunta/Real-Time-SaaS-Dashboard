import { useEffect, useState } from 'react';
import Layout from '../../components/Layout.jsx';
import { getActivities } from '../../services/activityService.js';
import { useSocket } from '../../hooks/useSocket.js';
import { formatRelativeTime, formatDateTime } from '../../utils/dateFormatter.js';
import { exportToCSV } from '../../utils/exportUtils.js';
import { useToast } from '../../context/ToastContext.jsx';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [allActivities, setAllActivities] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [uniqueUsers, setUniqueUsers] = useState([]);
  const [uniqueActions, setUniqueActions] = useState([]);
  const [dateFilter, setDateFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const socket = useSocket();

  useEffect(() => {
    loadActivities();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      loadActivities(selectedUserId);
    } else {
      const filtered = filterActivities(allActivities);
      setActivities(filtered);
    }
  }, [selectedUserId, dateFilter, actionFilter]);

  useEffect(() => {
    if (socket) {
      socket.on('activity_created', (data) => {
        setAllActivities((prev) => {
          const updated = [data, ...prev];
          updateUniqueUsers(updated);
          return updated;
        });
        if (!selectedUserId || data.user_id === selectedUserId) {
          setActivities((prev) => [data, ...prev]);
        }
      });

      return () => {
        socket.off('activity_created');
      };
    }
  }, [socket, selectedUserId]);

  const updateUniqueUsers = (activitiesList) => {
    const usersMap = new Map();
    const actionsSet = new Set();
    
    activitiesList.forEach((activity) => {
      if (activity.user_id && !usersMap.has(activity.user_id)) {
        usersMap.set(activity.user_id, {
          id: activity.user_id,
          name: activity.user_name || 'Unknown',
          email: activity.user_email || '',
          role: activity.user_role || 'user',
        });
      }
      if (activity.action) {
        actionsSet.add(activity.action);
      }
    });
    
    setUniqueUsers(Array.from(usersMap.values()));
    setUniqueActions(Array.from(actionsSet));
  };

  const filterActivities = (activitiesList) => {
    let filtered = [...activitiesList];

    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        default:
          break;
      }
      
      filtered = filtered.filter(activity => {
        const activityDate = new Date(activity.timestamp);
        return activityDate >= filterDate;
      });
    }

    if (actionFilter !== 'all') {
      filtered = filtered.filter(activity => activity.action === actionFilter);
    }

    return filtered;
  };

  const loadActivities = async (userId = null) => {
    try {
      const data = await getActivities(100, userId);
      const loadedActivities = data.activities;
      
      if (userId) {
        setActivities(filterActivities(loadedActivities));
      } else {
        setAllActivities(loadedActivities);
        const filtered = filterActivities(loadedActivities);
        setActivities(filtered);
        updateUniqueUsers(loadedActivities);
      }
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (userId) => {
    setSelectedUserId(userId);
  };

  const handleViewAll = () => {
    setSelectedUserId(null);
    setActivities(allActivities);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Activity Logs</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                const exportData = activities.map(a => ({
                  User: a.user_name || 'System',
                  Action: a.action,
                  Role: a.user_role || 'N/A',
                  Timestamp: formatDateTime(a.timestamp),
                }));
                exportToCSV(exportData, 'activities');
                showToast('Activities exported successfully', 'success');
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Export CSV
            </button>
            {selectedUserId && (
              <button
                onClick={handleViewAll}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                View All Activities
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date Range
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Action Type
              </label>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Actions</option>
                {uniqueActions.map((action) => (
                  <option key={action} value={action}>
                    {action}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* User Filter Section */}
        {uniqueUsers.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Filter by User {selectedUserId && '(Click to view all)'}
            </h2>
            <div className="flex flex-wrap gap-2">
              {uniqueUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleUserClick(user.id)}
                  className={`px-4 py-2 rounded-lg transition ${
                    selectedUserId === user.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs ml-2 opacity-75">({user.role})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Activities List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          {selectedUserId && (
            <div className="mb-4 p-3 bg-primary-50 dark:bg-primary-900 border-l-4 border-primary-500 rounded">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing activities for:{' '}
                <span className="font-semibold">
                  {uniqueUsers.find((u) => u.id === selectedUserId)?.name || 'User'}
                </span>
              </p>
            </div>
          )}
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-primary-500 hover:bg-gray-100 dark:hover:bg-gray-600 transition cursor-pointer"
                  onClick={() => handleUserClick(activity.user_id)}
                >
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span>📝</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {activity.user_name || 'System'}
                      </p>
                      <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded capitalize text-gray-700 dark:text-gray-300">
                        {activity.user_role}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{activity.action}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1" title={new Date(activity.timestamp).toLocaleString()}>
                      {formatRelativeTime(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                {selectedUserId ? 'No activities found for this user' : 'No activities found'}
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Activities;

