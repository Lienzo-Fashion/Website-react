import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Chrome } from 'lucide-react';
// Ensure this path is correct or update it to the correct path
import { useAuthStore } from '../store/authStore';
import { Navigate, useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import SignUpForm from '../components/auth/SignUpForm';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const { user, signInWithGoogle, handleRedirectResult, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    handleRedirectResult().then(() => {
      if (user) {
        navigate('/');
      }
    }).catch(() => {
      // Error is handled by the store
    });
  }, []);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (error) {
      // Error is handled by the store
    }
  };

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-gray-900 p-8 rounded-xl"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">
            {isLogin ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-gray-400">
            {isLogin
              ? 'Sign in to access your account'
              : 'Sign up to start shopping'}
          </p>
        </div>

        {isLogin ? <LoginForm /> : <SignUpForm />}

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Chrome className="w-5 h-5" />
          <span>{isLoading ? 'Signing in...' : 'Sign in with Google'}</span>
        </button>

        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </div>

        {error && (
          <div className="text-center text-red-500 text-sm mt-4">
            {error}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default Auth;