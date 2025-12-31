import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Layout from '../components/Layout.jsx';
import { createActivity } from '../services/activityService.js';
import { formatDate } from '../utils/dateFormatter.js';

const Profile = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (user) {
      createActivity('Viewed profile page');
    }
  }, [user]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">👤</span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                {user?.name}
              </h2>
              <p className="text-gray-600">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm capitalize">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Account Information
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600">Status:</span>
              <span
                className={`font-semibold ${
                  user?.status === 'active'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {user?.status}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600">Role:</span>
              <span className="font-semibold capitalize">{user?.role}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-gray-600">Member Since:</span>
              <span className="font-semibold">
                {formatDate(user?.created_at)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;

