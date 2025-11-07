/* eslint-disable no-unused-vars */
// src/components/LoginForm.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import ImageLoadingSpinner from '../../utils/Loading';
import GoogleAutoModal from "./GoogleAutoModal"
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../utils/cn';

const LoginForm = () => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showFullLoader, setShowFullLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors');
      return;
    }

    setIsLoading(true);
    setShowFullLoader(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/login`, formData);

      toast.success('Welcome back!', {
        description: `Hi ${res.data.user.first_name || 'there'}! You're logged in.`,
        duration: 4000,
      });

      // Save token & redirect
      localStorage.setItem('token', res.data.token);
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } catch (error) {
      const msg = error.response?.data?.message || 'Invalid email or password';
      toast.error('Login failed', { description: msg, duration: 5000 });
    } finally {
      setIsLoading(false);
      setShowFullLoader(false);
    }
  };

  const handleGoogleLogin = () => {
    setShowFullLoader(true);
    // Replace with your actual Google OAuth URL
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`;
  };

  if (showFullLoader) {
    return <ImageLoadingSpinner fullScreen text="Signing you in..." size="lg" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'max-w-md w-full mx-auto p-8 rounded-2xl shadow-xl',
        isDark ? 'bg-[#090909FF] border border-green/20' : 'bg-white border border-gray-200'
      )}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">
          {isDark ? <span className="text-green">Welcome</span> : <span className="text-gray-900">Welcome</span>} Back
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Log in to manage your finances
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={cn(
              'w-full px-4 py-3 rounded-xl border focus:ring-4 focus:outline-none transition',
              errors.email
                ? 'border-red-500 focus:ring-red-500'
                : isDark
                ? 'bg-gray-800 border-gray-600 focus:ring-green/50 text-white'
                : 'bg-gray-50 border-gray-300 focus:ring-green/50'
            )}
            placeholder="john@example.com"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Password with Eye */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={cn(
                'w-full px-4 py-3 pr-12 rounded-xl border focus:ring-4 focus:outline-none transition',
                errors.password
                  ? 'border-red-500 focus:ring-red-500'
                  : isDark
                  ? 'bg-gray-800 border-gray-600 focus:ring-green/50 text-white'
                  : 'bg-gray-50 border-gray-300 focus:ring-green/50'
              )}
              placeholder="Enter your password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-gray-500" />
              ) : (
                <Eye className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.password}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-white transition',
            isLoading ? 'bg-gray-500' : 'bg-green hover:bg-green/90'
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Log In
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </motion.button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className={cn('w-full border-t', isDark ? 'border-gray-700' : 'border-gray-300')} />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className={cn('px-2', isDark ? 'bg-[#090909FF]' : 'bg-white', 'text-gray-500')}>
            or continue with
          </span>
        </div>
      </div>

      {/* Google Login Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setGoogleModalOpen(true)}
      
        className={cn(
          'w-full flex items-center justify-center gap-3 py-3 px-6 rounded-xl font-medium transition',
          'border-2',
          isDark
            ? 'border-gray-700 bg-gray-800 hover:bg-gray-700 text-white'
            : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-900'
        )}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with E-auth
      </motion.button>

        <GoogleAutoModal
        isOpen={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
      />

      {/* Footer */}
      <p className="text-center text-sm mt-6">
        Don't have an account?{' '}
        <a href="/sign-up" className="font-medium text-green hover:text-green/80 transition">
          Sign up
        </a>
      </p>
    </motion.div>
  );
};

export default LoginForm;






































// // src/components/LoginForm.jsx
// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { ArrowRight, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
// import { toast } from 'sonner';
// import axios from 'axios';
// import ImageLoadingSpinner from '../../utils/Loading';
// import GoogleAutoLoginModal from './GoogleAutoLoginModal'; // ← NEW
// import { useTheme } from '../../contexts/ThemeContext';
// import { cn } from '../../utils/cn';

// const LoginForm = () => {
//   const { isDark } = useTheme();
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [showFullLoader, setShowFullLoader] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [googleModalOpen, setGoogleModalOpen] = useState(false); // ← NEW

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.email.trim()) newErrors.email = 'Email is required';
//     else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
//     if (!formData.password) newErrors.password = 'Password is required';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return toast.error('Fix errors');

//     setIsLoading(true);
//     setShowFullLoader(true);

//     try {
//       const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/login`, formData);
//       localStorage.setItem('token', res.data.token);
//       toast.success('Logged in!');
//       setTimeout(() => { window.location.href = '/dashboard'; }, 1500);
//     } catch (err) {
//       toast.error('Login failed', { description: err.response?.data?.message || 'Try again' });
//     } finally {
//       setIsLoading(false);
//       setShowFullLoader(false);
//     }
//   };

//   if (showFullLoader) return <ImageLoadingSpinner fullScreen text="Signing in..." size="lg" />;

//   return (
//     <>
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className={cn(
//           'max-w-md w-full mx-auto p-8 rounded-2xl shadow-xl',
//           isDark ? 'bg-[#090909FF] border border-green/20' : 'bg-white border border-gray-200'
//         )}
//       >
//         {/* ... (email, password fields same as before) ... */}

//         {/* Submit Button */}
//         <motion.button
//           type="submit"
//           onClick={handleSubmit}
//           disabled={isLoading}
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           className={cn(
//             'w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white',
//             isLoading ? 'bg-gray-500' : 'bg-green hover:bg-green/90'
//           )}
//         >
//           {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Signing in...</> : <>Log In <ArrowRight className="w-5 h-5" /></>}
//         </motion.button>

//         {/* Divider */}
//         <div className="relative my-6">
//           <div className="absolute inset-0 flex items-center">
//             <span className={cn('w-full border-t', isDark ? 'border-gray-700' : 'border-gray-300')} />
//           </div>
//           <div className="relative flex justify-center text-xs uppercase">
//             <span className={cn('px-2', isDark ? 'bg-[#090909FF]' : 'bg-white', 'text-gray-500')}>or</span>
//           </div>
//         </div>

//         {/* Google Button → Opens Modal */}
//         <motion.button
//           type="button"
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           onClick={() => setGoogleModalOpen(true)}
//           className={cn(
//             'w-full flex items-center justify-center gap-3 py-3 rounded-xl font-medium transition',
//             'border-2',
//             isDark
//               ? 'border-gray-700 bg-gray-800 hover:bg-gray-700 text-white'
//               : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-900'
//           )}
//         >
//           <svg className="w-5 h-5" viewBox="0 0 24 24"> {/* Google SVG */} </svg>
//           Continue with Google
//         </motion.button>

//         <p className="text-center text-sm mt-6">
//           No account? <a href="/signup" className="text-green hover:text-green/80">Sign up</a>
//         </p>
//       </motion.div>

//       {/* Google Modal */}
//       <GoogleAutoLoginModal
//         isOpen={googleModalOpen}
//         onClose={() => setGoogleModalOpen(false)}
//       />
//     </>
//   );
// };

// export default LoginForm;