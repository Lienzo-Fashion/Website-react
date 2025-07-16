import { motion } from 'framer-motion';
import { Minus, Plus, X } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { db } from '../config/firebase';
import { collection, addDoc, Timestamp, doc, updateDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

// Razorpay test key
const RAZORPAY_KEY = 'rzp_test_1DP5mmOlF5G5ag';

function Cart() {
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const { user, userData } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
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
  const [addingNewAddress, setAddingNewAddress] = useState(false);
  const [pendingRazorpay, setPendingRazorpay] = useState(false);
  const navigate = useNavigate();
  const [cookieConsent, setCookieConsent] = useState(() => {
    return localStorage.getItem('cookie_consent') === 'true';
  });

  useEffect(() => {
    if (cookieConsent && !window.gtagScriptLoaded) {
      // Dynamically load GA script if not already loaded
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-406RHGVDTH';
      document.head.appendChild(script1);
      const script2 = document.createElement('script');
      script2.innerHTML = `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-406RHGVDTH');`;
      document.head.appendChild(script2);
      window.gtagScriptLoaded = true;
    }
  }, [cookieConsent]);

  useEffect(() => {
    if (userData?.addresses) {
      setAddresses(userData.addresses);
      if (userData.addresses.length > 0) {
        const defaultAddr = userData.addresses.find((a: any) => a.isDefault) || userData.addresses[0];
        setSelectedAddressId(defaultAddr.id);
      }
    }
  }, [userData]);

  // Close modal on outside click
  useEffect(() => {
    if (!showAddressModal) return;
    function handleClick(e: MouseEvent) {
      const modal = document.getElementById('address-modal');
      if (modal && !modal.contains(e.target as Node)) {
        setShowAddressModal(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showAddressModal]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const newAddress = { ...addressForm, id: uuidv4(), isDefault: addresses.length === 0 };
    const newAddresses = [
      ...addresses.map(addr => ({ ...addr, isDefault: false })),
      { ...newAddress, isDefault: true },
    ];
    if (user && user.uid) {
      await updateDoc(doc(db, 'users', user.uid), { addresses: newAddresses });
      setAddresses(newAddresses);
      setSelectedAddressId(newAddress.id);
      setAddingNewAddress(false);
      setAddressForm({ id: '', name: '', line1: '', line2: '', city: '', state: '', zip: '', country: '', isDefault: false });
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = items.length > 0 ? 10 : 0;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    if (!user || !userData) {
      setError('You must be logged in to place an order.');
      setLoading(false);
      return;
    }
    if (!selectedAddressId) {
      setError('Please select a shipping address.');
      setLoading(false);
      return;
    }
    const selectedAddress = addresses.find((a: any) => a.id === selectedAddressId);
    try {
      const order = {
        userId: user.uid,
        userEmail: user.email,
        items: items.map(({ id, name, price, quantity, size, color, image }) => ({ id, name, price, quantity, size, color, image })),
        totalAmount: total,
        status: 'pending',
        createdAt: Timestamp.now(),
        shippingAddress: selectedAddress,
      };
      await addDoc(collection(db, 'orders'), order);
      clearCart();
      setSuccess('Order placed successfully!');
    } catch (e) {
      setError('Failed to place order. Please try again.');
    }
    setLoading(false);
  };

  const handleRemoveItem = (id: string) => {
    const item = items.find(i => i.id === id);
    removeItem(id);
    // Google Analytics remove_from_cart event
    if (window.gtag && item) {
      window.gtag('event', 'remove_from_cart', {
        currency: 'INR',
        value: item.price * item.quantity,
        items: [{
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity,
          item_category: item.category || '',
          item_variant: item.size + '-' + item.color,
        }],
      });
    }
  };

  const handleRazorpayPayment = async () => {
    setError('');
    setSuccess('');
    if (!user || !userData) {
      setError('You must be logged in to place an order.');
      return;
    }
    setAddingNewAddress(false);
    setShowAddressModal(true);
    setPendingRazorpay(true);
    // Google Analytics begin_checkout event
    if (window.gtag) {
      window.gtag('event', 'begin_checkout', {
        currency: 'INR',
        value: total,
        items: items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity,
          item_category: item.category || '',
          item_variant: item.size + '-' + item.color,
        })),
      });
    }
  };

  const handleConfirmAddressAndPay = () => {
    setShowAddressModal(false);
    setPendingRazorpay(false);
    if (!selectedAddressId) {
      setError('Please select a shipping address.');
      return;
    }
    const selectedAddress = addresses.find((a: any) => a.id === selectedAddressId);
    if (!user) return;
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    script.onload = () => {
      const options = {
        key: RAZORPAY_KEY,
        amount: total * 100, // in paise
        currency: 'INR',
        name: 'Lienzo',
        description: 'Order Payment',
        handler: async function (response: any) {
          try {
            const order = {
              userId: user.uid,
              userEmail: user.email,
              items: items.map(({ id, name, price, quantity, size, color, image }) => ({ id, name, price, quantity, size, color, image })),
              totalAmount: total,
              status: 'paid',
              createdAt: Timestamp.now(),
              shippingAddress: selectedAddress,
              payment: {
                paymentId: response.razorpay_payment_id,
                status: 'success',
                createdAt: Timestamp.now(),
              },
            };
            await addDoc(collection(db, 'orders'), order);
            clearCart();
            setSuccess('Payment successful! Order placed.');
            setTimeout(() => {
              navigate('/profile?tab=orders');
            }, 1200);
            // Google Analytics purchase event
            if (window.gtag) {
              window.gtag('event', 'purchase', {
                transaction_id: order.id, // Assuming order.id is the transaction ID
                currency: 'INR',
                value: total,
                items: items.map(item => ({
                  item_id: item.id,
                  item_name: item.name,
                  price: item.price,
                  quantity: item.quantity,
                  item_category: item.category || '',
                  item_variant: item.size + '-' + item.color,
                })),
              });
            }
          } catch (e) {
            setError('Failed to save order after payment.');
          }
        },
        prefill: {
          name: selectedAddress.name,
          email: user.email,
        },
        theme: {
          color: '#facc15',
        },
      };
      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();
    };
    script.onerror = () => {
      setError('Failed to load Razorpay.');
    };
  };

  const handleAcceptCookies = () => {
    setCookieConsent(true);
    localStorage.setItem('cookie_consent', 'true');
  };

  return (
    <motion.div
      initial={{ y: '-100vh', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '-100vh', opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          {items.length === 0 ? (
            <div className="text-center py-8 bg-gray-900 rounded-lg">
              <p className="text-gray-400">Your cart is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <motion.div
                key={`${item.id}-${item.size}-${item.color}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center gap-4 bg-gray-900 p-4 rounded-lg mb-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />

                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-400">
                    Size: {item.size} | Color: {item.color}
                  </p>
                  <p className="font-semibold">₹{item.price}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-1 hover:bg-gray-800 rounded"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-1 hover:bg-gray-800 rounded"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-2 hover:bg-gray-800 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            ))
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-gray-900 p-6 rounded-lg h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>

          {/* Address Selection */}
          {user && addresses.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Shipping Address</h3>
              <div className="space-y-2">
                {addresses.map((addr: any) => (
                  <label key={addr.id} className={`flex items-start gap-2 p-2 rounded-lg cursor-pointer ${selectedAddressId === addr.id ? 'bg-yellow-400/10 border border-yellow-400' : 'bg-gray-800 border border-gray-700'}`}>
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-semibold">{addr.name}</div>
                      <div className="text-sm text-gray-400">{addr.line1}, {addr.line2 && addr.line2 + ', '}{addr.city}, {addr.state}, {addr.zip}, {addr.country}</div>
                      {addr.isDefault && <span className="text-xs text-yellow-400 font-semibold">Default</span>}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{shipping.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-800 pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Razorpay Payment Button */}
          <button
            className={`w-full py-3 rounded-lg transition-colors bg-yellow-400 text-black font-semibold hover:bg-yellow-300`}
            disabled={items.length === 0 || loading}
            onClick={handleRazorpayPayment}
          >
            Pay with Razorpay
          </button>
          {success && <div className="text-green-500 mt-4 text-center">{success}</div>}
          {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
        </div>
      </div>

      {/* Address Modal (always shown before payment) */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div id="address-modal" className="bg-white text-black rounded-lg p-8 w-full max-w-md shadow-lg relative">
            <h2 className="text-xl font-bold mb-4">Select Shipping Address</h2>
            {!addingNewAddress ? (
              <>
                {addresses.length > 0 ? (
                  <div className="space-y-2 mb-4">
                    {addresses.map((addr: any) => (
                      <label key={addr.id} className={`flex items-start gap-2 p-2 rounded-lg cursor-pointer ${selectedAddressId === addr.id ? 'bg-yellow-400/10 border border-yellow-400' : 'bg-gray-200 border border-gray-300'}`}>
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-semibold">{addr.name}</div>
                          <div className="text-sm text-gray-600">{addr.line1}, {addr.line2 && addr.line2 + ', '}{addr.city}, {addr.state}, {addr.zip}, {addr.country}</div>
                          {addr.isDefault && <span className="text-xs text-yellow-500 font-semibold">Default</span>}
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 mb-4">No addresses found. Please add one.</div>
                )}
                <div className="flex gap-2 mb-4">
                  <button type="button" onClick={() => setAddingNewAddress(true)} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Add New Address</button>
                  <button type="button" onClick={() => { setShowAddressModal(false); setPendingRazorpay(false); }} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
                  <button type="button" onClick={handleConfirmAddressAndPay} className="px-4 py-2 rounded bg-yellow-400 hover:bg-yellow-300 font-semibold" disabled={!selectedAddressId}>Confirm & Pay</button>
                </div>
              </>
            ) : (
              <form onSubmit={handleSaveAddress} className="space-y-3">
                <input name="name" value={addressForm.name} onChange={handleAddressChange} placeholder="Full Name" className="w-full px-3 py-2 rounded bg-gray-200" required />
                <input name="line1" value={addressForm.line1} onChange={handleAddressChange} placeholder="Address Line 1" className="w-full px-3 py-2 rounded bg-gray-200" required />
                <input name="line2" value={addressForm.line2} onChange={handleAddressChange} placeholder="Address Line 2" className="w-full px-3 py-2 rounded bg-gray-200" />
                <input name="city" value={addressForm.city} onChange={handleAddressChange} placeholder="City" className="w-full px-3 py-2 rounded bg-gray-200" required />
                <input name="state" value={addressForm.state} onChange={handleAddressChange} placeholder="State" className="w-full px-3 py-2 rounded bg-gray-200" required />
                <input name="zip" value={addressForm.zip} onChange={handleAddressChange} placeholder="ZIP Code" className="w-full px-3 py-2 rounded bg-gray-200" required />
                <input name="country" value={addressForm.country} onChange={handleAddressChange} placeholder="Country" className="w-full px-3 py-2 rounded bg-gray-200" required />
                <div className="flex justify-end gap-2 mt-2">
                  <button type="button" onClick={() => setAddingNewAddress(false)} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Back</button>
                  <button type="submit" className="px-4 py-2 rounded bg-yellow-400 hover:bg-yellow-300 font-semibold">Save Address</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      {!cookieConsent && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#222', color: '#fff', padding: '1rem', zIndex: 9999, textAlign: 'center' }}>
          This site uses cookies for analytics. By continuing, you accept our use of cookies.
          <button onClick={handleAcceptCookies} style={{ marginLeft: '1rem', background: '#fff', color: '#222', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Accept</button>
        </div>
      )}
    </motion.div>
  );
}

export default Cart;
