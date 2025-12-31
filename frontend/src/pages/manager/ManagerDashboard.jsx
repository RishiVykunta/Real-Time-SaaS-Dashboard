import { useEffect, useState } from 'react';
import Layout from '../../components/Layout.jsx';
import {
  getDashboardStats,
  getUserGrowthData,
  getRoleDistributionData,
} from '../../services/analyticsService.js';
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
import { Line, Bar, Pie } from 'react-chartjs-2';

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

const ManagerDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    activeSessionsCount: 0,
  });
  const [userGrowth, setUserGrowth] = useState([]);
  const [roleDistribution, setRoleDistribution] = useState([]);
  const [loading, setLoading] = useState(true);

  const socket = useSocket();

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('active_users_updated', (data) => {
        setStats((prev) => ({
          ...prev,
          activeSessionsCount: data.count,
        }));
      });

      return () => {
        socket.off('active_users_updated');
      };
    }
  }, [socket]);

  const loadDashboardData = async () => {
    try {
      const [statsData, growthData, roleData] = await Promise.all([
        getDashboardStats(),
        getUserGrowthData(7),
        getRoleDistributionData(),
      ]);

      setStats(statsData);
      setUserGrowth(growthData.growthData);
      setRoleDistribution(roleData.distribution);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

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
        ],
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
        <h1 className="text-3xl font-bold text-gray-800">Manager Dashboard</h1>

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
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              User Growth (Last 7 Days)
            </h2>
            {userGrowth.length > 0 ? (
              <Line data={growthChartData} />
            ) : (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Role Distribution
            </h2>
            {roleDistribution.length > 0 ? (
              <Pie data={roleChartData} />
            ) : (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ManagerDashboard;

