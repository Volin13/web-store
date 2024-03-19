import React from 'react';
import { useParams } from 'react-router';
import { loginWithGoogle } from '../../http/userAPI';

const GoogleAuth = () => {
  const { googleAuthToken } = useParams();
  loginWithGoogle(googleAuthToken);
  return <div>Login User with Google</div>;
};

export default GoogleAuth;
