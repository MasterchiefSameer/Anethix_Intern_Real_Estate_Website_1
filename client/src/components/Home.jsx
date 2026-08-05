/**
 * File: Home.jsx
 * Description: The main landing page for the application.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../pages/Customer/ListingItem';

/**
 * Component: Home
 * Description: Renders the home page content including featured properties and search.
 */
const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  // console.log(saleListings);
  console.log(rentListings);
  // console.log(offerListings);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    }

    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    }

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchOfferListings();
  }, [])
  return (
    // {/* top */}
    <div>

      <div className=" flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-slate-500'> perfect</span>
          <br />
          place with ease
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          Anethix RealEstate is the best place to find your next perfect place to live.
          find your perfect home.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link to={"/search"}>
          <button className='text-sm sm:text-base cursor-pointer text-blue-800 font-bold hover:underline'>
            Let's get started...
          </button>
        </Link>
      </div>

      {/* Swiper */}

      <Swiper navigation>
        {
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{ background: `url(${listing.imageUrls[0]})` }}
                className="bg-cover bg-center w-full h-[500px]"
              ></div>
            </SwiperSlide>
          ))
        }
      </Swiper>


      {/* listings for rent, offer and sale */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {/* For offer */}
        <div>
          <h2 className='text-2xl font-semibold text-slate-600'>
            Recent offers</h2>
          <Link to={'/search?offer=true'}>
            <h6 className='text-sm text-blue-600 hover:underline'>
              Show more offers</h6>
          </Link>
        </div>
        <div className='flex flex-wrap gap-4'>
          {offerListings.map((listing) => (
            <ListingItem listing={listing} key={listing._id} />
          ))}
        </div>
        {/* For rent */}
        <div>
          <h2 className='text-2xl font-semibold text-slate-600'>
            Recent places for rent</h2>
          <Link to={'/search?type=rent&limit=4'}>
            <h6 className='text-sm text-blue-600 hover:underline'>
              Show more places for rent</h6>
          </Link>
        </div>
        <div className='flex flex-wrap gap-4'>
          {offerListings.map((listing) => (
            <ListingItem key={listing._id} listing={listing} />
          ))}
        </div>
        {/* For sale */}
        <div>
          <h2 className='text-2xl font-semibold text-slate-600'>
            Recent places for sale</h2>
          <Link to={'/search?type=sale&limit=4'}>
            <h6 className='text-sm text-blue-600 hover:underline'>
              Show more places for sale</h6>
          </Link>
        </div>
        <div className='flex flex-wrap gap-4'>
          {offerListings.map((listing) => (
            <ListingItem key={listing._id} listing={listing} />
          ))}
        </div>

      </div>


    </div>
  )
}

export default Home