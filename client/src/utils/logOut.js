const logout = (user, navigate, toast, route) => {
  user.setUser({});
  user.setIsAuth(false);
  user.setUserLogin('');
  user.setAvatar('');
  user.setRole('');
  user.setEmail('');
  toast.info('До зустрічі!');
  sessionStorage.removeItem('basket');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  navigate(route);
};

export default logout;
