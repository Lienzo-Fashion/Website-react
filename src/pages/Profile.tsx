import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { db } from '../config/firebase';
import { collection, query, where, getDocs, Timestamp, onSnapshot, arrayUnion, arrayRemove, updateDoc, doc, getDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNotificationStore } from '../store/notificationStore';
import { v4 as uuidv4 } from 'uuid';

function Profile() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('orders');
  const [error, setError] = useState('');
  const { user, userData, signOut, updateUserData } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();
  const [addresses, setAddresses] = useState<any[]>(userData?.addresses || []);
  const [addressForm, setAddressForm] = useState({
    id: '',
    name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    isDefault: false,
  });
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  // Set activeTab from query string on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['orders', 'account'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location.search]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
    let prevOrders: any[] = [];
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Compare with previous orders to detect status changes
      updatedOrders.forEach(order => {
        const prevOrder = prevOrders.find(o => o.id === order.id);
        if (prevOrder && prevOrder.status !== order.status) {
          // Show notification based on new status
          if (order.status === 'paid') {
            toast.success('Thank you for shopping with us! We have confirmed your order.');
            addNotification({ message: 'Thank you for shopping with us! We have confirmed your order.', type: 'success' });
          } else if (order.status === 'shipped') {
            toast('Your order has been shipped and will be arriving soon!');
            addNotification({ message: 'Your order has been shipped and will be arriving soon!', type: 'info' });
          } else if (order.status === 'delivered') {
            toast.success('Your order has been delivered. Enjoy!');
            addNotification({ message: 'Your order has been delivered. Enjoy!', type: 'success' });
          }
        }
      });
      prevOrders = updatedOrders;
      setOrders(updatedOrders);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (userData?.addresses) setAddresses(userData.addresses);
  }, [userData]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    let newAddresses = [...addresses];
    let newAddress = { ...addressForm };
    if (!editingAddressId) {
      newAddress.id = uuidv4();
      if (addresses.length === 0) newAddress.isDefault = true;
      newAddresses.push(newAddress);
    } else {
      newAddresses = newAddresses.map(addr => addr.id === editingAddressId ? { ...newAddress, id: editingAddressId } : addr);
    }
    // Ensure only one default
    if (newAddress.isDefault) {
      newAddresses = newAddresses.map(addr => ({ ...addr, isDefault: addr.id === newAddress.id }));
    }
    setAddresses(newAddresses);
    setAddressForm({ id: '', name: '', line1: '', line2: '', city: '', state: '', zip: '', country: '', isDefault: false });
    setEditingAddressId(null);
    // Save to Firestore
    await updateDoc(doc(db, 'users', user.uid), { addresses: newAddresses });
  };

  const handleEditAddress = (addr: any) => {
    setAddressForm(addr);
    setEditingAddressId(addr.id);
  };

  const handleDeleteAddress = async (id: string) => {
    if (!user) return;
    const newAddresses = addresses.filter(addr => addr.id !== id);
    setAddresses(newAddresses);
    await updateDoc(doc(db, 'users', user.uid), { addresses: newAddresses });
  };

  const handleSetDefault = async (id: string) => {
    if (!user) return;
    const newAddresses = addresses.map(addr => ({ ...addr, isDefault: addr.id === id }));
    setAddresses(newAddresses);
    await updateDoc(doc(db, 'users', user.uid), { addresses: newAddresses });
  };

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
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-2">Addresses</h3>
                  <form onSubmit={handleAddOrUpdateAddress} className="space-y-2 bg-gray-800 p-4 rounded-lg mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input name="name" value={addressForm.name} onChange={handleAddressChange} placeholder="Full Name" className="px-3 py-2 rounded bg-gray-900 text-white" required />
                      <input name="line1" value={addressForm.line1} onChange={handleAddressChange} placeholder="Address Line 1" className="px-3 py-2 rounded bg-gray-900 text-white" required />
                      <input name="line2" value={addressForm.line2} onChange={handleAddressChange} placeholder="Address Line 2" className="px-3 py-2 rounded bg-gray-900 text-white" />
                      <input name="city" value={addressForm.city} onChange={handleAddressChange} placeholder="City" className="px-3 py-2 rounded bg-gray-900 text-white" required />
                      <input name="state" value={addressForm.state} onChange={handleAddressChange} placeholder="State" className="px-3 py-2 rounded bg-gray-900 text-white" required />
                      <input name="zip" value={addressForm.zip} onChange={handleAddressChange} placeholder="ZIP Code" className="px-3 py-2 rounded bg-gray-900 text-white" required />
                      <input name="country" value={addressForm.country} onChange={handleAddressChange} placeholder="Country" className="px-3 py-2 rounded bg-gray-900 text-white" required />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <input type="checkbox" name="isDefault" checked={addressForm.isDefault} onChange={e => setAddressForm({ ...addressForm, isDefault: e.target.checked })} />
                      <span>Set as default address</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button type="submit" className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold hover:bg-yellow-300 transition-colors">
                        {editingAddressId ? 'Update Address' : 'Add Address'}
                      </button>
                      {editingAddressId && (
                        <button type="button" onClick={() => { setEditingAddressId(null); setAddressForm({ id: '', name: '', line1: '', line2: '', city: '', state: '', zip: '', country: '', isDefault: false }); }} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors">Cancel</button>
                      )}
                    </div>
                  </form>
                  <div className="space-y-2">
                    {addresses.length === 0 && <div className="text-gray-400">No addresses added yet.</div>}
                    {addresses.map(addr => (
                      <div key={addr.id} className={`p-4 rounded-lg border ${addr.isDefault ? 'border-yellow-400 bg-yellow-400/10' : 'border-gray-800 bg-gray-800'}`}>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold">{addr.name}</div>
                            <div className="text-sm text-gray-400">{addr.line1}, {addr.line2 && addr.line2 + ', '}{addr.city}, {addr.state}, {addr.zip}, {addr.country}</div>
                            {addr.isDefault && <span className="text-xs text-yellow-400 font-semibold">Default</span>}
                          </div>
                          <div className="flex gap-2">
                            {!addr.isDefault && <button onClick={() => handleSetDefault(addr.id)} className="text-xs text-yellow-400 hover:underline">Set Default</button>}
                            <button onClick={() => handleEditAddress(addr)} className="text-xs text-blue-400 hover:underline">Edit</button>
                            <button onClick={() => handleDeleteAddress(addr.id)} className="text-xs text-red-400 hover:underline">Delete</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div className="bg-gray-900 p-6 rounded-lg mt-8">
              <h2 className="text-xl font-bold mb-4">My Orders</h2>
              {loadingOrders ? (
                <div>Loading orders...</div>
              ) : orders.length === 0 ? (
                <div>No orders found.</div>
              ) : (
                <ul className="space-y-4">
                  {orders.map(order => (
                    <li key={order.id} className="border border-gray-800 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Order #{order.id}</span>
                        <span className="text-sm text-gray-400">{order.status}</span>
                      </div>
                      <div className="text-sm text-gray-400">Placed: {order.createdAt && order.createdAt.toDate ? order.createdAt.toDate().toLocaleString() : ''}</div>
                      <div className="mt-2">
                        {order.items && order.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <img src={item.image} alt={item.name} className="w-8 h-8 object-cover rounded" />
                            <span>{item.name} x{item.quantity} ({item.size}, {item.color})</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 font-bold">Total: ₹{order.totalAmount}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
