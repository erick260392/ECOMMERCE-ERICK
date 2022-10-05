// Models
const { User } = require('./user.model');
const { Product } = require('./product.model.js');
const { Order } = require('./order.model');
const { Cart } = require('./cart.model');
const { Category } = require('./category.model');
const { ProductImg } = require('./productImg.model');
const { ProductInCart } = require('./productInCart.model');

const initModels = () => {
  // 1 User <----> M Product
  User.hasMany(Product, { foreignKey: 'userId' });
  Product.belongsTo(User);
  // 1 User <----> Order
  User.hasMany(Order, { foreignKey: 'userId' });
  Order.belongsTo(User);
  //1 Order <-----> 1Cart
  Order.hasOne(Cart, { foreignKey: 'cartid' });
  Cart.belongsTo(Order);
  //1 Cart <-----> 1 User
  Cart.hasOne(User, { foreignKey: 'userId' });
  User.belongsTo(Cart);
 //1 Product <-----> 1 Category
  Product.hasOne(Category, { foreignKey: 'categoryid' });
  Category.belongsTo(Product);
  // 1 User <----> M Product
  Product.hasMany(ProductImg, { foreignKey: 'userId' });
  ProductImg.belongsTo(User);
  //1 ProductInCart <-----> 1 Product
  ProductInCart.hasOne(Product, { foreignKey: 'productid' });
  Product.belongsTo(ProductInCart);
  // 1 Cart <----> M ProductInCart
  Cart.hasMany(ProductInCart, { foreignKey: 'cartid' });
  ProductInCart.belongsTo(Cart);
};

module.exports = { initModels };
