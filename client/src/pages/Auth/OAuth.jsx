import React, { useState } from 'react';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from './firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { User, House, X } from 'lucide-react';

const OAuth = ({ isSignUp = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleGoogleClick = async (selectedRole) => {
    try {
      setShowModal(false);
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      // console.log(result); // show in browser console
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        //   body: JSON.stringify(result),
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
          role: selectedRole,
        }),
      });
      const data = await res.json();
      // console.log(data); // show in browser console
      dispatch(signInSuccess(data));
      navigate('/'); // navigate to the home page
    } catch (error) {
      console.log('Could not sign in with google', error);
    }
  };

  const handleButtonClick = () => {
    if (isSignUp) {
      setShowModal(true);
    } else {
      handleGoogleClick(null);
    }
  };

  return (
    <>
      <button
        onClick={handleButtonClick}
        type='button'
        className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 transition duration-300 w-full font-semibold text-sm cursor-pointer'
      >
        continue with google
      </button>

      {showModal && (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200'>
          <div className='bg-white dark:bg-[#1a1816] text-slate-800 dark:text-gray-200 rounded-2xl max-w-md w-full p-6 shadow-2xl relative border dark:border-[#2d2a26] animate-in zoom-in-95 duration-200'>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className='absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition cursor-pointer'
            >
              <X size={20} />
            </button>

            <div className='text-center mb-6'>
              <h3 className='text-xl font-bold font-serif text-slate-900 dark:text-white'>Choose Account Type</h3>
              <p className='text-xs text-slate-500 dark:text-gray-400 mt-1.5'>
                Please select how you would like to join Anethix Real Estate.
              </p>
            </div>

            <div className='flex flex-col gap-4'>
              {/* Tenant Card */}
              <button
                type="button"
                onClick={() => handleGoogleClick('Tenant')}
                className='flex items-center gap-4 p-4 border border-slate-200 dark:border-[#3e3a35] hover:border-[#3ba264] dark:hover:border-[#3ba264] rounded-xl text-left hover:bg-slate-50 dark:hover:bg-[#24211e]/50 transition group cursor-pointer w-full'
              >
                <div className='bg-[#3ba264]/10 text-[#3ba264] p-3 rounded-xl group-hover:scale-105 transition'>
                  <User size={24} />
                </div>
                <div>
                  <h4 className='font-bold text-slate-900 dark:text-white text-sm'>Join as Tenant</h4>
                  <p className='text-xs text-slate-500 dark:text-gray-400 mt-0.5'>Search properties, save favorites, and contact managers.</p>
                </div>
              </button>

              {/* Manager Card */}
              <button
                type="button"
                onClick={() => handleGoogleClick('Manager')}
                className='flex items-center gap-4 p-4 border border-slate-200 dark:border-[#3e3a35] hover:border-[#3ba264] dark:hover:border-[#3ba264] rounded-xl text-left hover:bg-slate-50 dark:hover:bg-[#24211e]/50 transition group cursor-pointer w-full'
              >
                <div className='bg-[#3ba264]/10 text-[#3ba264] p-3 rounded-xl group-hover:scale-105 transition'>
                  <House size={24} />
                </div>
                <div>
                  <h4 className='font-bold text-slate-900 dark:text-white text-sm'>Join as Manager</h4>
                  <p className='text-xs text-slate-500 dark:text-gray-400 mt-0.5'>Create and manage property listings and find tenants.</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OAuth;