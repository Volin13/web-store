import React from 'react';
import { Container } from 'react-bootstrap';
import CustomersOrders from '../../components/Orders/CustomersOrders';

const CustomersOrdersPage = () => {
  return (
    <Container className="mt-3">
      <CustomersOrders />
    </Container>
  );
};
export default CustomersOrdersPage;
