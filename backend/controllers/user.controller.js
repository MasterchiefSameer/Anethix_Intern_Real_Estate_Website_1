import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import Listing from "../models/listing.model.js";

export const test = (req, res) => {
  // res.send("Hello World");
  res.json({
    message: "Api route is working!",
  });
};


export const updateUser = async (req, res, next) => {
  //req.user.id is from the middleware verifyToken.js
  //req.params.id is from the router.post('/update/:id', ...)
  if (req.user.id !== req.params.id) return next(errorHandler(401, 'You can only update your own profile'));

  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      $set: {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        avatar: req.body.avatar,
      }
    }, { new: true });

    const { password, ...rest } = updatedUser._doc

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  //req.user.id is from the middleware verifyToken.js
  //req.params.id is from the router.post('/delete/:id', ...)
  if (req.user.id !== req.params.id) return next(errorHandler(401, 'You can only delete your own profile'));

  try {
    //deleteUser then delete their cookie also
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie('access_token');
    res.status(200).json('User deleted successfully');
  } catch (error) {
    next(error);
  }
}
//someone is autheticated then it will get there own listing not others one
export const getUserListings = async (req, res, next) => {
  //req.user.id which we get from the cookie, get from jwt 
  //req.params.id is from the router.get("'/listings/:id'", ...)
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, 'You can only view your own listings'));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(errorHandler(404, 'User not found!'));
    // we must separate the password from the user data, then sent
    const { password: pass, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const toggleFavorite = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return next(errorHandler(404, 'User not found!'));

    const listingId = req.params.id;
    const listing = await Listing.findById(listingId);
    if (!listing) return next(errorHandler(404, 'Listing not found!'));

    const isFavorited = user.favorites.includes(listingId);
    if (isFavorited) {
      user.favorites = user.favorites.filter((id) => id.toString() !== listingId);
    } else {
      user.favorites.push(listingId);
    }
    await user.save();

    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const getFavorites = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can only view your own favorites'));
  }
  try {
    const user = await User.findById(req.params.id).populate('favorites');
    if (!user) return next(errorHandler(404, 'User not found!'));
    res.status(200).json(user.favorites);
  } catch (error) {
    next(error);
  }
};


