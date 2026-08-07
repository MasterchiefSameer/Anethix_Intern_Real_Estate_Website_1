// PROPERTY DETAILS PAGE

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector, useDispatch } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { updateUserSuccess } from '../../redux/user/userSlice';
import PropertyContact from './PropertyContact';
import EMICalculator from '../../components/EMICalculator';

// https://sabe.io/blog/javascript-format-numbers-commas#:~:text=The%20best%20way%20to%20format,format%20the%20number%20with%20commas.

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const isFavorited = currentUser && currentUser.favorites && currentUser.favorites.includes(listing?._id);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        // console.log('the params is ', params.listingId); //for debugging, it shows the listing id from the url
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  const handleFavoriteToggle = async () => {
    if (!currentUser) {
      toast.error("Please sign in to favorite properties!");
      return;
    }
    if (currentUser.role === 'Manager') {
      toast.error("Managers cannot favorite listings.");
      return;
    }
    try {
      const res = await fetch(`/api/user/favorite/${listing._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (data.success === false) {
        toast.error(data.message || "Failed to update favorites");
        return;
      }
      dispatch(updateUserSuccess(data));
      if (data.favorites.includes(listing._id)) {
        toast.success("Listing saved to favorites!");
      } else {
        toast.success("Listing removed from favorites.");
      }
    } catch (error) {
      toast.error("Error updating favorites list");
    }
  };

  return (
    <main className='bg-slate-50 dark:bg-[#12100e] text-slate-800 dark:text-gray-200 transition-colors duration-250 min-h-screen pb-12'>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && (
        <p className='text-center my-7 text-2xl text-[#1b4332] font-bold'>Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='h-[550px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer shadow-md'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2 shadow-sm font-semibold text-xs text-slate-700'>
              Link copied!
            </p>
          )}
          
          {/* Split Content Column Grid */}
          <div className='flex flex-col md:flex-row max-w-6xl mx-auto p-4 my-7 gap-8 items-start'>
            {/* Left side: listing details */}
            <div className='flex-1 flex flex-col gap-5 w-full'>
              
              {/* Title & Price & Fav Heart */}
              <div className='flex justify-between items-start gap-4'>
                <h2 className='text-3xl font-extrabold text-slate-900 dark:text-white font-serif tracking-tight leading-tight flex-1'>
                  {listing.name}
                </h2>
                
                {/* Heart Favorite Trigger */}
                {currentUser && currentUser.role === 'Tenant' && listing.userRef !== currentUser._id && (
                  <button
                    type="button"
                    onClick={handleFavoriteToggle}
                    className='bg-white dark:bg-[#24211e] border border-slate-200 dark:border-[#3e3a35] hover:border-red-500 shadow-md p-3 rounded-full transition cursor-pointer hover:scale-105 shrink-0'
                  >
                    <Heart 
                      size={20} 
                      className={isFavorited ? 'text-red-500 fill-red-500' : 'text-slate-400 dark:text-gray-400'} 
                    />
                  </button>
                )}
              </div>

              {/* Pricing */}
              <div className='flex items-baseline gap-2 font-bold text-2xl text-[#3ba264]'>
                <span>
                  {listing.type === 'rent' ? 'Rent:' : 'Price:'}
                </span>
                <span>
                  ₹{listing.offer 
                    ? listing.discountPrice.toLocaleString('en-IN') 
                    : listing.regularPrice.toLocaleString('en-IN')}
                </span>
                {listing.type === 'rent' && (
                  <span className='text-xs text-slate-500 dark:text-gray-400 font-semibold'>/ month</span>
                )}
              </div>

              {/* Address */}
              <p className='flex items-center gap-2 text-slate-600 dark:text-gray-400 text-sm font-medium'>
                <FaMapMarkerAlt className='text-green-700 dark:text-[#3ba264] shrink-0' />
                <span>{listing.address}</span>
              </p>

              {/* Rent/Sale Offer Badges */}
              <div className='flex gap-3.5 mt-2'>
                <p className='bg-red-900 text-white font-semibold text-center text-xs py-2 px-4 rounded-xl min-w-[100px] uppercase shadow-sm'>
                  {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                </p>
                {listing.offer && (
                  <p className='bg-green-900 text-white font-semibold text-center text-xs py-2 px-4 rounded-xl min-w-[100px] uppercase shadow-sm'>
                    ₹{(+listing.regularPrice - +listing.discountPrice).toLocaleString('en-IN')} OFF
                  </p>
                )}
              </div>

              {/* Description */}
              <div className='border-t border-slate-100 dark:border-[#2d2a26] pt-4'>
                <h4 className='font-bold text-slate-900 dark:text-white text-base mb-2 font-serif'>Description</h4>
                <p className='text-sm leading-relaxed text-slate-600 dark:text-gray-400 font-medium'>
                  {listing.description}
                </p>
              </div>

              {/* Bed, Bath, Parking, Furnish */}
              <div className='border-t border-slate-100 dark:border-[#2d2a26] pt-4 pb-4'>
                <h4 className='font-bold text-slate-900 dark:text-white text-base mb-3.5 font-serif'>Property Amenities</h4>
                <ul className='text-green-900 dark:text-[#3ba264] font-semibold text-sm flex flex-wrap items-center gap-6'>
                  <li className='flex items-center gap-2 bg-slate-100 dark:bg-[#24211e] border dark:border-[#3e3a35] px-4 py-2 rounded-xl text-slate-700 dark:text-gray-300'>
                    <FaBed className='text-lg text-[#3ba264]' />
                    <span>{listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}</span>
                  </li>
                  <li className='flex items-center gap-2 bg-slate-100 dark:bg-[#24211e] border dark:border-[#3e3a35] px-4 py-2 rounded-xl text-slate-700 dark:text-gray-300'>
                    <FaBath className='text-lg text-[#3ba264]' />
                    <span>{listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}</span>
                  </li>
                  <li className='flex items-center gap-2 bg-slate-100 dark:bg-[#24211e] border dark:border-[#3e3a35] px-4 py-2 rounded-xl text-slate-700 dark:text-gray-300'>
                    <FaParking className='text-lg text-[#3ba264]' />
                    <span>{listing.parking ? 'Parking spot' : 'No Parking'}</span>
                  </li>
                  <li className='flex items-center gap-2 bg-slate-100 dark:bg-[#24211e] border dark:border-[#3e3a35] px-4 py-2 rounded-xl text-slate-700 dark:text-gray-300'>
                    <FaChair className='text-lg text-[#3ba264]' />
                    <span>{listing.furnished ? 'Furnished' : 'Unfurnished'}</span>
                  </li>
                </ul>
              </div>

              {/* EMI Calculator */}
              <div className='border-t border-slate-100 dark:border-[#2d2a26] pt-6'>
                <EMICalculator initialAmount={listing.offer ? listing.discountPrice : listing.regularPrice} />
              </div>

            </div>

            {/* Right side: Enquiry form for tenants */}
            {currentUser && currentUser.role === 'Tenant' && listing.userRef !== currentUser._id && (
              <div className='w-full md:w-[380px] shrink-0 md:sticky md:top-24'>
                <PropertyContact listing={listing} />
              </div>
            )}
          </div>

        </div>
      )}
    </main>
  );
}