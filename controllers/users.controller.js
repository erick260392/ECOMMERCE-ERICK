const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Models
const { User } = require('../models/user.model');
const { Product } = require('../models/product.model');
const { Cart } = require('../models/cart.model');
const { Order } = require('../models/order.model');
// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

dotenv.config({ path: './config.env' });

// Gen random jwt signs
// require('crypto').randomBytes(64).toString('hex') -> Enter into the node console and paste the command

const getUserProducts = catchAsync(async (req, res, next) => {
  const products = await Product.findAll({
    where: { status: 'active' },
    include: [
      {
        model: User,
        required: false, // Apply OUTER JOIN
        where: { status: 'active' },
        attributes: { exclude: ['password'] },
      },
    ],
  });

  res.status(201).json({
    status: 'success',
    data: { products },
  });
});

const createUser = catchAsync(async (req, res, next) => {
  const { username, email, password, role } = req.body;

  if (role !== 'admin' && role !== 'normal') {
    return next(new AppError('Invalid role', 400));
  }

  // Encrypt the password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
    role,
  });

  // Remove password from response
  newUser.password = undefined;

  // 201 -> Success and a resource has been created
  res.status(201).json({
    status: 'success',
    data: { newUser },
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const { username, email } = req.body;
  const { user } = req;

  await user.update({ username, email });

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: 'deleted' });

  res.status(204).json({ status: 'success' });
});

const login = catchAsync(async (req, res, next) => {
  // Get email and password from req.body
  const { email, password } = req.body;

  // Validate if the user exist with given email
  const user = await User.findOne({
    where: { email, status: 'active' },
  });

  // Compare passwords (entered password vs db password)
  // If user doesn't exists or passwords doesn't match, send error
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Wrong credentials', 400));
  }

  // Remove password from response
  user.password = undefined;

  // Generate JWT (payload, secretOrPrivateKey, options)
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.status(200).json({
    status: 'success',
    data: { user, token },
  });
});

const getAllOrders = catchAsync(async (req, res) => {
  const { sessionUser } = req;

  const orders = await Order.findAll({
    where: { userid: sessionUser.id },
    include: [
      {
        model: Cart,
        where: { status: 'purchased' },
        required: false,
      },
    ],
  });

  // If orders doesn't exist, send error message
  if (!orders) {
    return next(new AppError('Orders not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { orders },
  });
});

const getOrderById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const orders = await Order.findOne({
    where: { id: id },
    include: [
      {
        model: Cart,
        where: { status: 'purchased' },
        required: false,
      },
    ],
  });

  // If orders doesn't exist, send error message
  if (!orders) {
    return next(new AppError('Orders not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { orders },
  });
});

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  login,
  getUserProducts,
  getAllOrders,
  getOrderById,
};
