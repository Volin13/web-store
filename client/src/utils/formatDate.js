const formatDate = date => {
  const dateObject = new Date(date);
  const formattedDate = dateObject.toLocaleString();
  return formattedDate;
};

export default formatDate;
