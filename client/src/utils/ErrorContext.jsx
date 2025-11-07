/* eslint-disable react-refresh/only-export-components */
// contexts/ErrorContext.jsx
import React, { createContext, useContext, useState } from 'react';
import ErrorModal from '../components/ErrorModal';

const ErrorContext = createContext();

export const useError = () => useContext(ErrorContext);

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);

  const showError = (err) => {
    setError(err);
  };

  const clearError = () => setError(null);

  const retry = () => {
    clearError();
    window.location.reload(); // or retry specific API
  };

  return (
    <ErrorContext.Provider value={{ showError, clearError }}>
      {children}
      <ErrorModal
        error={error}
        onRetry={retry}
        onClose={clearError}
        isOpen={!!error}
      />
    </ErrorContext.Provider>
  );
};