import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, reset } from '../store/slices/authSlice';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm';
import { Button } from '../components/ui';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      // Handle error (toast or alert)
    }
    if (isSuccess || user) {
      navigate('/dashboard');
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 dark">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-10 border border-slate-700 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-lg shadow-primary-500/20">T</div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h1>
            <p className="text-slate-400 mt-2 font-medium">Enterprise Goal Management System</p>
          </div>

          <LoginForm 
            email={email}
            password={password}
            onChange={onChange}
            onSubmit={onSubmit}
            isLoading={isLoading}
            isError={isError}
            message={message}
          />

          <div className="mt-8 pt-8 border-t border-slate-800 text-center">
            <p className="text-slate-400">
              New to TrackZen?{' '}
              <Link to="/register" className="text-primary-500 hover:text-primary-400 font-semibold underline-offset-4 hover:underline">
                Request access
              </Link>
            </p>
          </div>
        </div>
        
        <p className="text-center text-slate-500 text-xs mt-8">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
