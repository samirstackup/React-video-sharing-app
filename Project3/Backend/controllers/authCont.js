import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  //since making req to mongo,req will be async
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({ ...req.body, password: hash });

    await newUser.save();
    res.status(200).send("User created");
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  //since making req to mongo,req will be async
  try {
    const user = await User.findOne({ name: req.body.name });
    if (!user) return next(createError(404, "User not found"));

    const isCorrect = await bcrypt.compare(req.body.password, user.password);

    if (!isCorrect) return next(createError(400, "Wrong credentials"));

    const token = jwt.sign({ id: user._id }, process.env.JWTKey); //id as its common identifier in mongodb
    const { password, ...others } = user._doc; //the data needed is in _doc

    res
      .cookie("access_token", token, {
        httpOnly: true, //so 3rd party users wont be able to access
      })
      .status(200)
      //   .json(user);
      .json(others); //from the spread above,to not show pw
  } catch (err) {
    next(err);
  }
};

export const googleAuth = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWTKey); //id as its common identifier in mongodb
      const { password, ...others } = user._doc; //the data needed is in _doc

      res
        .cookie("access_token", token, {
          httpOnly: true, //so 3rd party users wont be able to access
        })
        .status(200)
        //   .json(user);
        .json(user._doc); //from the spread above,to not show pw
    } else {
      const newUser = new User({
        ...req.body,
        fromGoogle: true, //from model user
      });
      const savedUser = await newUser.save();
      const token = jwt.sign({ id: savedUser._id }, process.env.JWTKey); //id as its common identifier in mongodb
      const { password, ...others } = user._doc; //the data needed is in _doc

      res
        .cookie("access_token", token, {
          httpOnly: true, //so 3rd party users wont be able to access
        })
        .status(200)
        //   .json(user);
        .json(savedUser._doc);
    }
  } catch (err) {
    next(err);
  }
};
