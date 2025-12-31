import { useEffect, useState } from 'react';
import Layout from '../../components/Layout.jsx';
import {
  getDashboardStats,
  getUserGrowthData,
  getRoleDistributionData,
  getActivityStatsData,
} from '../../services/analyticsService.js';
import { getActivities } from '../../services/activityService.js';
import { useSocket } from '../../hooks/useSocket.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    activeSessionsCount: 0,
  });
  const [userGrowth, setUserGrowth] = useState([]);
  const [roleDistribution, setRoleDistribution] = useState([]);
  const [activityStats, setActivityStats] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(30);

  const socket = useSocket();

  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

  useEffect(() => {
    if (socket) {
      socket.on('active_users_updated', (data) => {
        setStats((prev) => ({
          ...prev,
          activeSessionsCount: data.count,
        }));
      });

      socket.on('activity_created', (data) => {
        setActivities((prev) => [data, ...prev].slice(0, 20));
      });

      return () => {
        socket.off('active_users_updated');
        socket.off('activity_created');
      };
    }
  }, [socket]);

  const loadDashboardData = async () => {
    try {
      const [statsData, growthData, roleData, activityStatsData, activitiesData] =
        await Promise.all([
          getDashboardStats(),
          getUserGrowthData(dateRange),
          getRoleDistributionData(),
          getActivityStatsData(dateRange),
          getActivities(20),
        ]);

      setStats(statsData);
      setUserGrowth(growthData.growthData);
      setRoleDistribution(roleData.distribution);
      setActivityStats(activityStatsData.stats);
      setActivities(activitiesData.activities);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

  const growthChartData = {
    labels: userGrowth.map((item) => new Date(item.date).toLocaleDateString()),
    datasets: [
      {
        label: 'New Users',
        data: userGrowth.map((item) => item.count),
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const roleChartData = {
    labels: roleDistribution.map((item) => item.role),
    datasets: [
      {
        label: 'Users',
        data: roleDistribution.map((item) => parseInt(item.count)),
        backgroundColor: [
          'rgba(14, 165, 233, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
      },
    ],
  };

  const activityChartData = {
    labels: activityStats.map((item) => new Date(item.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Activities',
        data: activityStats.map((item) => parseInt(item.count)),
        backgroundColor: 'rgba(14, 165, 233, 0.5)',
        borderColor: 'rgba(14, 165, 233, 1)',
        borderWidth: 2,
      },
    ],
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
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Date Range:
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-primary-500"
            >
              <option value={7}>Last 7 Days</option>
              <option value={14}>Last 14 Days</option>
              <option value={30}>Last 30 Days</option>
              <option value={60}>Last 60 Days</option>
              <option value={90}>Last 90 Days</option>
              <option value={180}>Last 6 Months</option>
              <option value={365}>Last Year</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {stats.totalUsers}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Users</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {stats.activeUsers}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Online Now</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {stats.activeSessionsCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🟢</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              User Growth ({dateRange} Days)
            </h2>
            {userGrowth.length > 0 ? (
              <Line data={growthChartData} />
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No data available</p>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Role Distribution
            </h2>
            {roleDistribution.length > 0 ? (
              <Doughnut data={roleChartData} />
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No data available</p>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Activity Trends ({dateRange} Days)
            </h2>
            {activityStats.length > 0 ? (
              <Bar data={activityChartData} />
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No data available</p>
            )}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Activity Feed
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span>📝</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {activity.user_name || 'System'}
                    </p>
                    <p className="text-xs text-gray-600">{activity.action}</p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No activities yet</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;

