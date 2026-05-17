import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, reset } from '../store/slices/authSlice';
import { motion } from 'framer-motion';
import { Loader2, Mail, Lock, User, Building2, AlertCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Employee',
    department: '',
  });

  const { name, email, password, role, department } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isSuccess || user) {
      navigate('/dashboard');
    }
    dispatch(reset());
  }, [user, isSuccess, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(register({ name, email, password, role, department }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="glass-card rounded-3xl p-10 border-slate-800 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Create Account</h1>
            <p className="text-slate-400 mt-2">Join TrackZen Enterprise Portal</p>
          </div>

          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={onChange}
                  className="input-field pl-10 py-3 bg-slate-900/50 border-slate-800 text-white"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  className="input-field pl-10 py-3 bg-slate-900/50 border-slate-800 text-white"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  className="input-field pl-10 py-3 bg-slate-900/50 border-slate-800 text-white"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
              <select
                name="role"
                value={role}
                onChange={onChange}
                className="input-field py-3 bg-slate-900/50 border-slate-800 text-white appearance-none"
              >
                <option value="Employee">Employee</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin / HR</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Department</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="text"
                  name="department"
                  value={department}
                  onChange={onChange}
                  className="input-field pl-10 py-3 bg-slate-900/50 border-slate-800 text-white"
                  placeholder="Engineering"
                  required
                />
              </div>
            </div>

            {isError && (
              <div className="md:col-span-2 flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
                <AlertCircle size={16} />
                <span>{message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="md:col-span-2 w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-800 text-center">
            <p className="text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-500 hover:text-primary-400 font-semibold underline-offset-4 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
