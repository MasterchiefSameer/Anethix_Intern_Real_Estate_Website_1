import { useSelector } from 'react-redux';
import { useState, useRef, useEffect } from 'react';
import { supabase } from '../Auth/supabase';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  Eye, 
  EyeOff, 
  User, 
  Mail, 
  Lock, 
  Camera, 
  LogOut, 
  Trash2, 
  PlusCircle, 
  Building, 
  Layout 
} from 'lucide-react';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from '../../redux/user/userSlice';
import { useDispatch } from 'react-redux';

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (showListingsError) {
      toast.error("Error showing listings!");
    }
  }, [showListingsError]);

  // UPDATED: Supabase File Upload
  const handleFileUpload = async (file) => {
    try {
      setFileUploadError(false);
      setFilePerc(0);

      // Client-side file size constraint (2MB)
      const maxBytes = 2 * 1024 * 1024;
      if (file.size > maxBytes) {
        toast.error("File too large (max 2 MB)");
        return;
      }

      const fileName = `${Date.now()}_${file.name}`;
      setFilePerc(25);

      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type // Explicit MIME-type header
        });

      setFilePerc(50);

      if (uploadError) {
        toast.error("Upload failed: " + uploadError.message);
        return;
      }

      setFilePerc(75);

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setFormData({ ...formData, avatar: publicUrlData.publicUrl });
      setFilePerc(100);
      toast.success("Image successfully uploaded!");
    } catch (err) {
      console.error("Unexpected upload error:", err);
      setFileUploadError(true);
      setFilePerc(0);
      toast.error("Unexpected upload error: " + err.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      toast.success("Profile updated successfully!");
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      toast.success("Account deleted successfully!");
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      toast.success("Successfully signed out!");
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        toast.error(data.message);
        return;
      }
      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
      toast.success("Listing deleted successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className='max-w-6xl mx-auto p-4 md:p-8 min-h-screen bg-gray-50/30'>
      <h1 className='text-3xl font-extrabold text-slate-800 tracking-tight mb-8 mt-2'>
        My Account
      </h1>
      
      <div className='flex flex-col lg:flex-row gap-8'>
        
        {/* Left Column - Profile Settings */}
        <div className='lg:w-1/3 w-full bg-white border border-gray-100 shadow-sm rounded-xl p-6 h-fit flex flex-col gap-6'>
          <div className='flex items-center justify-between border-b pb-4'>
            <div className='flex flex-col'>
              <h2 className='text-lg font-bold text-slate-800'>Profile Info</h2>
              <p className='text-xs text-slate-500'>Manage your account details</p>
            </div>
            {/* Dynamic Role Badge */}
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              currentUser.role === 'Manager' 
                ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                : 'bg-rose-50 text-rose-600 border border-rose-100'
            }`}>
              {currentUser.role || 'Tenant'}
            </span>
          </div>

          <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
            <input
              onChange={(e) => setFile(e.target.files[0])}
              type="file"
              ref={fileRef}
              hidden
              accept='image/*'
            />

            {/* Avatar Photo Frame with Hover camera overlay and circular progress outline */}
            <div className='relative w-28 h-28 mx-auto group cursor-pointer' onClick={() => fileRef.current.click()}>
              <div className={`absolute inset-0 rounded-full border-2 transition ${
                filePerc > 0 && filePerc < 100 ? 'border-blue-500' : 'border-gray-200'
              }`} />
              <img
                src={formData.avatar || currentUser.avatar}
                alt="profile"
                className='rounded-full h-full w-full object-cover p-1'
              />
              <div className='absolute inset-1 rounded-full bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300'>
                <Camera className='text-white w-6 h-6' />
              </div>
            </div>

            {/* Progress Text / Errors */}
            {filePerc > 0 && (
              <p className='text-xs text-center font-medium'>
                {filePerc < 100 ? (
                  <span className='text-slate-600'>{`Uploading: ${filePerc}%`}</span>
                ) : (
                  <span className='text-green-600'>Uploaded successfully!</span>
                )}
              </p>
            )}

            {/* Username Input with prefix icon */}
            <div>
              <label className='text-xs font-semibold text-slate-600 block mb-1'>Username</label>
              <div className='relative w-full'>
                <User className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4' />
                <input
                  type="text"
                  placeholder='Username'
                  defaultValue={currentUser.username}
                  id='username'
                  onChange={handleChange}
                  className='border border-gray-300 pl-10 pr-3 py-2.5 rounded-lg bg-white w-full text-sm outline-none focus:border-blue-500 transition'
                />
              </div>
            </div>

            {/* Email Input with prefix icon */}
            <div>
              <label className='text-xs font-semibold text-slate-600 block mb-1'>Email Address</label>
              <div className='relative w-full'>
                <Mail className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4' />
                <input
                  type="email"
                  placeholder='Email'
                  defaultValue={currentUser.email}
                  id='email'
                  onChange={handleChange}
                  className='border border-gray-300 pl-10 pr-3 py-2.5 rounded-lg bg-white w-full text-sm outline-none focus:border-blue-500 transition'
                />
              </div>
            </div>

            {/* Password Input with prefix icon and eye toggle */}
            <div>
              <label className='text-xs font-semibold text-slate-600 block mb-1'>New Password</label>
              <div className='relative w-full'>
                <Lock className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4' />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Enter new password'
                  id='password'
                  onChange={handleChange}
                  className='border border-gray-300 pl-10 pr-12 py-2.5 rounded-lg bg-white w-full text-sm outline-none focus:border-blue-500 transition'
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Update Button */}
            <button
              disabled={loading}
              className='bg-blue-600 text-white p-3 rounded-lg uppercase hover:bg-blue-700 disabled:opacity-80 transition duration-300 w-full font-semibold text-sm mt-2 cursor-pointer'
            >
              {loading ? 'Updating...' : 'Save Settings'}
            </button>
          </form>

          {/* User Account Controls Bottom Panel */}
          <div className='border-t pt-4 flex flex-col gap-3 mt-2'>
            <button 
              onClick={handleSignOut} 
              className='flex items-center gap-2 text-sm text-slate-600 hover:text-red-600 transition cursor-pointer w-full text-left font-medium'
            >
              <LogOut size={16} />
              <span>Sign out of session</span>
            </button>
            <button 
              onClick={handleDeleteUser} 
              className='flex items-center gap-2 text-sm text-slate-600 hover:text-red-600 transition cursor-pointer w-full text-left font-medium'
            >
              <Trash2 size={16} />
              <span>Delete account permanently</span>
            </button>
          </div>
        </div>

        {/* Right Column - Listings Panel */}
        <div className='lg:w-2/3 w-full bg-white border border-gray-100 shadow-sm rounded-xl p-6 flex flex-col gap-6 min-h-[500px]'>
          
          {/* Quick Statistics Header */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='border border-gray-100 bg-gray-50/50 p-4 rounded-xl flex items-center gap-3'>
              <div className='bg-blue-50 text-blue-600 p-2.5 rounded-lg'>
                <Building size={20} />
              </div>
              <div>
                <h3 className='text-xs font-semibold text-slate-500 uppercase'>Listed Properties</h3>
                <p className='text-xl font-extrabold text-slate-800'>{userListings.length}</p>
              </div>
            </div>
            <div className='border border-gray-100 bg-gray-50/50 p-4 rounded-xl flex items-center gap-3'>
              <div className='bg-rose-50 text-rose-600 p-2.5 rounded-lg'>
                <Layout size={20} />
              </div>
              <div>
                <h3 className='text-xs font-semibold text-slate-500 uppercase'>Account Role</h3>
                <p className='text-sm font-extrabold text-slate-800'>{currentUser.role || 'Tenant'}</p>
              </div>
            </div>
          </div>

          {/* Properties Listings Control Area */}
          <div className='flex items-center justify-between border-b pb-4 mt-2'>
            <div className='flex flex-col'>
              <h2 className='text-lg font-bold text-slate-800'>My Properties</h2>
              <p className='text-xs text-slate-500'>Manage your rental and sales properties</p>
            </div>
            <Link 
              className='flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg font-semibold text-xs uppercase transition'
              to="/create-listing"
            >
              <PlusCircle size={14} />
              <span>Create Listing</span>
            </Link>
          </div>

          {/* Dynamic Listings grid */}
          <div className='flex-1 flex flex-col justify-center'>
            {userListings.length === 0 ? (
              <div className='text-center py-12 flex flex-col items-center gap-4 max-w-sm mx-auto'>
                <div className='bg-slate-100 text-slate-400 p-4 rounded-full'>
                  <Building size={32} />
                </div>
                <div>
                  <h3 className='font-bold text-slate-800 text-base'>No properties loaded</h3>
                  <p className='text-xs text-slate-500 mt-1'>
                    Click the button below to fetch your listed properties or create a new one to get started.
                  </p>
                </div>
                <button 
                  onClick={handleShowListings} 
                  className='bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase transition w-full shadow-sm cursor-pointer'
                >
                  Show Listings
                </button>
              </div>
            ) : (
              <div className='flex flex-col gap-4 mt-2'>
                {userListings.map((listing) => (
                  <div
                    key={listing._id}
                    className='border border-gray-100 shadow-sm hover:shadow transition rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white'
                  >
                    <div className='flex items-center gap-4 w-full sm:flex-1'>
                      <Link to={`/listing/${listing._id}`}>
                        <img
                          src={listing.imageUrls[0]}
                          alt='listing cover'
                          className='h-16 w-24 object-cover rounded-lg border'
                        />
                      </Link>
                      <Link
                        className='text-slate-800 font-bold hover:underline truncate text-sm flex-1'
                        to={`/listing/${listing._id}`}
                      >
                        <p>{listing.name}</p>
                      </Link>
                    </div>

                    <div className='flex sm:flex-col gap-2 w-full sm:w-auto items-stretch'>
                      <Link to={`/update-listing/${listing._id}`} className='flex-1'>
                        <button className='border border-gray-300 hover:bg-gray-50 text-slate-700 px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition w-full cursor-pointer'>
                          Edit Info
                        </button>
                      </Link>
                      <button
                        onClick={() => handleListingDelete(listing._id)}
                        className='bg-red-50 hover:bg-red-100 text-red-600 px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition flex-1 cursor-pointer'
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Profile;