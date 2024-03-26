import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Context } from '../..';
import Spinner from '../../components/UI/UX/Spinner/Spinner';
import { loginWithGoogle } from '../../http/userAPI';
import { SHOP_ROUTE } from '../../utils/constants';

const GoogleAuth = () => {
  const [loading, setLoading] = useState(true);
  const { googleAuthToken } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(Context);
  useEffect(() => {
    const authenticateWithGoogle = async () => {
      try {
        const data = await loginWithGoogle(googleAuthToken);
        if (data) {
          user.setUser(data);
          user.setUserLogin(data.user.login);
          user.setEmail(data.user.email);
          user.setAvatar(data.user.avatar);
          user.setIsAuth(true);
          navigate(SHOP_ROUTE);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    authenticateWithGoogle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div>{loading && <Spinner />}</div>;
};

export default GoogleAuth;
