import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { User, Heart, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import {
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure
} from '../redux/user/userSlice';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const isAuthPage = location.pathname === '/sign-in' || location.pathname === '/sign-up';

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  // Click outside to close dropdown
  useEffect(() => {
    const closeDropdown = (e) => {
      if (dropdownOpen && !e.target.closest('.user-dropdown-container')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, [dropdownOpen]);

  const handleSignOut = async () => {
    try {
      setDropdownOpen(false);
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess());
      toast.success("Successfully signed out!");
      navigate('/sign-in');
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
          <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-slate-500'>Anethix Real </span>
            <span className='text-slate-700'> Estate</span>
          </h1>
        </Link>
        {!isAuthPage && (
          <>
            <form
              onSubmit={handleSubmit}
              className='bg-slate-100 p-3 rounded-lg flex items-center'
            >
              <input
                type='text'
                placeholder='Search...'
                className='bg-transparent focus:outline-none w-24 sm:w-64'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button>
                <FaSearch className='text-slate-600' />
              </button>
            </form>
            <ul className='flex gap-4 items-center'>
              <Link to='/'>
                <li className='hidden sm:inline text-slate-700 hover:underline'>
                  Home
                </li>
              </Link>
              <Link to='/about'>
                <li className='hidden sm:inline text-slate-700 hover:underline'>
                  About
                </li>
              </Link>
              <Link to='/contact'>
                <li className='hidden sm:inline text-slate-700 hover:underline'>
                  Contact
                </li>
              </Link>

              {currentUser ? (
                <div className='relative user-dropdown-container flex items-center'>
                  <img
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className='rounded-full h-8 w-8 object-cover cursor-pointer border border-gray-300 hover:scale-105 transition shadow-sm'
                    src={currentUser.avatar}
                    alt='profile'
                  />
                  {dropdownOpen && (
                    <div className='absolute right-0 top-10 w-48 bg-white border border-gray-100 shadow-lg rounded-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150'>
                      <Link
                        to='/profile?tab=settings'
                        onClick={() => setDropdownOpen(false)}
                        className='flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition w-full text-left font-medium'
                      >
                        <User size={16} className='text-slate-400' />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        to='/profile?tab=favorites'
                        onClick={() => setDropdownOpen(false)}
                        className='flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition w-full text-left font-medium'
                      >
                        <Heart size={16} className='text-slate-400' />
                        <span>Favorites</span>
                      </Link>

                      <hr className='my-1 border-gray-100' />

                      <button
                        type="button"
                        onClick={handleSignOut}
                        className='flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition w-full text-left font-semibold cursor-pointer'
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to='/sign-in'>
                  <li className='text-slate-700 hover:underline'>Sign in</li>
                </Link>
              )}
            </ul>
          </>
        )}
      </div>
    </header>
  );
}