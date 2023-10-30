import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { useEffect } from 'react';
import { Card, Container } from 'react-bootstrap';
import { Context } from '../..';
import BasketList from './BasketList';
import Checkout from './Checkout';

const Basket = observer(({ show, onHide }) => {
  const { basket } = useContext(Context);

  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    setList(...basket.basket);
  }, [basket]);

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
});

export default Basket;
