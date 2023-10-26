import React, { useState } from 'react';
import { Card, Container, Modal } from 'react-bootstrap';
import BasketList from './BasketList';
import Checkout from './Checkout';

const Basket = ({ show, onHide }) => {
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);

  const removeFromList = index => {
    const newCart = [...list];
    newCart.splice(index, 1);
    setList(newCart);
    recalculateTotal(newCart);
  };

  const recalculateTotal = cartItems => {
    const newTotal = cartItems.reduce((acc, item) => acc + item.price, 0);
    setTotal(newTotal);
  };

  return (
    <Container size="lg" show={show} onHide={onHide} centered>
      <BasketList list={list} removeCard={removeFromList} />
      <Card>
        <Card.Body>
          <span>{list.length}</span>
          <span>{total} грн.</span>
        </Card.Body>
      </Card>
      <Checkout />
    </Container>
  );
};

export default Basket;
