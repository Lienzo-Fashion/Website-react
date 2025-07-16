import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, Bell } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import { useCartStore } from '../store/cartStore';

function Navbar(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const { user, userData, isLoading } = useAuthStore();
  const { notifications, markAllRead, clearNotifications } = useNotificationStore();
  const [desktopNotifOpen, setDesktopNotifOpen] = useState(false);
  const [mobileNotifOpen, setMobileNotifOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;
  const desktopNotifRef = useRef<HTMLDivElement>(null);
  const mobileNotifRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const { items } = useCartStore();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (desktopNotifOpen && desktopNotifRef.current && !desktopNotifRef.current.contains(event.target as Node)) {
        setDesktopNotifOpen(false);
      }
      if (mobileNotifOpen && mobileNotifRef.current && !mobileNotifRef.current.contains(event.target as Node)) {
        setMobileNotifOpen(false);
      }
      if (isOpen && drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (desktopNotifOpen || mobileNotifOpen || isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [desktopNotifOpen, mobileNotifOpen, isOpen]);

  return (
    <nav className="fixed w-full z-50 bg-black bg-opacity-90 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold">
            LIENZO
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-gray-300 transition-colors">
              Home
            </Link>
            <Link to="/shop" className="hover:text-gray-300 transition-colors">
              Shop
            </Link>
            <Link to="/about" className="hover:text-gray-300 transition-colors">
              About Us
            </Link>
            <Link to="/cart" className="relative p-2 hover:bg-gray-800 rounded-full">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs rounded-full px-1.5 py-0.5 font-bold min-w-[20px] text-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link to="/profile" className="p-2 hover:bg-gray-800 rounded-full">
              <User className="w-6 h-6" />
            </Link>
            <div className="relative" ref={desktopNotifRef}>
              <button
                className="relative p-2 hover:bg-gray-800 rounded-full"
                onClick={() => {
                  setDesktopNotifOpen((open) => !open);
                  markAllRead();
                }}
                aria-label="Notifications"
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                    {unreadCount}
                  </span>
                )}
              </button>
              {desktopNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-gray-800 rounded-lg shadow-lg z-50">
                  <div className="flex justify-between items-center px-4 py-2 border-b border-gray-800">
                    <span className="font-semibold">Notifications</span>
                    <button onClick={clearNotifications} className="text-xs text-red-400 hover:underline">Clear All</button>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-800">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-gray-400 text-center">No notifications</div>
                    ) : (
                      notifications.map((notif) => (
                        <div key={notif.id} className={`px-4 py-3 text-sm ${notif.read ? 'text-gray-300' : 'text-white'} ${notif.type === 'success' ? 'bg-green-900/20' : notif.type === 'error' ? 'bg-red-900/20' : ''}`}>
                          {notif.message}
                          <div className="text-xs text-gray-500 mt-1">{new Date(notif.timestamp).toLocaleString()}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            {(!isLoading && userData && userData.role === 'admin') && (
              <Link to="/admin" className="hover:text-yellow-400 transition-colors font-semibold">
                Admin
              </Link>
            )}
          </div>

          {/* Mobile Icons & Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <Link to="/cart" className="relative p-2 hover:bg-gray-800 rounded-full">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs rounded-full px-1.5 py-0.5 font-bold min-w-[20px] text-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link to="/profile" className="p-2 hover:bg-gray-800 rounded-full"><User className="w-6 h-6" /></Link>
            <div className="relative" ref={mobileNotifRef}>
              <button
                className="relative p-2 hover:bg-gray-800 rounded-full"
                onClick={() => {
                  setMobileNotifOpen((open) => !open);
                  markAllRead();
                }}
                aria-label="Notifications"
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{unreadCount}</span>
                )}
              </button>
              {mobileNotifOpen && (
                 <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-gray-800 rounded-lg shadow-lg z-50">
                   <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700">
                     <span className="font-semibold">Notifications</span>
                     <button onClick={clearNotifications} className="text-xs text-red-400 hover:underline">Clear All</button>
                   </div>
                   <div className="max-h-60 overflow-y-auto divide-y divide-gray-700">
                     {notifications.length === 0 ? (
                       <div className="p-4 text-gray-400 text-center">No notifications</div>
                     ) : (
                       notifications.map((notif) => (
                         <div key={notif.id} className={`px-4 py-3 text-sm ${notif.read ? 'text-gray-300' : 'text-white'}`}>
                           {notif.message}
                           <div className="text-xs text-gray-500 mt-1">{new Date(notif.timestamp).toLocaleString()}</div>
                         </div>
                       ))
                     )}
                   </div>
                 </div>
              )}
            </div>
            <button
              className="p-2 hover:bg-gray-800 rounded-full"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {isOpen && (
          <div className="md:hidden" ref={drawerRef}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/" className="block px-3 py-2 rounded-md hover:bg-gray-900 transition-colors" onClick={() => setIsOpen(false)}>Home</Link>
              <Link to="/shop" className="block px-3 py-2 rounded-md hover:bg-gray-900 transition-colors" onClick={() => setIsOpen(false)}>Shop</Link>
              <Link to="/about" className="block px-3 py-2 rounded-md hover:bg-gray-900 transition-colors" onClick={() => setIsOpen(false)}>About Us</Link>
              {(!isLoading && userData && userData.role === 'admin') && (
                <Link to="/admin" className="block px-3 py-2 rounded-md hover:bg-gray-900 font-semibold text-yellow-400" onClick={() => setIsOpen(false)}>Admin</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
