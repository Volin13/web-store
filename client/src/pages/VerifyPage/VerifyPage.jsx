import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router';
import Auth from '../../components/Auth';
import { verificateUser } from '../../http/userAPI';
import { LOGIN_ROUTE } from '../../utils/constants';

let verify = null;

const VerifyPage = () => {
  const { verificationToken } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!verificationToken) return;
    if (verificationToken === verify) return;

    verify = verificationToken;

    verificateUser(verificationToken)
      .then(() => {
        navigate(LOGIN_ROUTE);
        verify = true;
      })
      .catch(() => {
        verify = null;
      });
  }, [verificationToken, navigate]);

  return (
    <Container
      className="d-flex justify-content-center
  align-items-center"
      style={{ height: window.innerHeight - 54 }}
    >
      <Auth />
    </Container>
  );
};

export default VerifyPage;
