import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Card, Row } from 'react-bootstrap';
import BasketList from '../basket/BasketList';
import Checkout from './Checkout';
import { Context } from '../..';

const Basket = observer(() => {
  const [list, setList] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const { basket } = useContext(Context);
  const localBasket = localStorage.getItem('basket');
  const basketData = JSON.parse(localBasket);

  useEffect(() => {
    const uniqueItems = [];
    basketData.forEach(item => {
      const existingItem = uniqueItems.find(uItem => uItem.id === item.id);
      if (existingItem) {
        existingItem.count += 1;
      } else {
        uniqueItems.push({ ...item, count: 1 });
      }
    });

    setList([...uniqueItems]);
    recalculateTotal(uniqueItems);
    recalculateAmount(uniqueItems);
  }, [basket.basket.length, basketData.length, list.length]);

  const removeFromList = index => {
    const newCart = [...list];
    newCart.splice(index, 1);
    basket.setBasket(newCart);
    localStorage.setItem('basket', newCart);
    setList(newCart);

    recalculateTotal(newCart);
  };
  const addItemCount = id => {
    const listItem = list.find(item => item.id === id);
    listItem.count = +1;
    recalculateTotal(list);
    localStorage.setItem('basket', list);
  };

  const reduceItemCount = id => {
    const listItem = list.find(item => item.id === id);
    if (listItem.count > 1) {
      listItem.count = -1;
    } else {
      const removeIndex = list.indexOf(listItem);
      list.splice(removeIndex, 1);
      setList(list);
    }
    recalculateTotal(list);
    localStorage.setItem('basket', list);
  };

  const recalculateTotal = cartItems => {
    const newTotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );
    setTotalPrice(newTotal);
  };
  const recalculateAmount = cartItems => {
    const newTotal = cartItems.reduce((acc, item) => acc + item.count, 0);
    setTotalAmount(newTotal);
  };

  return (
    <div className="pb-3">
      <Row>
        <h1 className="mb-1">Кошик</h1>
      </Row>
      <Row className="text-center">
        <BasketList
          list={list}
          removeCard={removeFromList}
          add={addItemCount}
          reduce={reduceItemCount}
        />
      </Row>
      <Card bg="secondary" text="white">
        <Card.Body className="d-flex align-items-center justify-content-around">
          <span>Кількість: {totalAmount} шт.</span>
          <span>Сума: {totalPrice} грн.</span>
        </Card.Body>
      </Card>
      <Row></Row>
      <Row className="mt-3">
        <Checkout />
      </Row>
    </div>
  );
});

export default Basket;
