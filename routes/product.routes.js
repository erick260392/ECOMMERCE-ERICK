const express = require('express');

// Controllers
const {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');

const {
  createCategory,
  updateCategory,
  getAllCategories,
} = require('../controllers/categories.controller');

// Middlewares

const { protectSession } = require('../middlewares/auth.middlewares');
const {
  productExists,
  protectProductOwner,
} = require('../middlewares/products.middleware');

const {
  createProductValidations,
} = require('../middlewares/validators.middlewares');

// Utils
const { upload } = require('../utils/multer.util');

const productsRouter = express.Router();

productsRouter.get('/:id', productExists, getProductById);

productsRouter.get('/categories', getAllCategories);


// Protecting below endpoints

productsRouter.use(protectSession);

productsRouter.get('/', getAllProducts);

productsRouter.post(
  '/',
  upload.array('productImgs', 5),
  createProductValidations,
  createProduct
);

productsRouter.post('/categories', createCategory);

// Protecting below endpoints

productsRouter.use(protectProductOwner);

productsRouter.patch('/:id',  updateProduct);

productsRouter.delete('/:id', deleteProduct);

productsRouter.patch('/categories/:id', updateCategory);


module.exports = { productsRouter };
