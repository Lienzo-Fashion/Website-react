import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { db } from '../config/firebase';
import { collection, getDocs, updateDoc, doc, addDoc, deleteDoc } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const TABS = [
  { key: 'sales', label: 'Sales Analytics' },
  { key: 'products', label: 'Products' },
  { key: 'orders', label: 'Orders' },
];

// Define a type for orders that includes status and other fields
type Order = {
  id: string;
  status: string;
  [key: string]: any;
};

function SalesFrame() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<any>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const querySnapshot = await getDocs(collection(db, 'orders'));
      setOrders(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
    } catch (e) {
      setError('Failed to fetch sales data.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Prepare chart data
  useEffect(() => {
    if (!chartRef.current || orders.length === 0) return;
    // Group sales by day
    const salesByDay: Record<string, number> = {};
    orders.forEach(order => {
      if (order.status === 'cancelled') return;
      const date = order.createdAt && order.createdAt.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Unknown';
      salesByDay[date] = (salesByDay[date] || 0) + (order.totalAmount || 0);
    });
    const labels = Object.keys(salesByDay);
    const data = Object.values(salesByDay);
    // Destroy previous chart
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }
    chartInstanceRef.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Sales (₹)',
          data,
          backgroundColor: 'rgba(250, 204, 21, 0.7)',
          borderColor: 'rgba(202, 138, 4, 1)',
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
    // Cleanup on unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [orders]);

  // Aggregate stats
  const totalSales = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const orderCount = orders.length;
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Sales Analytics</h2>
      {loading ? (
        <div className="flex justify-center items-center py-12 text-lg">Loading sales data...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-900 rounded-xl p-6 shadow text-center">
              <div className="text-gray-400">Total Sales</div>
              <div className="text-3xl font-bold text-yellow-400">₹{totalSales.toLocaleString()}</div>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 shadow text-center">
              <div className="text-gray-400">Total Orders</div>
              <div className="text-3xl font-bold">{orderCount}</div>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 shadow text-center">
              <div className="text-gray-400">Delivered Orders</div>
              <div className="text-3xl font-bold text-green-400">{deliveredCount}</div>
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 shadow">
            <h3 className="text-lg font-semibold mb-4">Sales by Day</h3>
            <canvas ref={chartRef} height={120}></canvas>
          </div>
        </>
      )}
    </div>
  );
}

function ProductsFrame() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm();
  const categories = ['hoodies', 'shirts', 'accessories', 'other'];

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e) {
      setError('Failed to fetch products.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onSubmit = async (data: any) => {
    setError('');
    setSuccess('');
    try {
      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), data);
        setSuccess('Product updated.');
      } else {
        await addDoc(collection(db, 'products'), data);
        setSuccess('Product added.');
      }
      reset();
      setEditingProduct(null);
      await fetchProducts();
    } catch (e) {
      setError('Failed to save product.');
      setSuccess('');
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    Object.keys(product).forEach(key => setValue(key, product[key]));
  };

  const handleDelete = async (id: string) => {
    setError('');
    setSuccess('');
    try {
      await deleteDoc(doc(db, 'products', id));
      setSuccess('Product deleted.');
      await fetchProducts();
    } catch (e) {
      setError('Failed to delete product.');
      setSuccess('');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Product Management</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-900 p-6 rounded-xl mb-8 shadow-lg max-w-xl">
        <h3 className="text-lg font-semibold mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
        <div className="mb-4">
          <label className="block mb-1">Name</label>
          <input {...register('name', { required: true })} className="w-full px-3 py-2 rounded bg-gray-800 text-white" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Price</label>
          <input type="number" step="0.01" {...register('price', { required: true })} className="w-full px-3 py-2 rounded bg-gray-800 text-white" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Image URL</label>
          <input {...register('image', { required: true })} className="w-full px-3 py-2 rounded bg-gray-800 text-white" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Category/Niche</label>
          <select {...register('category', { required: true })} className="w-full px-3 py-2 rounded bg-gray-800 text-white">
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold hover:bg-yellow-300 transition-colors">
            {editingProduct ? 'Update' : 'Add'}
          </button>
          {editingProduct && (
            <button type="button" onClick={() => { setEditingProduct(null); reset(); }} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors">Cancel</button>
          )}
        </div>
        {success && !error && <div className="text-green-500 mt-2">{success}</div>}
        {error && !success && <div className="text-red-500 mt-2">{error}</div>}
      </form>
      <h3 className="text-lg font-semibold mb-4">All Products</h3>
      {loading ? (
        <div className="flex justify-center items-center py-8">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-gray-400">No products found.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map(product => (
            <div key={product.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow flex flex-col gap-2">
              <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded mb-2" />
              <div className="font-bold text-lg">{product.name}</div>
              <div className="text-yellow-400 font-semibold">₹{product.price}</div>
              <div className="text-sm text-gray-400">Category: {product.category}</div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => handleEdit(product)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-400 transition-colors">Edit</button>
                <button onClick={() => handleDelete(product.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-400 transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OrdersFrame() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const statusOptions = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const querySnapshot = await getDocs(collection(db, 'orders'));
      const ordersWithPayment = await Promise.all(querySnapshot.docs.map(async docSnap => {
        let order = { id: docSnap.id, ...docSnap.data() } as Order;
        // Check payments subcollection
        const paymentsSnap = await getDocs(collection(db, 'orders', docSnap.id, 'payments'));
        const hasPaid = paymentsSnap.docs.some(p => p.data().status === 'success');
        if (hasPaid && order.status !== 'paid' && order.status !== 'delivered' && order.status !== 'shipped') {
          // Auto-update status to paid
          await updateDoc(doc(db, 'orders', docSnap.id), { status: 'paid' });
          order.status = 'paid';
        }
        return order;
      }));
      setOrders(ordersWithPayment);
    } catch (e) {
      setError('Failed to fetch orders.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setError('');
    setSuccess('');
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      setSuccess('Order status updated.');
      setOrders(orders => orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
    } catch (e) {
      setError('Failed to update status.');
      setSuccess('');
    }
  };

  const canChangeStatus = (order: Order, newStatus: string) => {
    if (order.status === 'cancelled' || order.status === 'delivered') return false;
    if (newStatus === 'shipped' && order.status !== 'paid') return false;
    if (newStatus === 'delivered' && order.status !== 'shipped') return false;
    if (newStatus === 'paid' && order.status !== 'pending') return false;
    return true;
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Order Management</h2>
      {loading ? (
        <div className="flex justify-center items-center py-12 text-lg">Loading orders...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {orders.length === 0 ? (
            <div className="col-span-full text-center text-gray-400">No orders found.</div>
          ) : (
            orders.map((order: Order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`border rounded-xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 ${order.status === 'paid' ? 'border-green-400 bg-green-900/10' : 'border-gray-800 bg-gray-900'}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-lg">Order #{order.id}</span>
                  <span className="text-sm text-gray-400">{order.userEmail}</span>
                </div>
                <div className="text-xs text-gray-400 mb-2">Placed: {order.createdAt && order.createdAt.toDate ? order.createdAt.toDate().toLocaleString() : ''}</div>
                <div className="mb-2 divide-y divide-gray-800">
                  {order.items && order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-sm py-2">
                      <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded" />
                      <span>{item.name} x{item.quantity} <span className="text-gray-400">({item.size}, {item.color})</span></span>
                    </div>
                  ))}
                </div>
                <div className="font-bold mb-2 text-right">Total: <span className="text-green-400">₹{order.totalAmount}</span></div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm">Status:</span>
                  <motion.select
                    value={order.status}
                    onChange={e => {
                      const newStatus = e.target.value;
                      if (canChangeStatus(order, newStatus)) handleStatusChange(order.id, newStatus);
                    }}
                    className="bg-gray-800 text-white rounded px-2 py-1 focus:ring-2 focus:ring-yellow-400 outline-none"
                    whileTap={{ scale: 0.97 }}
                    disabled={order.status === 'cancelled' || order.status === 'delivered'}
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status} disabled={!canChangeStatus(order, status) && status !== order.status}>{status}</option>
                    ))}
                  </motion.select>
                  {/* Visual pipeline */}
                  <div className="flex gap-1 ml-4">
                    {['pending', 'paid', 'shipped', 'delivered', 'cancelled'].map((step, idx) => (
                      <span key={step} className={`w-2 h-2 rounded-full ${order.status === step ? 'bg-yellow-400' : order.status === 'cancelled' && step === 'cancelled' ? 'bg-red-500' : 'bg-gray-700'}`}></span>
                    ))}
                  </div>
                </div>
                {success && !error && <div className="text-green-500 mt-2 text-sm">{success}</div>}
                {error && !success && <div className="text-red-500 mt-2 text-sm">{error}</div>}
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('sales');

  let FrameComponent;
  if (activeTab === 'sales') FrameComponent = SalesFrame;
  else if (activeTab === 'products') FrameComponent = ProductsFrame;
  else FrameComponent = OrdersFrame;

  return (
    <div className="flex min-h-[80vh]">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col py-8 px-4">
        <h1 className="text-xl font-bold mb-8 text-yellow-400">Admin Panel</h1>
        <nav className="flex flex-col gap-2">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`text-left px-4 py-2 rounded-lg transition-colors font-semibold ${
                activeTab === tab.key
                  ? 'bg-yellow-400 text-black shadow'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>
      {/* Main Frame */}
      <main className="flex-1 bg-black text-white">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FrameComponent />
        </motion.div>
      </main>
    </div>
  );
} 