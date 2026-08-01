// Search functionality page, The user can search for listings based on various criteria
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ListingItem from './ListingItem';

const Search = () => {
  const navigate = useNavigate();
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
      setSidebardata({ ...sidebardata, type: e.target.id })
    }

    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value })
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]: e.target.checkbox ? e.target.checked : e.target.value
      })
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';
      const order = e.target.value.split('_')[1] || 'desc';
      setSidebardata({ ...sidebardata, sort, order });
    }
  }

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
      })
    }


    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true)
      } else {
        setShowMore(false)
      }
      setListings(data);
      setLoading(false);
    }
    fetchListings();
  }, [location.search]);

  return (
    <div className='flex flex-col md:flex-row '>
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          <div className="flex items-center gap-3">
            <label
              className='whitespace-nowrap'>
              Search Term:
            </label>
            <input
              type='text'
              id='searchTerm'
              placeholder='Search...'
              className='border rounded-lg p-3 w-full bg-white'
              onChange={handleChange}
            />
          </div>
          <div className='flex gap-3 flex-wrap items-center '>
            <label className='font-semibold'>Type:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.type === 'all'} //
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.type === 'rent'}
              /> <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.type === 'sale'}
              /> <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.offer}
              /> <span>Offer</span>
            </div>
          </div>

          <div className='flex gap-3 flex-wrap items-center'>
            <label className='font-semibold'>Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.parking}
              /> <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.furnished}
              /> <span>Furnished</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className='font-semibold'>Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={'created_at_desc'}
              id="sort_order"
              className='border rounded-lg p-3 bg-white'>
              <option value="regularPrice_desc">Price: High to Low</option>
              <option value="regularPrice_asc">Price: Low to High</option>
              <option value="createdAt_desc">Newest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button
            className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'
          >
            Search
          </button>
        </form>
      </div>
      <div className='flex-1'>
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
          Listing results:
        </h1>
        <div className='p-7 flex flex-wrap gap-3'>
          {!loading && listings.length === 0 && (
            <p className='text-xl text-slate-800 '>
              No listings found!
            </p>
          )}
          {loading && (
            <p className='text-xl text-shadow-slate-700 text-center w-full'>
              Loading...
            </p>
          )}
          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))
          }
          {showMore && (
            <button
              onClick={onShowMoreClick}
              className='text-green-700 text-center w-full hover:underline p-7'
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Search















