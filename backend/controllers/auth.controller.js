import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    try {
        await newUser.save();
        res.status(201).json('User created successfully');
    }
    catch (error) {
        // // res.status(500).json(error); //whole json error
        // res.status(500).json(error.message); //single line error
        //   next(error); // this show the more precise error.
        next(errorHandler(550, 'error from the function'));
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        // Step1: If this email is existed or not,
        const validUser = await User.findOne({ email });
        if (!validUser) return next(errorHandler(404, 'User not found!'));
        //Then check original password with hashedpassword
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET)
        const {password: pass, ...rest} = validUser._doc; // this will rest all of the validUser's property except the password. Now use this 'rest' instead of 'validUser'.
        //   res.cookie('access_token',token, {httpOnly: true, expires: new Date(Date.now() + 24 * 60 *60 * 1000) }); //24 * 60 *60 * 1000 is the expiry time of the cookie in milliseconds
        res
            .cookie('access_token',token, {httpOnly: true})
            .status(200)
            .json(rest); // now will become session based, means it will be deleted when the browser is closed.
    }
        // res.cookie('access_token',token, {httpOnly: true}).status(200).json(email); 
    catch (error) {
        next(error);
    };
};
