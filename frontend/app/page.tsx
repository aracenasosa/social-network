'use client';

import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
  };

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome to Social Network
              </h1>
              {user && (
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Hello, <span className="font-semibold">{user.username || user.email}</span>!
                </p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Authentication Test Page
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-800 dark:text-green-400 font-semibold">
                ✓ Authentication successful!
              </p>
              <p className="text-green-600 dark:text-green-500 text-sm mt-1">
                You are now logged in and your access token is being attached to all API requests automatically.
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-blue-800 dark:text-blue-400 font-semibold mb-2">
                Token Refresh Information:
              </p>
              <ul className="text-blue-600 dark:text-blue-500 text-sm space-y-1 list-disc list-inside">
                <li>Access token expires every 15 minutes</li>
                <li>When a 401 error occurs, the token will refresh automatically</li>
                <li>No browser reload needed - all happens in the background</li>
                <li>Failed requests will retry automatically with the new token</li>
              </ul>
            </div>

            {user && (
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
                  User Information:
                </p>
                <pre className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-3 rounded overflow-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
