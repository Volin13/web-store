import React from 'react';
import { Container } from 'react-bootstrap';
import Basket from '../../components/basket/Basket';

const BasketPage = () => {
  return (
    <Container className="d-flex flex-column">
      <Basket />
    </Container>
  );
};

export default BasketPage;
