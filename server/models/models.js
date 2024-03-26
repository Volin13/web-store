const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  googlePassword: { type: DataTypes.STRING },
  login: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
  },
  avatar: {
    type: DataTypes.STRING,
    defaultValue:
      'https://res.cloudinary.com/dwgpcl0nu/image/upload/default/6e65aca7b2a0f2037067099ae5b16594.jpg',
    allowNull: false,
  },
  role: { type: DataTypes.STRING, defaultValue: 'USER' },
  byGoogle: { type: DataTypes.BOOLEAN, defaultValue: false },
  verify: { type: DataTypes.BOOLEAN, defaultValue: false },
  verificationToken: { type: DataTypes.STRING, defaultValue: '' },
  passwordResetStage: { type: DataTypes.STRING, defaultValue: '' },
  passwordResetTime: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  timeSinceLastDBSecureRequest: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  userDeviceInfo: { type: DataTypes.STRING, defaultValue: '' },
  accessToken: { type: DataTypes.STRING, defaultValue: '' },
  refreshToken: { type: DataTypes.STRING, defaultValue: '' },
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

const Comment = sequelize.define('comments', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  login: { type: DataTypes.STRING, unique: true, defaultValue: 'USER' },
  avatar: { type: DataTypes.STRING, allowNull: false },
  deviceId: { type: DataTypes.INTEGER, allowNull: false },
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
  login: { type: DataTypes.STRING, unique: true, defaultValue: 'USER' },
  avatar: { type: DataTypes.STRING, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [1, 255], // Мінімальна та максимальна довжина тексту реплая
    },
  },
});
User.addHook('afterUpdate', async user => {
  // Отримання всіх коментарів та реплік, які належать цьому користувачеві
  const comments = await Comment.findAll({ where: { userId: user.id } });
  const replies = await Reply.findAll({ where: { userId: user.id } });

  // Оновлення даних про аватар та логін у всіх коментарях та репліках
  await Promise.all(
    comments.map(async comment => {
      await comment.update({ avatar: user.avatar, login: user.login });
    }),
  );

  await Promise.all(
    replies.map(async reply => {
      await reply.update({ avatar: user.avatar, login: user.login });
    }),
  );
});

const Basket = sequelize.define('baskets', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  order: { type: DataTypes.JSON },
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

Device.hasMany(DeviceImages, { as: 'deviceImages' });
DeviceImages.belongsTo(Device);

Device.hasMany(DeviceInfo, { as: 'info' });
DeviceInfo.belongsTo(Device);

Device.hasMany(Comment);
Comment.belongsTo(Device);

Device.hasMany(BasketDevice);
BasketDevice.belongsTo(Device);

Comment.belongsTo(User);
User.hasMany(Comment);

Comment.belongsTo(Device);
Device.hasMany(Comment);

Comment.hasMany(Reply, { as: 'reply' });
Reply.belongsTo(Comment);

Reply.belongsTo(User);
User.hasMany(Reply);

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
