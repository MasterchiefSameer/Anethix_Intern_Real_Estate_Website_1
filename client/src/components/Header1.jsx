import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { User, Heart, LogOut, Scale, Sun, Moon, House } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '../pages/Additional/Theme';
import {
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure
} from '../redux/user/userSlice';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
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
    <header className='bg-[#eae6e1] dark:bg-[#1a1816] text-slate-700 dark:text-gray-300 border-b border-slate-300/40 dark:border-[#2d2a26] transition-colors duration-250 shadow-sm z-50 sticky top-0 backdrop-blur-md'>
      <div className='flex justify-between items-center max-w-7xl mx-auto p-4'>
        
        {/* Brand Logo */}
        <Link to='/' className='flex items-center gap-2.5 shrink-0'>
          <div className='bg-[#1b4332] text-white p-1.5 rounded-lg'>
            <House size={16} />
          </div>
          <div className='flex flex-col leading-none'>
            <span className='font-bold text-slate-800 dark:text-white text-base tracking-tight'>Anethix</span>
            <span className='text-[#3ba264] font-extrabold tracking-widest text-[8px] uppercase mt-0.5'>Real Estate</span>
          </div>
        </Link>

        {!isAuthPage && (
          <>
            {/* Search Bar */}
            <form
              onSubmit={handleSubmit}
              className='bg-[#dfd9d0] dark:bg-[#24211e] border dark:border-[#3e3a35] px-3.5 py-2 rounded-lg flex items-center shadow-inner'
            >
              <input
                type='text'
                placeholder='Search...'
                className='bg-transparent focus:outline-none w-24 sm:w-64 text-sm text-slate-800 dark:text-gray-200 placeholder-slate-500 dark:placeholder-gray-500'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type='submit'>
                <FaSearch className='text-slate-600 dark:text-gray-400 w-3.5 h-3.5 hover:scale-105 transition' />
              </button>
            </form>

            {/* Navigation Lists */}
            <ul className='flex gap-4 sm:gap-6 items-center'>
              <Link to='/'>
                <li className='hidden sm:inline text-sm font-semibold hover:text-[#3ba264] transition'>
                  Home
                </li>
              </Link>
              <Link to='/about'>
                <li className='hidden sm:inline text-sm font-semibold hover:text-[#3ba264] transition'>
                  About
                </li>
              </Link>
              <Link to='/contact'>
                <li className='hidden sm:inline text-sm font-semibold hover:text-[#3ba264] transition'>
                  Contact
                </li>
              </Link>

              {/* Utility Icons */}
              <div className='flex gap-3 items-center border-l border-slate-300/60 dark:border-gray-800 pl-4'>
                {/* Compare Properties */}
                {/* <Link 
                  to='/contact' 
                  title="Compare Properties"
                  className='text-slate-600 hover:text-[#3ba264] dark:text-gray-400 dark:hover:text-[#3ba264] transition hover:scale-105'
                >
                  <Scale size={18} />
                </Link> */}

                {/* Favorites Shortcut */}
                <Link 
                  to='/profile?tab=favorites' 
                  title="Favorites"
                  className='text-slate-600 hover:text-[#3ba264] dark:text-gray-400 dark:hover:text-[#3ba264] transition hover:scale-105'
                >
                  <Heart size={18} />
                </Link>

                {/* Theme Toggle Button */}
                <button
                  type="button"
                  onClick={toggleTheme}
                  title="Toggle Theme"
                  className='text-slate-600 hover:text-[#3ba264] dark:text-gray-400 dark:hover:text-[#3ba264] transition hover:scale-105 cursor-pointer p-0.5'
                >
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </div>

              {currentUser ? (
                <div className='relative user-dropdown-container flex items-center'>
                  <img
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className='rounded-full h-8 w-8 object-cover cursor-pointer border border-gray-300 hover:scale-105 transition shadow-sm'
                    src={currentUser.avatar}
                    alt='profile'
                  />
                  {dropdownOpen && (
                    <div className='absolute right-0 top-10 w-48 bg-white dark:bg-[#24211e] border border-gray-100 dark:border-[#3d3a36] shadow-lg rounded-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150'>
                      <Link
                        to='/profile?tab=settings'
                        onClick={() => setDropdownOpen(false)}
                        className='flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-[#2d2a26] transition w-full text-left font-medium'
                      >
                        <User size={16} className='text-slate-400' />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        to='/profile?tab=favorites'
                        onClick={() => setDropdownOpen(false)}
                        className='flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-[#2d2a26] transition w-full text-left font-medium'
                      >
                        <Heart size={16} className='text-slate-400' />
                        <span>Favorites</span>
                      </Link>

                      <hr className='my-1 border-gray-100 dark:border-gray-800' />

                      <button
                        type="button"
                        onClick={handleSignOut}
                        className='flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-[#2d2a26]/50 transition w-full text-left font-semibold cursor-pointer'
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to='/sign-in'>
                  <button 
                    type='button' 
                    className='bg-[#1b4332] hover:bg-[#2d5a45] text-white px-4 py-1.5 rounded-lg font-semibold text-xs uppercase tracking-wider transition shadow-sm cursor-pointer border border-[#2d5a45]'
                  >
                    Sign In
                  </button>
                </Link>
              )}
            </ul>
          </>
        )}
      </div>
    </header>
  );
}