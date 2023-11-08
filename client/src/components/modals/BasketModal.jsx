import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Card, Modal } from 'react-bootstrap';

import { BASKET_ROUTE } from '../../utils/constants';
import BasketList from '../basket/BasketList';
import { NavLink } from 'react-router-dom';

const BasketModal = observer(({ localBasket, basket, show, onHide }) => {
  const [list, setList] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const uniqueItems = [];
    localBasket.forEach(item => {
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
  }, [localBasket, localBasket.length, basket.basket.length]);

  const removeFromList = index => {
    const newCart = [...list];
    newCart.splice(index, 1);
    basket.setBasket(newCart);
    if (newCart) {
      localStorage.setItem('basket', newCart);
    } else {
      localStorage.removeItem('basket');
    }
    setList(newCart);

    recalculateTotal(newCart);
  };
  const addItemCount = id => {
    const listItem = list.find(item => item.id === id);
    listItem.count += 1;
    recalculateTotal(list);
    recalculateAmount(list);
    localStorage.setItem('basket', list);
  };

  const reduceItemCount = id => {
    const listItem = list.find(item => item.id === id);
    if (listItem.count > 1) {
      listItem.count -= 1;
    } else {
      const removeIndex = list.indexOf(listItem);
      list.splice(removeIndex, 1);
      setList(list);
    }
    recalculateTotal(list);
    recalculateAmount(list);
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
    <Modal size="lg" show={show} onHide={onHide} centered className="text-end">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Кошик</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ textAlign: 'center' }}>
        <BasketList
          addOne={addItemCount}
          reduceOne={reduceItemCount}
          list={list}
          removeCard={removeFromList}
        />
      </Modal.Body>
      <Card>
        <Card.Body className="d-flex align-items-center justify-content-around">
          <span>Кількість: {totalAmount} шт.</span>
          <span>Сума: {totalPrice} грн.</span>
        </Card.Body>
      </Card>

      <Modal.Footer style={{ textAlign: 'center' }}>
        <NavLink to={BASKET_ROUTE}>
          <Button
            disabled={totalAmount === 0}
            variant={'info'}
            onClick={onHide}
          >
            Оформити замовлення
          </Button>
        </NavLink>
      </Modal.Footer>
    </Modal>
  );
});

export default BasketModal;
