const { db, DataTypes } = require('../utils/database.util');

const ProductInCart= db.define('productImg', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false,
	},
    cartid: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      productid: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
		type: DataTypes.STRING,
		allowNull: false,
		defaultValue: 'active',
	},
})

module.exports = { ProductInCart };