import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ListingItem from '../Customer/ListingItem';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';

const Favourites = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!currentUser) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/user/favorites/${currentUser._id}`);
        const data = await res.json();
        if (data.success === false) {
          toast.error(data.message || "Failed to fetch favorites");
          setLoading(false);
          return;
        }
        setFavorites(data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch favorites");
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [currentUser]);

  // Synchronize when currentUser's favorites array updates (e.g. unfavorited a card)
  useEffect(() => {
    if (currentUser && currentUser.favorites) {
      setFavorites((prev) => 
        prev.filter((listing) => currentUser.favorites.includes(listing._id))
      );
    }
  }, [currentUser]);

  if (loading) {
    return (
      <div className='flex justify-center items-center py-20 w-full'>
        <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-6 w-full'>
      <div className='border-b pb-4'>
        <h2 className='text-2xl font-bold text-slate-800'>Favorited Properties</h2>
        <p className='text-xs text-slate-500 mt-1'>Browse and manage your saved property listings</p>
      </div>

      {favorites.length === 0 ? (
        <div className='text-center py-16 flex flex-col items-center gap-4 max-w-sm mx-auto w-full'>
          <div className='bg-slate-100 text-slate-400 p-4 rounded-full'>
            <Heart size={32} className='text-gray-400' />
          </div>
          <div>
            <h3 className='font-bold text-slate-800 text-base'>No favorited properties</h3>
            <p className='text-xs text-slate-500 mt-1'>
              Start browsing listings and click the heart icon on any property to save it here.
            </p>
          </div>
          <a 
            href='/'
            className='bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase transition text-center shadow-sm w-full block'
          >
            Browse Properties
          </a>
        </div>
      ) : (
        <div className='flex flex-wrap gap-6 mt-2 justify-start w-full'>
          {favorites.map((listing) => (
            <ListingItem key={listing._id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favourites;
