const sequelize = require('../db');

module.exports = async function calculateAverageRating(deviceId) {
  try {
    const result = await sequelize.query(
      `SELECT AVG(rate) AS averageRating
       FROM Ratings
       WHERE deviceId = :deviceId`,
      {
        replacements: { deviceId },
        type: sequelize.QueryTypes.SELECT,
      },
    );
    console.log(result);
    const averageRating = result[0].averageRating || 0;
    const roundedAverage = parseFloat(averageRating.toFixed(1));

    return roundedAverage;
  } catch (error) {
    console.error('Помилка під час обчислення середнього рейтингу:', error);
    throw new Error('Помилка під час обчислення середнього рейтингу');
  }
};
