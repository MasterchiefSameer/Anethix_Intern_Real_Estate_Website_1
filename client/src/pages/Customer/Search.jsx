// Search functionality page, The user can search for listings based on various criteria
import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import ListingItem from './ListingItem';
import { Search as SearchIcon, SlidersHorizontal, ArrowUpDown, Loader2, Info } from 'lucide-react';

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'createdAt_desc',
    order: 'desc',
  });
  // show all the search parameters
  console.log(sidebardata);

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([])
  // show all the listings, from the ListingItems when div is {listing.name}
  console.log(listings);
  const [showMore, setShowMore] = useState(false);

  const handleChange = (e) => {
    if (
      e.target.id === 'all' ||
      e.target.id === 'rent' ||
      e.target.id === 'sale'
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]: e.target.checked
      });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';
      const order = e.target.value.split('_')[1] || 'desc';
      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }
  //when click show more load more listings
  const onShowMoreClick = async () => {
    //wwe want new listings, after 9 listings it will load another 9 listings 
    const numberOfListings = listings.length; //number of listings we already have
    const startIndex = numberOfListings; //start from the end of the listings we already have
    const urlParams = new URLSearchParams(location.search); //  get the search parameters
    urlParams.set('startIndex', startIndex); //set the start index
    const searchQuery = urlParams.toString(); //convert the search parameters to a string
    const res = await fetch(`/api/listing/get?${searchQuery}`); //fetch the new listings
    const data = await res.json(); //convert the response to a JSON object
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]); //add the newlisting with the previous listings
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true' || false,
        furnished: furnishedFromUrl === 'true' || false,
        offer: offerFromUrl === 'true' || false,
        sort: sortFromUrl || 'createdAt_desc',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };
    fetchListings();
  }, [location.search]);

  return (
    <div className='max-w-7xl mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-8 min-h-screen bg-gray-50/10'>
      
      {/* Left Sidebar - Filters Panel */}
      <div className='md:w-1/4 w-full bg-white border border-gray-100 shadow-sm rounded-xl p-6 h-fit md:sticky md:top-24 flex flex-col gap-6'>
        <div className='border-b pb-4 flex items-center gap-2'>
          <SlidersHorizontal className='w-4.5 h-4.5 text-slate-700' />
          <h2 className='text-lg font-bold text-slate-800'>Filters</h2>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
          {/* Search Term */}
          <div>
            <label className='text-xs font-semibold text-slate-600 block mb-1'>Keywords</label>
            <div className='relative w-full'>
              <SearchIcon className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4' />
              <input
                type='text'
                id='searchTerm'
                placeholder='Search properties...'
                className='border border-gray-300 pl-10 pr-3 py-2.5 rounded-lg bg-white w-full text-sm outline-none focus:border-blue-500 transition'
                onChange={handleChange}
                value={sidebardata.searchTerm}
              />
            </div>
          </div>

          {/* Type Options */}
          <div>
            <label className='text-xs font-semibold text-slate-600 block mb-2'>Type</label>
            <div className='flex flex-col gap-2.5'>
              <label className='flex items-center gap-2.5 cursor-pointer text-sm text-slate-600 font-medium'>
                <input
                  type="checkbox"
                  id="all"
                  className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer'
                  onChange={handleChange}
                  checked={sidebardata.type === 'all'}
                />
                <span>Rent & Sale</span>
              </label>
              <label className='flex items-center gap-2.5 cursor-pointer text-sm text-slate-600 font-medium'>
                <input
                  type="checkbox"
                  id="rent"
                  className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer'
                  onChange={handleChange}
                  checked={sidebardata.type === 'rent'}
                />
                <span>Rent Only</span>
              </label>
              <label className='flex items-center gap-2.5 cursor-pointer text-sm text-slate-600 font-medium'>
                <input
                  type="checkbox"
                  id="sale"
                  className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer'
                  onChange={handleChange}
                  checked={sidebardata.type === 'sale'}
                />
                <span>Sale Only</span>
              </label>
              <label className='flex items-center gap-2.5 cursor-pointer text-sm text-slate-600 font-medium'>
                <input
                  type="checkbox"
                  id="offer"
                  className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer'
                  onChange={handleChange}
                  checked={sidebardata.offer}
                />
                <span>Special Offer</span>
              </label>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className='text-xs font-semibold text-slate-600 block mb-2'>Amenities</label>
            <div className='flex flex-col gap-2.5'>
              <label className='flex items-center gap-2.5 cursor-pointer text-sm text-slate-600 font-medium'>
                <input
                  type="checkbox"
                  id="parking"
                  className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer'
                  onChange={handleChange}
                  checked={sidebardata.parking}
                />
                <span>Parking Spot</span>
              </label>
              <label className='flex items-center gap-2.5 cursor-pointer text-sm text-slate-600 font-medium'>
                <input
                  type="checkbox"
                  id="furnished"
                  className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer'
                  onChange={handleChange}
                  checked={sidebardata.furnished}
                />
                <span>Furnished</span>
              </label>
            </div>
          </div>

          {/* Sort selection */}
          <div>
            <label className='text-xs font-semibold text-slate-600 block mb-1'>Sort By</label>
            <div className='relative w-full'>
              <ArrowUpDown className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4' />
              <select
                onChange={handleChange}
                value={`${sidebardata.sort}_${sidebardata.order}`}
                id="sort_order"
                className='border border-gray-300 pl-10 pr-3 py-2.5 rounded-lg bg-white w-full text-sm outline-none focus:border-blue-500 transition appearance-none cursor-pointer'
              >
                <option value="regularPrice_desc">Price: High to Low</option>
                <option value="regularPrice_asc">Price: Low to High</option>
                <option value="createdAt_desc">Newest</option>
                <option value="createdAt_asc">Oldest</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className='w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg text-sm font-semibold uppercase transition shadow-sm cursor-pointer border border-blue-600 mt-2'
          >
            Apply Filters
          </button>
        </form>
      </div>

      {/* Right Column - Results Pane */}
      <div className='md:w-3/4 w-full flex flex-col gap-6'>
        <div className='border-b pb-4'>
          <h1 className='text-2xl font-bold text-slate-800'>Listing Results</h1>
          <p className='text-xs text-slate-500 mt-1'>Explore properties that match your filters</p>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className='flex justify-center items-center py-24 flex-grow w-full'>
            <Loader2 className='animate-spin text-blue-600 w-10 h-10' />
          </div>
        )}

        {/* Empty State */}
        {!loading && listings.length === 0 && (
          <div className='text-center py-20 flex flex-col items-center gap-4 max-w-sm mx-auto w-full'>
            <div className='bg-slate-100 text-slate-400 p-4 rounded-full'>
              <Info size={32} className='text-gray-400' />
            </div>
            <div>
              <h3 className='font-bold text-slate-800 text-base'>
                {sidebardata.offer ? 'No Offer Available Right Now' : 'No listings found'}
              </h3>
              <p className='text-xs text-slate-500 mt-1'>
                {sidebardata.offer 
                  ? 'Currently there are no special offers available. Check back later or disable the offer filter.'
                  : "We couldn't find any properties matching your current filters. Try broadening your keywords or adjusting filters."
                }
              </p>
            </div>
          </div>
        )}

        {/* Listings Flex Wrap */}
        {!loading && listings.length > 0 && (
          <div className='flex flex-wrap gap-6 justify-start w-full'>
            {listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
          </div>
        )}

        {/* Pagination Show More */}
        {showMore && !loading && (
          <div className='flex justify-center mt-6'>
            <button
              onClick={onShowMoreClick}
              className='border border-gray-300 hover:bg-gray-50 text-slate-700 px-6 py-2.5 rounded-lg text-xs font-bold uppercase transition shadow-sm cursor-pointer'
            >
              Show More Listings
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default Search;