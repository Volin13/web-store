module.exports = async function calculateAverageRating(device) {
  const ratings = await device.getRatings();
  const totalRatings = ratings.length;
  if (totalRatings === 0) {
    return 0;
  }
  const sum = ratings.reduce((acc, rating) => acc + rating.rate, 0);
  return sum / totalRatings;
};
