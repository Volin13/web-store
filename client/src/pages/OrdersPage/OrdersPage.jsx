import React from 'react';
import { Container } from 'react-bootstrap';
import Orders from '../../components/Orders/Orders';

const OrdersPage = () => {
  return (
    <Container className="mt-3">
      <Orders />
    </Container>
  );
};

export default OrdersPage;
