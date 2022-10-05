// Models
const { Product } = require('../models/product.model');
const { Category } = require('../models/category.model');
const { User } = require('../models/user.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');
const { uploadProductImgs } = require('../utils/firebase.util');

const getAllProducts = catchAsync(async (req, res) => {
  const products = await Product.findAll({
    where: { status: 'active' },
    include: [
      { model: Category, attributes: ['name'] },
      { model: User, attributes: ['username', 'email'] },
    ],
  });

  // If products doesn't exist, send error message
  if (!products) {
    return next(new AppError('Orders not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { products },
  });
});

const createProduct = catchAsync(async (req, res) => {
  const { sessionUser } = req;
  const { title, description, quantity, price, categoryId } = req.body;

  const newProduct = await Product.create({
    title,
    description,
    quantity,
    categoryId,
    price,
    userId: sessionUser.id,
  });

  await uploadProductImgs(req.files, newProduct.id);

  res.status(201).json({ newProduct });
});

const getProductById = catchAsync(async (req, res) => {
  const { product } = req;

  res.status(200).json({ product });
});

const updateProduct = catchAsync(async (req, res) => {
  const { product } = req;
  const { title, description, quantity, price } = req.body;

  await product.update({ title, description, quantity, price });

  res.status(200).json({ status: 'success' });
});

const deleteProduct = catchAsync(async (req, res) => {
    const { product } = req;
  
    await product.update({ status: 'removed' });
  
    res.status(200).json({ status: 'success' });
  });

module.exports = {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct
};
