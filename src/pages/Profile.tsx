import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, CreditCard, User, LogOut } from 'lucide-react';

function Profile() {
  const [activeTab, setActiveTab] = useState('orders');
  
  const orders = [
    {
      id: '#12345',
      date: '2024-02-20',
      status: 'Delivered',
      total: 99.99,
      items: [
        {
          name: 'Premium Street Hoodie',
          quantity: 1,
          price: 99.99,
        },
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gray-800 mx-auto mb-4" />
              <h2 className="text-xl font-bold">John Doe</h2>
              <p className="text-gray-400">john@example.com</p>
            </div>
            
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'orders' ? 'bg-white text-black' : 'hover:bg-gray-800'
                }`}
              >
                <Package className="w-5 h-5" />
                Orders
              </button>
              <button
                onClick={() => setActiveTab('payment')}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'payment' ? 'bg-white text-black' : 'hover:bg-gray-800'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                Payment Methods
              </button>
              <button
                onClick={() => setActiveTab('account')}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'account' ? 'bg-white text-black' : 'hover:bg-gray-800'
                }`}
              >
                <User className="w-5 h-5" />
                Account Settings
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-500 hover:bg-gray-800 transition-colors">
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
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Order History</h2>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-800 rounded-lg p-4">
                      <div className="flex justify-between mb-4">
                        <div>
                          <p className="font-semibold">{order.id}</p>
                          <p className="text-gray-400">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${order.total}</p>
                          <p className="text-green-500">{order.status}</p>
                        </div>
                      </div>
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-gray-400">
                          <p>{item.name} x{item.quantity}</p>
                          <p>${item.price}</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'payment' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Payment Methods</h2>
                <div className="bg-gray-800 rounded-lg p-4 mb-4">
                  <p className="text-gray-400">No payment methods added yet.</p>
                </div>
                <button className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                  Add Payment Method
                </button>
              </div>
            )}
            
            {activeTab === 'account' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                      defaultValue="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                      defaultValue="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                      defaultValue="+1 234 567 890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Address</label>
                    <textarea
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                      defaultValue="123 Street Fashion, NY"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Save Changes
                  </button>
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