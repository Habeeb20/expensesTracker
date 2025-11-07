// src/pages/Signup.jsx
import React from 'react';
import SignupForm from './aut/SignupForm';

import { Toaster } from 'sonner';

function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-[#090909FF]">
      <SignupForm />
      <Toaster 
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          className: 'group border-0 shadow-lg',
          descriptionClassName: 'group-data-[theme=light]:text-gray-700',
        }}
      />
    </div>
  );
}

export default SignupPage;