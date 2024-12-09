import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Navigate } from 'react-router-dom';

function Profile() {
  const [activeTab, setActiveTab] = useState('orders');
  const [error, setError] = useState('');
  const { user, userData, signOut, updateUserData } = useAuthStore();
  const navigate = useNavigate();

  if (!user || !userData) {
    return <Navigate to="/auth" replace />;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const updatedData = {
      name: formData.get('name')?.toString() || userData.name,
    };

    try {
      await updateUserData({ ...userData, ...updatedData });
      alert('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="text-center mb-6">
              <img
                src={
                  userData.photoURL ||
                  `https://ui-avatars.com/api/?name=${userData.name}&background=random`
                }
                alt="Profile"
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h2 className="text-xl font-bold">{userData.name}</h2>
              <p className="text-gray-400">{userData.email}</p>
              {userData.role === 'admin' && (
                <span className="inline-block mt-2 px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                  Admin
                </span>
              )}
            </div>
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'orders'
                    ? 'bg-white text-black'
                    : 'hover:bg-gray-800'
                }`}
              >
                <Package className="w-5 h-5" />
                Orders
              </button>
              <button
                onClick={() => setActiveTab('account')}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'account'
                    ? 'bg-white text-black'
                    : 'hover:bg-gray-800'
                }`}
              >
                <User className="w-5 h-5" />
                Account Settings
              </button>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-500 hover:bg-gray-800 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-900 rounded-lg p-6"
          >
            {activeTab === 'account' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                      defaultValue={userData.name}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                      defaultValue={userData.email}
                      disabled
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Save Changes
                  </button>
                  {error && <p className="text-red-500 mt-2">{error}</p>}
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
