import React from 'react'
import { Link } from 'react-router-dom'
import { MdLocationOn } from 'react-icons/md'

const ListingItem = ({ listing }) => {
  return (
    <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden
      rounded-lg w-full sm:w-[330px]'>
      {/* {listing.name} {console.log(listing)} */}
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0] || `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNA1SYskDolZeMbDslOQBaCIximnnOamgTit_MvJb4UQ&s=10`}
          alt='listing cover'
          className='w-full h-[320px] sm:h-[220px] object-cover hover:scale-105 transition-scale duration-300'
        />
        <div className="p-4 flex flex-col gap-2 w-full">
          <p className='truncate text-lg font-semibold text-slate-700 '>
            {listing.name}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationOn className='h-4 w-4 text-green-700' />
            <p className='text-gray-600 font-semibold truncate text-sm w-full'>
              {listing.address}</p>
          </div>

          <p className='text-gray-600 text-sm line-clamp-2 hover:scale-105 transition-scale duration-300'>
            {listing.description}
          </p>
          <p className='text-slate-500 mt-2 font-semibold '>
            {`₹`}{listing.offer ? listing.
              discountPrice.toLocaleString('en-US') :
              listing.regularPrice.toLocaleString('en-US')}
            {listing.type === 'rent' && '/month'}
          </p>

          <div className="text-slate-700 flex gap-4">
            <div className="font-bold text-xs">
              {listing.bedroom > 1 ? `${listing.bedrooms} beds` :
                `${listing.bedrooms} bed`}
            </div>
            <div className="font-bold text-xs">
              {listing.bathrooms > 1 ? `${listing.bathrooms} baths` :
                `${listing.bathrooms} bath`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ListingItem;