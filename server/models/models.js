const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: 'USER' },
});

const Basket = sequelize.define('basket', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  order: { type: DataTypes.JSON },
});

const Order = sequelize.define('orders', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  userData: { type: DataTypes.JSON, allowNull: false },
  orderList: { type: DataTypes.JSONB, allowNull: false },
  checked: { type: DataTypes.BOOLEAN, defaultValue: false },
  declined: { type: DataTypes.BOOLEAN, defaultValue: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

const BasketDevice = sequelize.define('basketDevice', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const Device = sequelize.define('device', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  rating: { type: DataTypes.FLOAT, defaultValue: 9 },
  mainImg: { type: DataTypes.STRING, allowNull: false },
  inStock: { type: DataTypes.BOOLEAN, defaultValue: true },
  discount: { type: DataTypes.BOOLEAN, defaultValue: false },
  newPrice: { type: DataTypes.INTEGER, defaultValue: 0 },
});

const DeviceImages = sequelize.define('deviceImages', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fileName: { type: DataTypes.STRING, allowNull: false },
  deviceId: { type: DataTypes.INTEGER, allowNull: false },
});

const DeviceInfo = sequelize.define('device_info', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  deviceId: { type: DataTypes.INTEGER, allowNull: false },
});

const Type = sequelize.define('type', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const Brand = sequelize.define('brand', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});
const Rating = sequelize.define('rating', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  rate: { type: DataTypes.FLOAT, allowNull: false },
});

const Comment = sequelize.define('comment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  deviceId: { type: DataTypes.INTEGER, allowNull: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [1, 255], // Мінімальна та максимальна довжина тексту коментаря
    },
  },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

const Reply = sequelize.define('reply', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  commentId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [1, 255], // Мінімальна та максимальна довжина тексту реплая
    },
  },
});

const TypeBrand = sequelize.define('type_brand', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

User.hasOne(Basket);
Basket.belongsTo(User);

User.hasMany(Rating);
Rating.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

Device.hasMany(Rating);
Rating.belongsTo(Device);

Device.hasMany(DeviceImages);
DeviceImages.belongsTo(Device);

Device.hasMany(Comment);
Comment.belongsTo(Device);

Device.hasMany(BasketDevice);
BasketDevice.belongsTo(Device);

Device.hasMany(DeviceInfo, { as: 'info' });
DeviceInfo.belongsTo(Device);

Comment.belongsTo(User);
User.hasMany(Comment);

Comment.belongsTo(Device);
Device.hasMany(Comment);

Comment.hasMany(Reply);
Reply.belongsTo(Comment);

Reply.belongsTo(User);
User.hasMany(Reply);

Reply.belongsTo(Comment);
Comment.hasMany(Reply);

Basket.hasMany(BasketDevice);
BasketDevice.belongsTo(Basket);

Type.hasMany(Device);
Device.belongsTo(Brand);

Type.belongsToMany(Brand, { through: TypeBrand });
Brand.belongsToMany(Type, { through: TypeBrand });

module.exports = {
  User,
  Basket,
  Order,
  BasketDevice,
  Device,
  Type,
  Brand,
  Rating,
  Comment,
  Reply,
  TypeBrand,
  DeviceInfo,
  DeviceImages,
};
