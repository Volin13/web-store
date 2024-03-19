const checkAuth = async (req, res) => {
  // перевірка ролі при логінізації/оновленню токена
  const token = generateJwt(req.user.id, req.user.email, req.user.role);
  return res.json({ token });
};

module.exports = checkAuth;
