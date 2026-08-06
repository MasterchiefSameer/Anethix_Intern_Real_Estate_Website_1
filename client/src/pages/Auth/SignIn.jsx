import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import {
  signInStart,
  signInSuccess,
  signInFailure
} from '../../redux/user/userSlice.js';
import OAuth from './OAuth.jsx';

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(signInFailure(null)); // clear any previous login error on mount
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      dispatch(signInFailure('Please fill in all fields'));
      return;
    }

    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      toast.success("Successfully signed in!");
      navigate('/');
    } catch (err) {
      dispatch(signInFailure(err.message));
    }
  };

  return (
    <div className='min-h-[80vh] flex items-center justify-center p-4 bg-gray-50/50'>
      <div className='bg-white border border-gray-100 shadow-sm rounded-xl p-8 max-w-md w-full'>
        {/* RENTIFUL Brand Logo & Subtitle */}
        <div className="text-left mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight">
            <span className="text-slate-800">Anethix Real </span>
            <span className="text-rose-500">Estate</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Welcome! Please sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          {/* Email */}
          <div>
            <label className='text-sm font-semibold text-slate-700 block mb-1'>Email</label>
            <input
              type="email"
              placeholder="Enter your email address"
              className='border border-gray-300 p-3 rounded-lg bg-white w-full text-sm outline-none focus:border-blue-500 transition'
              id='email'
              onChange={handleChange}
              value={formData.email}
            />
          </div>

          {/* Password */}
          <div>
            <label className='text-sm font-semibold text-slate-700 block mb-1'>Password</label>
            <div className='relative w-full'>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className='border border-gray-300 p-3 rounded-lg bg-white w-full text-sm outline-none focus:border-blue-500 transition pr-12'
                id='password'
                onChange={handleChange}
                value={formData.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none'
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <button
            disabled={loading}
            className='bg-blue-600 text-white p-3 rounded-lg uppercase hover:bg-blue-700 disabled:opacity-80 transition duration-300 w-full font-semibold text-sm mt-2'
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          {/* Google SSO Divider */}
          <div className="flex items-center my-1">
            <div className="border-b border-gray-200 flex-grow"></div>
            <span className="px-3 text-xs text-gray-400 uppercase">or</span>
            <div className="border-b border-gray-200 flex-grow"></div>
          </div>

          {/* Google SSO Option */}
          <OAuth />
        </form>

        {/* Switch to SignUp Link */}
        <div className='flex justify-center gap-1 mt-6 text-sm text-slate-600'>
          <p>Don't have an account?</p>
          <Link to="/sign-up" className='text-blue-600 hover:underline font-semibold'>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
