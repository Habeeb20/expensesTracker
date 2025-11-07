// src/pages/Login.jsx
import React from 'react';
import LoginForm from './aut/LoginForm';

import { Toaster } from 'sonner';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-[#090909FF]">
      <LoginForm />
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
};

export default LoginPage;