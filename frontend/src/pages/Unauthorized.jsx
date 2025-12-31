import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Access Forbidden
        </h2>
        <p className="text-gray-600 mb-8">
          You don't have permission to access this resource.
        </p>
        <Link
          to="/profile"
          className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          Go to Profile
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;

