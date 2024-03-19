import Auth from '../../components/Auth';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postResetPassword, postSetNewPassword } from '../../http/userAPI';
import { toast } from 'react-toastify';
import { LOGIN_ROUTE } from '../../utils/constants';

const ResetPasswordPage = () => {
  const { resetEmailToken } = useParams();
  const [token, setToken] = useState('');
  const navigate = useNavigate();
  const userCurrentEmail = '';
  useEffect(() => {
    if (!resetEmailToken) return;

    postResetPassword({
      email: userCurrentEmail,
      resetEmailToken: resetEmailToken,
    })
      .then(({ resetPasswordToken }) => {
        // localStorage.setItem('token', JSON.stringify(resetPasswordToken));
        setToken(resetPasswordToken);
      })
      .catch(error => {
        console.log(error.message);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmitResetPassword = password => {
    postSetNewPassword({
      email: userCurrentEmail,
      password: password,
      // resetPasswordToken: JSON.parse(localStorage.getItem('token')),
      resetPasswordToken: token,
    });
    toast.success('Your password was change');
    navigate(LOGIN_ROUTE);
  };

  return (
    <div>
      <Auth onSubmitResetPassword={onSubmitResetPassword} />
    </div>
  );
};

export default ResetPasswordPage;
