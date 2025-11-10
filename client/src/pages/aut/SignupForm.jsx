/* eslint-disable no-unused-vars */
// src/components/SignupForm.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useSonner } from 'sonner';
import axios from 'axios';
import ImageLoadingSpinner from '../../utils/Loading';
import { useTheme } from '../../contexts/ThemeContext';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
const SignupForm = () => {
  const { isDark } = useTheme();
  // const { toast } = useSonner();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showFullLoader, setShowFullLoader] = useState(false);
const [showPassword, setShowPassword] = useState(null)
const navigate = useNavigate()
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors below', {
        description: 'Check your inputs and try again.',
      });
      return;
    }

    setIsLoading(true);
    setShowFullLoader(true); // Show full-screen loader

    try {
      // Simulate API call (replace with your real endpoint)
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/register`, formData);
      if(response.ok){
           window.location.href = '/login';
      }
      
      // Success toast
      toast.success('Welcome aboard!', {
        description: `Hi ${formData.first_name}! Your account is ready. Redirecting...`,
    
        duration: 4000,
      });
          navigate("/login")
     

      // Simulate redirect after 2s
      // setTimeout(() => {
      //   window.location.href = '/login';
      //   console.log('Redirect to dashboard');
      // }, 2000);

    } catch (error) {
     console.log(error)
      const message = error?.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error('Signup failed', {
        description: message,
        duration: 5000,
      });

      // Log for debugging
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
      setShowFullLoader(false);
    }
  };

  if (showFullLoader) {
    return <ImageLoadingSpinner fullScreen text="Creating your account..." size="lg" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'max-w-md w-full mx-auto p-8 rounded-2xl shadow-xl',
        isDark
          ? 'bg-[#090909FF] border border-green/20'
          : 'bg-white border border-gray-200'
      )}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">
          {isDark ? (
            <span className="text-green">Join</span>
          ) : (
            <span className="text-gray-900">Join</span>
          )}
          ExpenseTracker
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Create your account to track expenses effortlessly
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* First Name */}
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium mb-2">
            First Name
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className={cn(
              'w-full px-4 py-3 rounded-xl border focus:ring-4 focus:outline-none transition',
              errors.first_name
                ? 'border-red-500 focus:ring-red-500'
                : isDark
                ? 'bg-gray-800 border-gray-600 focus:ring-green/50 text-white placeholder-gray-400'
                : 'bg-gray-50 border-gray-300 focus:ring-green/50'
            )}
            placeholder="John"
            disabled={isLoading}
          />
          {errors.first_name && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.first_name}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="last_name" className="block text-sm font-medium mb-2">
            Last Name
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className={cn(
              'w-full px-4 py-3 rounded-xl border focus:ring-4 focus:outline-none transition',
              errors.last_name
                ? 'border-red-500 focus:ring-red-500'
                : isDark
                ? 'bg-gray-800 border-gray-600 focus:ring-green/50 text-white placeholder-gray-400'
                : 'bg-gray-50 border-gray-300 focus:ring-green/50'
            )}
            placeholder="Doe"
            disabled={isLoading}
          />
          {errors.last_name && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.last_name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={cn(
              'w-full px-4 py-3 rounded-xl border focus:ring-4 focus:outline-none transition',
              errors.email
                ? 'border-red-500 focus:ring-red-500'
                : isDark
                ? 'bg-gray-800 border-gray-600 focus:ring-green/50 text-white placeholder-gray-400'
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

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Password
          </label>
          <div className="relative">
    <input
      type={showPassword ? 'text' : 'password'} // ← toggle type
      id="password"
      name="password"
      value={formData.password}
      onChange={handleChange}
      className={cn(
        'w-full px-4 py-3 pr-12 rounded-xl border focus:ring-4 focus:outline-none transition',
        errors.password
          ? 'border-red-500 focus:ring-red-500'
          : isDark
          ? 'bg-gray-800 border-gray-600 focus:ring-green/50 text-white placeholder-gray-400'
          : 'bg-gray-50 border-gray-300 focus:ring-green/50'
      )}
      placeholder="At least 6 characters"
      disabled={isLoading}
    />
    
    {/* Eye Toggle Button */}
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className={cn(
        'absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-all',
        'hover:bg-gray-200 dark:hover:bg-gray-700',
        'focus:outline-none focus:ring-2 focus:ring-green/50'
      )}
      aria-label={showPassword ? 'Hide password' : 'Show password'}
      tabIndex={-1}
    >
      <motion.div
        initial={false}
        animate={{ scale: showPassword ? 1 : 0.9 }}
        transition={{ duration: 0.2 }}
      >
        {showPassword ? (
          <EyeOff className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        ) : (
          <Eye className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        )}
      </motion.div>
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
          whileHover={!isLoading ? { scale: 1.02 } : {}}
          whileTap={!isLoading ? { scale: 0.98 } : {}}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold transition-all duration-200',
            isLoading
              ? 'cursor-not-allowed bg-gray-400 dark:bg-gray-600'
              : isDark
              ? 'bg-green hover:bg-green/90 text-[#090909FF]'
              : 'bg-green hover:bg-green/90 text-white'
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating Account...
            </>
          ) : (
            <>
              Sign Up
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </motion.button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className={cn(
            'w-full border-t',
            isDark ? 'border-gray-700' : 'border-gray-300'
          )} />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className={cn(
            'px-2 bg-white dark:bg-[#090909FF] text-gray-500 dark:text-gray-400'
          )}>
            or continue with
          </span>
        </div>
      </div>

      {/* Footer Link */}
      <p className="text-center text-sm">
        Already have an account?{' '}
        <a href="/login" className="font-medium text-green hover:text-green/80 transition">
          Sign in
        </a>
      </p>
    </motion.div>
  );
};

export default SignupForm;
















































