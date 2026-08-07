import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../Auth/supabase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  Building, 
  MapPin, 
  UploadCloud, 
  Trash2, 
  Bed, 
  Bath, 
  FileText 
} from 'lucide-react';

const CreateListing = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
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

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (imageUploadError) {
      toast.error(imageUploadError);
    }
  }, [imageUploadError]);

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
        toast.success("Images uploaded successfully!");
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

  //
  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id, // sale or rent
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
      // must upload at least one image
      if (formData.imageUrls.length < 1) return setError('You must upload at least one image');
      // discounted price will be less than regular price
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
      toast.success("Listing created successfully!");
      navigate(`/listing/${data._id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div 
      className='min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat bg-fixed relative'
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80')"
      }}
    >
      {/* Blurred background overlay */}
      <div className='absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] z-0' />
      
      <div className='relative z-10 max-w-5xl mx-auto'>
        {/* Title Header Card */}
        <div className='bg-white/95 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-6 mb-8 text-left'>
          <h1 className='text-3xl font-extrabold text-slate-800 tracking-tight'>
            Create Property Listing
          </h1>
          <p className='text-sm text-slate-500 mt-1'>
            Add a new property to the marketplace by filling out the details below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col lg:flex-row gap-8'>
          
          {/* Left Column - Details Form (60%) */}
          <div className='lg:w-3/5 w-full bg-white/95 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-6 flex flex-col gap-6'>
            <div>
              <h2 className='text-lg font-bold text-slate-800 border-b pb-2 mb-4'>Property Info</h2>
            </div>

            {/* Listing Title */}
            <div>
              <label className='text-xs font-semibold text-slate-600 block mb-1'>Listing Title</label>
              <div className='relative w-full'>
                <Building className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4' />
                <input
                  type="text"
                  placeholder='e.g., Sunny Downtown Apartment'
                  className='border border-gray-300 pl-10 pr-3 py-2.5 rounded-lg bg-white w-full text-sm outline-none focus:border-blue-500 transition'
                  id='name'
                  maxLength='62'
                  minLength='10'
                  onChange={handleChange}
                  value={formData.name}
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className='text-xs font-semibold text-slate-600 block mb-1'>Description</label>
              <div className='relative w-full'>
                <FileText className='absolute left-3 top-4 text-gray-400 w-4 h-4' />
                <textarea
                  placeholder='Provide a detailed description of the property, neighborhood, amenities, etc.'
                  className='border border-gray-300 pl-10 pr-3 py-2.5 rounded-lg bg-white w-full text-sm outline-none focus:border-blue-500 transition min-h-[100px]'
                  id='description'
                  onChange={handleChange}
                  value={formData.description}
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className='text-xs font-semibold text-slate-600 block mb-1'>Address Location</label>
              <div className='relative w-full'>
                <MapPin className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4' />
                <input
                  type="text"
                  placeholder='e.g., 123 Colorado Blvd, Pasadena'
                  className='border border-gray-300 pl-10 pr-3 py-2.5 rounded-lg bg-white w-full text-sm outline-none focus:border-blue-500 transition'
                  id='address'
                  onChange={handleChange}
                  value={formData.address}
                  required
                />
              </div>
            </div>

            {/* Listing Type (Rent vs Sale Toggle Buttons) */}
            <div>
              <label className='text-xs font-semibold text-slate-600 block mb-2'>Listing Type</label>
              <div className='flex gap-4'>
                <button
                  type='button'
                  onClick={() => setFormData({ ...formData, type: 'rent' })}
                  className={`flex-1 p-3 rounded-xl border text-sm font-semibold transition text-center cursor-pointer ${
                    formData.type === 'rent'
                      ? 'bg-blue-50 border-blue-200 text-blue-600'
                      : 'bg-white border-gray-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  For Rent
                </button>
                <button
                  type='button'
                  onClick={() => setFormData({ ...formData, type: 'sale' })}
                  className={`flex-1 p-3 rounded-xl border text-sm font-semibold transition text-center cursor-pointer ${
                    formData.type === 'sale'
                      ? 'bg-blue-50 border-blue-200 text-blue-600'
                      : 'bg-white border-gray-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  For Sale
                </button>
              </div>
            </div>

            {/* Amenities Grid */}
            <div>
              <label className='text-xs font-semibold text-slate-600 block mb-2'>Amenities</label>
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                {/* Parking Spot */}
                <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-slate-50/50 transition ${
                  formData.parking ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200'
                }`}>
                  <input
                    type="checkbox"
                    id='parking'
                    onChange={handleChange}
                    checked={formData.parking}
                    className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer'
                  />
                  <span className="text-sm font-semibold text-slate-700 select-none">Parking Spot</span>
                </label>

                {/* Furnished */}
                <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-slate-50/50 transition ${
                  formData.furnished ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200'
                }`}>
                  <input
                    type="checkbox"
                    id='furnished'
                    onChange={handleChange}
                    checked={formData.furnished}
                    className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer'
                  />
                  <span className="text-sm font-semibold text-slate-700 select-none">Furnished</span>
                </label>

                {/* Offer */}
                <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-slate-50/50 transition ${
                  formData.offer ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200'
                }`}>
                  <input
                    type="checkbox"
                    id='offer'
                    onChange={handleChange}
                    checked={formData.offer}
                    className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer'
                  />
                  <span className="text-sm font-semibold text-slate-700 select-none">Special Offer</span>
                </label>
              </div>
            </div>

            {/* Specifications (Bedrooms, Bathrooms) */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='text-xs font-semibold text-slate-600 block mb-1'>Bedrooms</label>
                <div className='relative w-full'>
                  <Bed className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4' />
                  <input
                    type="number"
                    id='bedrooms'
                    min='1'
                    max='10'
                    required
                    onChange={handleChange}
                    value={formData.bedrooms}
                    className='border border-gray-300 pl-10 pr-3 py-2.5 rounded-lg bg-white w-full text-sm outline-none focus:border-blue-500 transition'
                  />
                </div>
              </div>
              
              <div>
                <label className='text-xs font-semibold text-slate-600 block mb-1'>Bathrooms</label>
                <div className='relative w-full'>
                  <Bath className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4' />
                  <input
                    type="number"
                    id='bathrooms'
                    min='1'
                    max='10'
                    required
                    onChange={handleChange}
                    value={formData.bathrooms}
                    className='border border-gray-300 pl-10 pr-3 py-2.5 rounded-lg bg-white w-full text-sm outline-none focus:border-blue-500 transition'
                  />
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4 mt-2'>
              <div>
                <label className='text-xs font-semibold text-slate-600 block mb-1'>
                  Regular Price {formData.type === 'rent' ? '(₹ / month)' : ''}
                </label>
                <div className='relative w-full'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm'>₹</span>
                  <input
                    type="number"
                    id='regularPrice'
                    min='50'
                    max='10000000'
                    required
                    onChange={handleChange}
                    value={formData.regularPrice}
                    className='border border-gray-300 pl-8 pr-3 py-2.5 rounded-lg bg-white w-full text-sm outline-none focus:border-blue-500 transition'
                  />
                </div>
              </div>

              {formData.offer && (
                <div>
                  <label className='text-xs font-semibold text-slate-600 block mb-1'>
                    Discounted Price {formData.type === 'rent' ? '(₹ / month)' : ''}
                  </label>
                  <div className='relative w-full'>
                    <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm'>₹</span>
                    <input
                      type="number"
                      id='discountPrice'
                      min='0'
                      max='10000000'
                      required
                      onChange={handleChange}
                      value={formData.discountPrice}
                      className='border border-gray-300 pl-8 pr-3 py-2.5 rounded-lg bg-white w-full text-sm outline-none focus:border-blue-500 transition'
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Media Management (40%) */}
          <div className='lg:w-2/5 w-full bg-white/95 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-6 h-fit flex flex-col gap-6'>
            <div>
              <h2 className='text-lg font-bold text-slate-800 border-b pb-2 mb-4'>Property Gallery</h2>
            </div>

            <div className='flex flex-col gap-4'>
              {/* Custom Image Upload Dropzone */}
              <div 
                onClick={() => fileInputRef.current.click()}
                className='border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-slate-50/50 transition cursor-pointer flex flex-col items-center justify-center gap-2 group'
              >
                <UploadCloud size={32} className='text-gray-400 group-hover:text-blue-500 transition' />
                <div>
                  <p className='text-sm font-semibold text-slate-700'>Click to upload images</p>
                  <p className='text-xs text-gray-400 mt-1'>Upload up to 6 images (max 4MB each)</p>
                </div>
              </div>

              <input
                onChange={(e) => setFiles(e.target.files)}
                ref={fileInputRef}
                className='hidden'
                type="file"
                id='images'
                accept='image/*'
                multiple
              />

              {files.length > 0 && (
                <p className='text-xs font-semibold text-slate-600 text-center bg-gray-50 py-1.5 rounded-lg border border-gray-100'>
                  {files.length} {files.length === 1 ? 'file' : 'files'} selected for upload
                </p>
              )}

              <button
                type='button'
                disabled={uploading}
                onClick={handleImageSubmit}
                className='w-full bg-slate-800 hover:bg-slate-900 text-white p-3 rounded-lg text-xs font-bold uppercase transition disabled:opacity-80 cursor-pointer shadow-sm border border-slate-900'
              >
                {uploading ? 'Uploading to database...' : 'Upload Photos'}
              </button>
            </div>

            {/* Uploaded Images Preview Rows */}
            {formData.imageUrls.length > 0 && (
              <div className='flex flex-col gap-3 border-t pt-4'>
                <p className='text-xs font-bold text-slate-600 uppercase tracking-wider'>Uploaded Images</p>
                <div className='flex flex-col gap-2'>
                  {formData.imageUrls.map((url, index) => (
                    <div
                      key={url}
                      className='flex justify-between p-2.5 border border-gray-100 items-center bg-gray-50/50 rounded-xl shadow-sm'
                    >
                      <div className='flex items-center gap-3'>
                        <img
                          src={url}
                          alt="listing"
                          className='w-12 h-12 object-cover rounded-lg border bg-white'
                        />
                        <span className='text-xs font-semibold text-slate-600'>
                          {index === 0 ? 'Cover Photo' : `Photo #${index + 1}`}
                        </span>
                      </div>
                      <button
                        type='button'
                        onClick={() => handleRemoveImage(index)}
                        className='p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition hover:scale-105 cursor-pointer'
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Control */}
            <button
              disabled={loading || uploading}
              className='w-full bg-green-700 hover:bg-green-800 text-white p-3 rounded-lg text-sm font-bold uppercase transition disabled:opacity-80 shadow-md cursor-pointer border border-green-800 mt-2'
            >
              {loading ? 'Creating Listing...' : 'Create Listing'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default CreateListing;