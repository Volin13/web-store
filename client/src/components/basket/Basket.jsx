import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Card, Row } from 'react-bootstrap';
import BasketList from '../basket/BasketList';
import Checkout from './Checkout';
import { Context } from '../..';
import CountUp from 'react-countup';

const Basket = observer(() => {
  const [list, setList] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const { user, basket } = useContext(Context);
  const localBasket = sessionStorage.getItem('basket');
  const basketData = JSON.parse(localBasket);

  // Обробка змін кількості девайсів у кошику разом з змінами підрахованої кількості і ціни

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basket.basket.length, basketData?.length, list?.length]);

  // Видалення 1 виду девайсу з кошику і оновлення заг. ціни і кількості

  const removeFromList = index => {
    const newCart = [...list];
    newCart.splice(index, 1);
    basket.setBasket(newCart);
    sessionStorage.setItem('basket', newCart);
    setList(newCart);

    recalculateTotal(newCart);
  };

  // Збільшення кількості 1 типу девайсу на 1 одиницю

  const addItemCount = id => {
    const listItem = list.find(item => item.id === id);
    listItem.count = +1;
    recalculateTotal(list);
    sessionStorage.setItem('basket', list);
  };

  // Зменшення кількості 1 типу девайсу на 1 одиницю

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
    sessionStorage.setItem('basket', list);
  };

  // Оновлення заг. ціни

  const recalculateTotal = cartItems => {
    const newTotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );
    setTotalPrice(newTotal);
  };

  // Оновлення заг. кількості

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
          <span>
            Кількість: <CountUp start={0} end={+totalAmount} duration={2} /> шт.
          </span>
          <span>
            Сума: <CountUp start={0} end={+totalPrice} duration={2} /> грн.
          </span>
        </Card.Body>
      </Card>
      <Row></Row>
      <Row className="mt-3">
        <Checkout list={list} total={totalPrice} user={user.isAuth} />
      </Row>
    </div>
  );
});

export default Basket;
