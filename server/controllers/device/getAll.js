const { Op } = require('sequelize');
const { Device } = require('../../models/models');

const getAll = async (req, res, next) => {
  let { brandId, typeId, query, limit, page, order } = req.query;
  order = order || [];
  page = page || 1;
  limit = limit || 8;
  const offset = page * limit - limit;

  const whereCondition = {};

  if (brandId) {
    whereCondition.brandId = brandId;
  }
  if (typeId) {
    whereCondition.typeId = typeId;
  }
  if (query) {
    whereCondition.name = {
      [Op.iLike]: `%${query}%`,
    };
  }
  // сортування девайсів
  let filterArr = [
    ['inStock', 'DESC'], // потім девайси з inStock===false
    ['discount', 'DESC'], // спочатку девайси з discount===true
    ['price', 'DESC'],
  ];
  if (order.includes('priceDesc')) {
    filterArr.unshift(['price', 'ASC']);
  }
  if (order.includes('ratingDesc')) {
    filterArr.unshift(['rating', 'DESC']);
  }
  const devices = await Device.findAndCountAll({
    where: whereCondition,
    order: filterArr,
    limit,
    offset,
  });
  return res.json(devices);
};
module.exports = getAll;
