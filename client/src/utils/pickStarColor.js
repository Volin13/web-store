const pickStarColor = (rating = 0) => {
  let fill = 100;

  return fill - Number(rating) * 10;
};

export default pickStarColor;
