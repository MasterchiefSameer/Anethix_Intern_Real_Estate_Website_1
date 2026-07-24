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


