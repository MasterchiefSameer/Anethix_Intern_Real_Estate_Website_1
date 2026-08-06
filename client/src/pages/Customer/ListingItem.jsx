import React from 'react';
import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import { Heart } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { updateUserSuccess } from '../../redux/user/userSlice';

const ListingItem = ({ listing }) => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const isFavorited = currentUser && currentUser.favorites && currentUser.favorites.includes(listing._id);

  const handleFavoriteToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      toast.error("Please sign in to favorite properties!");
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

      const nowSaved = data.favorites.includes(listing._id);
      if (nowSaved) {
        toast.success("Listing saved to favorites!");
      } else {
        toast.success("Listing removed from favorites.");
      }
    } catch (error) {
      toast.error("Error updating favorites list");
    }
  };

  return (
    <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px] flex flex-col'>
      <Link to={`/listing/${listing._id}`} className='flex flex-col h-full'>
        {/* Card Image Container with Absolute Heart Trigger */}
        <div className='relative overflow-hidden w-full h-[320px] sm:h-[220px]'>
          <img
            src={listing.imageUrls[0] || `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNA1SYskDolZeMbDslOQBaCIximnnOamgTit_MvJb4UQ&s=10`}
            alt='listing cover'
            className='w-full h-full object-cover hover:scale-105 transition-scale duration-300'
          />
          <button
            type='button'
            onClick={handleFavoriteToggle}
            className='absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-rose-500 shadow-sm transition transform hover:scale-110 focus:outline-none'
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* Card Metadata */}
        <div className="p-4 flex flex-col gap-2 flex-grow justify-between">
          <div className='flex flex-col gap-2'>
            <p className='truncate text-lg font-semibold text-slate-700 '>
              {listing.name}
            </p>
            <div className="flex items-center gap-1">
              <MdLocationOn className='h-4 w-4 text-green-700' />
              <p className='text-gray-600 font-semibold truncate text-sm w-full'>
                {listing.address}
              </p>
            </div>

            <p className='text-gray-600 text-sm line-clamp-2 hover:scale-105 transition-scale duration-300'>
              {listing.description}
            </p>
          </div>

          <div className='flex flex-col gap-2 mt-2'>
            <p className='text-slate-500 font-semibold '>
              {`₹`}{listing.offer ? 
                listing.discountPrice.toLocaleString('en-US') : 
                listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && '/month'}
            </p>

            <div className="text-slate-700 flex gap-4 border-t pt-2 mt-1">
              <div className="font-bold text-xs">
                {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
              </div>
              <div className="font-bold text-xs">
                {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingItem;