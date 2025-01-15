import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import { useAuthStore } from './store/authStore';
import Faq from './pages/Faq';
import AboutUs from './pages/AboutUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ContactUs from './pages/ContactUs';
import Categories from './pages/Categories'; 
import Terms from './pages/Terms';
// Ensure this file exists

function App() {
  const { user } = useAuthStore();

  // Component to handle redirection if the user is not authenticated
  const AuthRedirect = ({ children }: { children: JSX.Element }) => {
    if (!user) {
      return <Navigate to="/auth" replace />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            {/* Protected Route for Profile */}
            <Route
              path="/profile"
              element={
                <AuthRedirect>
                  <Profile />
                </AuthRedirect>
              }
            />
            <Route path="/faq" element={<Faq />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/categories" element={<Categories />} />
            {/* Public Auth Page */}
            <Route path="/auth" element={<Auth />} />
            {/* Catch-all Route (404) */}
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/terms" element={<Terms />} />

          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
