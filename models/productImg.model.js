const { db, DataTypes } = require('../utils/database.util');

const ProductImg = db.define('productImg', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      imgURL: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
    productid: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
		type: DataTypes.STRING,
		allowNull: false,
		defaultValue: 'active',
	},
});

module.exports = {ProductImg };