import React from 'react';
import { Container } from 'react-bootstrap';
import Auth from '../../components/Auth';

const AuthPage = () => {
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

export default AuthPage;
