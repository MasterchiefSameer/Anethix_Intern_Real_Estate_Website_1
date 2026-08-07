import Listing from '../models/listing.model.js';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

export const createListing = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'Manager') {
      return next(errorHandler(403, 'Only property managers can create listings.'));
    }
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
}
export const deleteListing = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'Manager') {
      return next(errorHandler(403, 'Only property managers can delete listings.'));
    }
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }

    if (req.user.id !== listing.userRef) {
      return next(errorHandler(401, 'You can only delete your own listings!'));
    }

    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'Manager') {
      return next(errorHandler(403, 'Only property managers can update listings.'));
    }
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    if (req.user.id !== listing.userRef) {
      return next(errorHandler(401, 'You can only update your own listings!'));
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};
// Here Listing is a model of the listing schema and req.params is used to get the id from the URL.
export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

// show all listings
export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9; // limiting the number of listings to 9.If there is no query it will be 9.
    const startIndex = parseInt(req.query.startIndex) || 0; // starting index of the listings.
    let offer = req.query.offer

    // if i search from search bar, then offer is undefined, but if i search from search option then it show false, in both cases it show false.. 
    //so we write if
    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] } // search inside the DB for offer true and false
    }

    let furnished = req.query.furnished
    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] } // search inside the DB for furnished true and false
    }

    let parking = req.query.parking;
    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] }
    }

    let type = req.query.type;
    //default behaviour of search
    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }
    // for searching purpose
    const searchTerm = req.query.searchTerm || '';

    // for sorting purpose, default behaviour
    const sort = req.query.sort || 'createdAt';
    //default behaviour
    const order = req.query.order || 'desc';

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);

  } catch (error) {
    next(error);
  }
}






