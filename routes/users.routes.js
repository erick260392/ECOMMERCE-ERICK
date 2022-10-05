const express = require('express');

// Controllers
const {
  createUser,
  updateUser,
  deleteUser,
  login,
  getUserProducts,
  getOrderById,
  getAllOrders,
} = require('../controllers/users.controller');

// Middlewares
const { userExists } = require('../middlewares/users.middlewares');
const {
  protectSession,
  protectUsersAccount,
} = require('../middlewares/auth.middlewares');
const {
  createUserValidators,
} = require('../middlewares/validators.middlewares');

const usersRouter = express.Router();

usersRouter.post('/', createUserValidators, createUser);

usersRouter.post('/login', login);

// Protecting below endpoints
usersRouter.use(protectSession);

usersRouter.get('/me', getUserProducts);

usersRouter.patch('/:id', userExists, protectUsersAccount, updateUser);

usersRouter.delete('/:id', userExists, protectUsersAccount, deleteUser);

usersRouter.get('/orders', getAllOrders);

usersRouter.get('/orders:id', getOrderById);

module.exports = { usersRouter };
