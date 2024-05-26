import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import MainLayout from '../layouts/MainLayout';

const Login = () => {
  const { state } = useLocation();
  const redirectUrl = state?.redirectUrl || null;

  useEffect(() => {
    document.title = 'Login';
  }, []);

  return (
    <MainLayout>
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-semibold mb-6 text-center">Login</h1>
          <LoginForm redirectUrl={redirectUrl} />
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;
