import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, Palette } from 'lucide-react';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

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
            <Link to="/customize" className="hover:text-gray-300 transition-colors">
              <Palette className="w-6 h-6" />
            </Link>
            <Link to="/cart" className="hover:text-gray-300 transition-colors">
              <ShoppingCart className="w-6 h-6" />
            </Link>
            <Link to="/profile" className="hover:text-gray-300 transition-colors">
              <User className="w-6 h-6" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 rounded-md hover:bg-gray-900 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="block px-3 py-2 rounded-md hover:bg-gray-900 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Shop
              </Link>
              <Link
                to="/customize"
                className="block px-3 py-2 rounded-md hover:bg-gray-900 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Customize
              </Link>
              <Link
                to="/cart"
                className="block px-3 py-2 rounded-md hover:bg-gray-900 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Cart
              </Link>
              <Link
                to="/profile"
                className="block px-3 py-2 rounded-md hover:bg-gray-900 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;