import React, { useState, useRef } from 'react'
import { supabase } from '../Auth/supabase'

const CreateListing = () => {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  console.log(formData);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

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
        setImageUploadError(err.message || 'Image upload failed (4 mb max per image)');
        setUploading(false);
      });
  };

  // Delete images
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1) return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');
      setLoading(true);
      setError(false);
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
        return;
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
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
            onChange={handleChange}
            value={formData.name}
            required />

          <textarea
            placeholder='Description'
            className='border p-3 rounded-lg bg-white w-full'
            id='description'
            onChange={handleChange}
            value={formData.description}
            required />

          <input
            type="text"
            placeholder='Address'
            className='border p-3 rounded-lg bg-white w-full'
            id='address'
            onChange={handleChange}
            value={formData.address}
            required />

          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id='sale'
                className='w-6'
                onChange={handleChange}
                checked={formData.type === 'sale'} />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id='rent'
                className='w-6'
                onChange={handleChange}
                checked={formData.type === 'rent'} />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id='parking'
                className='w-6'
                onChange={handleChange}
                checked={formData.parking} />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id='furnished'
                className='w-6'
                onChange={handleChange}
                checked={formData.furnished} />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id='offer'
                className='w-6'
                onChange={handleChange}
                checked={formData.offer} />
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
                onChange={handleChange}
                value={formData.bedrooms}
                className='p-3 border border-gray-300 rounded-lg bg-white w-full' 
                />
              <p>Beds</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id='bathrooms'
                min='1'
                max='10'
                onChange={handleChange}
                value={formData.bathrooms}
                className='p-3 border border-gray-300 rounded-lg focus:outline-none bg-white w-full focus:ring-2 focus:ring-blue-500'
                required 
                />
              <p>Baths</p>
            </div>

            {/* Vertical column container for prices to make sure Discounted Price stacks directly under Regular Price */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  id='regularPrice'
                  min='50'
                  max='10000000'
                  onChange={handleChange}
                  value={formData.regularPrice}
                  className='p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white w-full'
                  required
                  />
                <div className='flex flex-col items-center min-w-[120px]'>
                  <p>Regular Price</p>
                  <span
                    className="text-xs text-gray-500">
                    {formData.type === 'rent' ? '(₹ / month)' : ''}
                  </span>
                </div>
              </div>

              {formData.offer && (
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    id='discountPrice'
                    min='0'
                    max='100000000'
                    onChange={handleChange}
                    value={formData.discountPrice}
                    className='p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white w-full'
                    required />
                  <div className='flex flex-col items-center min-w-[120px]'>
                    <p>Discounted Price</p>
                    <span
                      className="text-xs text-gray-500"
                    >
                      {formData.type === 'rent' ? '(₹ / month)' :
                        ''}
                    </span>
                  </div>
                </div>
              )}
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
              onChange={(e) => setFiles(e.target.files)}
              ref={fileInputRef}
              className='p-3 border border-gray-300 rounded w-full bg-white'
              type="file"
              id='images'
              accept='image/*'
              multiple />
            <button
              type='button'
              disabled={uploading}
              onClick={handleImageSubmit}
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80 font-semibold'
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          {imageUploadError && (
            <p className='text-red-700 text-sm font-semibold'>{imageUploadError}</p>
          )}
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className='flex justify-between p-3 border items-center bg-white rounded-lg shadow-sm'>
                <img
                  src={url}
                  alt="listing"
                  className='w-20 h-20 object-contain rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
          >
            {loading ? 'Creating...' : 'Create listing'}
          </button>
          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  );
}
export default CreateListing;