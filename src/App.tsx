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

function App() {
  const { user } = useAuthStore();

  // Define a component to handle redirection logic
  const AuthRedirect = ({ children }: { children: JSX.Element }) => {
    if (!user) {
      return <Navigate to="/auth" replace />; // Redirect to Auth if user is not logged in
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
            {/* Protect the Profile route */}
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
            {/* Auth page remains public */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/contact" element={<ContactUs />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
