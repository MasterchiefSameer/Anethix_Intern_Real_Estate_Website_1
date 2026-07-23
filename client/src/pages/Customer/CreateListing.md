import React, { useState } from 'react'
import { supabase } from '../Auth/supabase'

const CreateListing = () => {
  const [files, setFiles] = useState([]);
  console.log(files); // this will show data in browser console
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  console.log(formData);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Upload helper using Supabase Storage
  const storeImage = async (file) => {
    // client-side validation
    const maxBytes = 4 * 1024 * 1024; // 4MB
    if (file.size > maxBytes) {
      throw new Error('File too large (max 4 MB)');
    }

    const bucketName = 'listings'; // create this bucket in Supabase dashboard
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `${fileName}`;

    // upload to Supabase storage with progress tracking
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, { 
        cacheControl: '3600', 
        upsert: false,
        contentType: file.type,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          console.log('Upload is ' + progress + '% done');
        }
      });

    if (uploadError) {
      throw uploadError;
    }

    // get public URL (bucket must be public). For private buckets, use server-side signed URLs.
    const { data: publicUrlData, error: urlError } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    if (urlError) {
      throw urlError;
    }

    return publicUrlData.publicUrl;
  };

  const handleImageSubmit = (e) => {
    if (!files || files.length === 0) {
      setImageUploadError('No files selected');
      return;
    }

    if (files.length + formData.imageUrls.length > 6) {
      setImageUploadError('You can only upload 6 images per listing');
      return;
    }

    setUploading(true);
    setImageUploadError(false);

    const promises = [];
    for (let i = 0; i < files.length; i++) {
      promises.push(storeImage(files[i]));
    }

    Promise.all(promises)
      .then((urls) => {
        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.concat(urls),
        });
        // clear file input so user can reselect same files later if needed
        if (fileInputRef.current) fileInputRef.current.value = '';
        setFiles([]);
        setImageUploadError(false);
        setUploading(false);
      })
      .catch((err) => {
        console.error('Image upload error:', err);
        setImageUploadError(err.message || 'Image upload failed (2 mb max per image)');
        setUploading(false);
      });
  };
  
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Create Listing</h1>
      <form className='flex flex-col sm:flex-row gap-4 '>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type="text"
            placeholder='Name'
            className='border p-3 rounded-lg bg-white w-full'
            id='name'
            maxLength='62'
            minLength='10'
            required />

          <input
            type="text"
            placeholder='Description'
            className='border p-3 rounded-lg bg-white w-full'
            id='description'
            required />

          <input
            type="text"
            placeholder='Address'
            className='border p-3 rounded-lg bg-white w-full'
            id='address'
            required />

          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id='sale' className='w-6' />
              <span>Sell</span>
            </div>
            <div className="">
              <input type="checkbox" id='rent' className='w-6' />
              <span>Rent</span>
            </div>
            <div className="">
              <input type="checkbox" id='Parking' className='w-6' />
              <span>Parking spot</span>
            </div>
            <div className="">
              <input type="checkbox" id='furnished' className='w-6' />
              <span>Furnished</span>
            </div>
            <div className="">
              <input type="checkbox" id='offer' className='w-6' />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id='bedrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg bg-white w-full' />
              <p>Beds</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id='baths'
                min='1'
                max='10'
                className='p-3 border border-gray-300 rounded-lg focus:outline-none  bg-white w-full focus:ring-2 focus:ring-blue-500' required />
              <p>Baths</p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                id='regular'
                className='p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white w-full'
                required />
              <div className='flex flex-col items center'>
                <p>Regular Price</p>
                <span className="text-sm" >{`(₹ / month)`} </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                id='discountedPrice'
                className='p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white w-full'
                required />
              <div className='flex flex-col items center'>
                <p>Discounted Price</p>
                <span className="text-sm" >{`(₹ / month)`} </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className='font-semibold'>Images:
            <span 
            className='font-normal text-gray-600 ml-2'>
              The first image will be the cover (max 6 images)
              </span>
          </p>
          <div className='flex gap-4'>
            <input
              onChange={(e)=>setFiles(e.target.files)}
            className='p-3 border border-gray-300 rounded w-full' 
              type="file" 
              id='images' 
              accept='image/*' 
              multiple/>
            <button className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg
            disabled:opacity-80 '>Upload</button>
          </div>
          <button 
        onClick={handleImageSubmit} 
        className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:shadow-lg
        disabled:opacity-80 w-full'>
            Create Listing
          </button>
        </div>
      </form>
    </main>
  )
}

export default CreateListing