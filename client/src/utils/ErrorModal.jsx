/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Wifi, WifiOff, RefreshCw } from 'lucide-react';

const ErrorModal = ({
  error,
  onRetry,
  isOpen: controlledOpen,
  onClose,
  autoClose = false,
  timeout = 8000,
}) => {
  const [isOpen, setIsOpen] = useState(controlledOpen ?? true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    setIsOpen(controlledOpen ?? !!error);
  }, [controlledOpen, error]);

  // Detect network status
  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  // Auto-close after timeout
  useEffect(() => {
    if (autoClose && isOpen) {
      const timer = setTimeout(() => {
        setIsOpen(false);
        onClose?.();
      }, timeout);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, timeout, onClose]);

  const handleRetry = () => {
    onRetry?.();
    setIsOpen(false);
  };

  const getErrorMessage = () => {
    if (!isOnline) {
      return "You're offline. Check your internet connection.";
    }

    if (typeof error === 'string') return error;

    if (error?.message) {
      return error.message.includes('Failed to fetch')
        ? 'Cannot connect to the server. Please try again.'
        : error.message;
    }

    if (error?.response?.data?.message) return error.response.data.message;

    return 'An unexpected error occurred. Please try again.';
  };

  const getErrorTitle = () => {
    if (!isOnline) return 'No Internet Connection';
    if (error?.response?.status >= 500) return 'Server Error';
    if (error?.response?.status === 404) return 'Not Found';
    if (error?.response?.status === 401) return 'Unauthorized';
    return 'Oops! Something went wrong';
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-6 pb-4">
              <div className="flex items-start gap-4">
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                    !isOnline
                      ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
                      : 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300'
                  }`}
                >
                  {!isOnline ? (
                    <WifiOff className="w-6 h-6" />
                  ) : (
                    <AlertCircle className="w-6 h-6" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {getErrorTitle()}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {getErrorMessage()}
                  </p>
                </div>
              </div>
            </div>

            {/* Body - Optional Debug */}
            {import.meta.env.NODE_ENV === 'development' && error && (
              <div className="px-6 pb-3">
                <details className="text-xs text-gray-500 dark:text-gray-400">
                  <summary className="cursor-pointer hover:text-gray-700 dark:hover:text-gray-200">
                    Technical details
                  </summary>
                  <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs overflow-auto">
                    {JSON.stringify(error, null, 2)}
                  </pre>
                </details>
              </div>
            )}

            {/* Footer */}
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                {isOnline ? (
                  <>
                    <Wifi className="w-4 h-4 text-green-500" />
                    <span>Connected</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 text-red-500" />
                    <span>Offline</span>
                  </>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onClose?.();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition"
                >
                  Close
                </button>

                <button
                  onClick={handleRetry}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition shadow-md"
                >
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Retry
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ErrorModal;