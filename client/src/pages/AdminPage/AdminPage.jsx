import React from 'react';
import { Container } from 'react-bootstrap';
import Admin from '../../components/Admin';

const AdminPage = () => {
  return (
    <Container className="d-flex flex-column">
      <Admin />
    </Container>
  );
};

export default AdminPage;
