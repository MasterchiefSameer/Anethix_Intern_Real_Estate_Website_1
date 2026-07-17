import { useSelector } from 'react-redux'
import { useState, useRef, useEffect } from 'react'
import { supabase } from '../Auth/supabase';
// import {
//   updateUserStart,
//   updateUserSuccess,
//   updateUserFailure,
//   deleteUserFailure,
//   deleteUserStart,
//   deleteUserSuccess,
//   signOutUserStart,
// } from '../../redux/user/userSlice';
import { useDispatch } from 'react-redux';
// import { Link } from 'react-router-dom';
const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user)
  const [file, setFile] = useState(undefined);
  console.log(file); // this will print the image file on brower console
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  // console.log(formData);
  // console.log(filePerc);
  // console.log(fileUploadError);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  // UPDATED: Supabase File Upload
const handleFileUpload = async (file) => {
  try {
    setFileUploadError(false);
    setFilePerc(10);
    // setFilePerc(0);

    // Check file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      setFileUploadError(true);
      setFilePerc(0);
      return;
    }

    // Create unique filename
    const fileName = `${currentUser._id}-${Date.now()}-${file.name}`;
    // const fileName = new Date().getTime() + file.name;

    setFilePerc(50);

    // Upload to Supabase Storage Bucket 'avatars' with progress tracking
    const { data, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    // if (uploadError) {
    //   setFileUploadError(true);
    //   return;
    // }

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      setFileUploadError(true);
      setFilePerc(0);
      return;
    }

    setFilePerc(75);

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    setFormData({ ...formData, avatar: publicUrlData.publicUrl });
    setFilePerc(100);
    console.log(file.type);
    console.log(formData.avatar);
  } catch (err) {
    console.error("Unexpected upload error:", err);
    setFileUploadError(true);
    setFilePerc(0);
  }
};

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Profile</h1>
      <form className='flex flex-col items-center gap-4'>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept='image/*' />

        <img onClick={() => fileRef.current.click()}
        src={formData.avatar || currentUser.avatar} // this will show the previous image if the upload fails and chnages when successfully
        alt="profile"
        className='rounded-full h-24 w-24 object-cover cursor-pointer
        self-center mt-2'/>
        
         <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2MB)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
        <input
          type="text"
          placeholder='Username'
          id='username'
          className='border p-3 rounded-lg bg-white w-full ' />

        <input
          type="text"
          placeholder='Email'
          id='email'
          className='border p-3 rounded-lg bg-white w-full' />

        <input
          type="password"
          placeholder='Password'
          id='password'
          className='border p-3 rounded-lg bg-white w-full' />

        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95
        disabled:opacity-80 transition duration-300'>Update</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete account</span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
    </div>
  )
}

export default Profile