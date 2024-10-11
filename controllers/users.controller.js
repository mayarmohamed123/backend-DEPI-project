const asyncWrapper = require("../middleware/asyncWrapper");
const User = require("../models/user.model");
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateJWT = require("../utils/generateJWT");

const getAllUsers = asyncWrapper(async (req, res) => {
  const query = req.query;

  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;

  const users = await User.find({}, { __v: false, password: false })
    .limit(limit)
    .skip(skip);

  res.json({ status: httpStatusText.SUCCESS, data: { users } });
});

const register = asyncWrapper(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    const error = appError.create(
      "Missing required fields",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  const passwordStr = String(password);
  const oldUser = await User.findOne({ email: email });

  if (oldUser) {
    const error = appError.create(
      "user already exists",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  // password hashing
  const hashedPassword = await bcrypt.hash(passwordStr, 10);

  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    avatar: req.file ? req.file.filename : null,
  });

  // generate JWT token
  const token = await generateJWT({
    email: newUser.email,
    id: newUser._id,
  });
  newUser.token = token;

  await newUser.save();

  res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { user: newUser } });
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    const error = appError.create(
      "Email and password are required",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  // Check if user exists
  const user = await User.findOne({ email: email });

  if (!user) {
    const error = appError.create("User not found", 404, httpStatusText.FAIL);
    return next(error);
  }

  const passwordStr = String(password);

  // Check if the password matches
  const isPasswordMatch = await bcrypt.compare(passwordStr, user.password);

  if (!isPasswordMatch) {
    const error = appError.create("Invalid password", 401, httpStatusText.FAIL);
    return next(error);
  }

  // Generate JWT token if login is successful
  const token = await generateJWT({
    email: user.email,
    id: user._id,
  });

  return res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { token },
  });
});

module.exports = {
  getAllUsers,
  register,
  login,
};
