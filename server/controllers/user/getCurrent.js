const getCurrent = async (req, res) => {
  const { email, name, avatar } = req.user;
  res.json({
    email,
    name,
    avatar,
  });
};

module.exports = getCurrent;
