const pickStarColor = (rating = 10) => {
  let fill = 100;
  if (rating === '0') {
    return 0;
  }
  return fill - Number(rating) * 10;
};

export default pickStarColor;
