import React from 'react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart, 
  signInSuccess,
  signInFailure 
} from '../../redux/user/userSlice.js'
import { Link, useNavigate } from 'react-router-dom'

export default function SignIn() {
  const [formData, setFormData] = useState({}); // set up usestate to storing the data from the form
  // const [error, setError] = useState(null); // for error message
  // const [loading, setLoading] = useState(false); // for loading button 
  const { loading, error } = useSelector((state) => state.user); // show loading and error message from global state, name called user
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id] : e.target.value,
    });
  };
  // console.log(formData); //show all data in console
  const handleSubmit = async (e) => {
    e.preventDefault();
   try{
    //remove this and use signInStart
    // setLoading(true);
    dispatch(signInStart());
    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    // console.log(data); // show the database response in console of browser
     if (data.success === false) {
        // setLoading(false);
        // setError(data.message);
        dispatch(signInFailure(data.message)); //show error message
        return;
      }
      // setLoading(false);
      // setError(null);
      dispatch(signInSuccess(data)); // show data
      navigate('/');
    } catch (error) {
      // setLoading(false);
      // setError(error.message);
      dispatch(signInFailure(error.message));
    }
  };
  console.log(formData); //show all data in console of browser
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>
        Sign In
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="email"
          placeholder="Email"
          className='border p-3 rounded-lg bg-white'
          id='email'
          onChange={handleChange} 
          />
        <input type="password"
          placeholder="Password"
          className='border p-3 rounded-lg bg-white'
          id='password'
          onChange={handleChange} 
          />

        <button disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg
        uppercase hover:opacity-95 disabled:opacity-80
        transition duration-300'>{loading ? 'Creating....' : 'Sign in'}
        </button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Don't have a account?</p>
        <Link to="/sign-up">
          <span className='text-blue-700 hover:underline'>
            Sign up
          </span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>

  )
}

