import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import OAuth from './OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Tenant', // Default role
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleChange = (e) => {
    const { id, value, type } = e.target;
    
    // Support radio role buttons
    if (type === 'radio') {
      setFormData({
        ...formData,
        role: value,
      });
    } else {
      setFormData({
        ...formData,
        [id]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validations
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Destructure confirmPassword out so we don't send it to the backend database
      const { confirmPassword, ...signupData } = formData;

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        setError(data.message);
        return;
      }

      toast.success("Registration successful! Please sign in.");
      navigate('/sign-in');
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className='min-h-[85vh] flex items-center justify-center p-4 bg-gray-50/50'>
      <div className='bg-white border border-gray-100 shadow-sm rounded-xl p-8 max-w-md w-full'>
        {/* Anethix Real Estate Brand Logo & Subtitle */}
        <div className="text-left mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight">
            <span className="text-slate-800">Anethix Real </span>
            <span className="text-blue-600">Estate</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Welcome! Please sign up to continue</p>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          {/* Username */}
          <div>
            <label className='text-sm font-semibold text-slate-700 block mb-1'>Username</label>
            <input
              type="text"
              placeholder="Choose a username"
              className='border border-gray-300 p-3 rounded-lg bg-white w-full text-sm outline-none focus:border-blue-500 transition'
              id='username'
              onChange={handleChange}
              value={formData.username}
            />
          </div>

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
                placeholder="Create a password"
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

          {/* Confirm Password */}
          <div>
            <label className='text-sm font-semibold text-slate-700 block mb-1'>Confirm Password</label>
            <div className='relative w-full'>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                className='border border-gray-300 p-3 rounded-lg bg-white w-full text-sm outline-none focus:border-blue-500 transition pr-12'
                id='confirmPassword'
                onChange={handleChange}
                value={formData.confirmPassword}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none'
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Role selection radio buttons */}
          <div>
            <label className='text-sm font-semibold text-slate-700 block mb-2'>Role</label>
            <div className='flex gap-6 items-center'>
              <label className='flex items-center gap-2 cursor-pointer text-sm text-slate-600 font-medium'>
                <input
                  type="radio"
                  name="role"
                  value="Tenant"
                  checked={formData.role === 'Tenant'}
                  onChange={handleChange}
                  className='w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500'
                />
                <span>Tenant</span>
              </label>
              <label className='flex items-center gap-2 cursor-pointer text-sm text-slate-600 font-medium'>
                <input
                  type="radio"
                  name="role"
                  value="Manager"
                  checked={formData.role === 'Manager'}
                  onChange={handleChange}
                  className='w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500'
                />
                <span>Manager</span>
              </label>
            </div>
          </div>

          {/* Submit Action */}
          <button
            disabled={loading}
            className='bg-blue-600 text-white p-3 rounded-lg uppercase hover:bg-blue-700 disabled:opacity-80 transition duration-300 w-full font-semibold text-sm mt-2'
          >
            {loading ? 'Creating Account...' : 'Create Account'}
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

        {/* Switch to SignIn Link */}
        <div className='flex justify-center gap-1 mt-6 text-sm text-slate-600'>
          <p>Already have an account?</p>
          <Link to="/sign-in" className='text-blue-600 hover:underline font-semibold'>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
