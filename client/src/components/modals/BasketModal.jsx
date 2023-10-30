import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Modal, NavLink } from 'react-bootstrap';
import { Context } from '../..';
import { BASKET_ROUTE } from '../../utils/constants';
import BasketList from '../basket/BasketList';

const BasketModal = ({ show, onHide }) => {
  const [list, setList] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const { basket } = useContext(Context);

  useEffect(() => {
    const basketData = basket.basket;
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
  }, [basket.basket]);

  const removeFromList = index => {
    const newCart = [...list];
    newCart.splice(index, 1);
    basket.setBasket(newCart);
    setList(newCart);
    recalculateTotal(newCart);
  };
  const addItemCount = id => {
    const listItem = list.find(item => item.id === id);
    listItem.count = +1;
    recalculateTotal(list);
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

  console.log(list);
  return (
    <Modal size="lg" show={show} onHide={onHide} centered className="text-end">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Корзина</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ textAlign: 'center' }}>
        <BasketList
          list={list}
          removeCard={removeFromList}
          add={addItemCount}
          reduce={reduceItemCount}
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
};

export default BasketModal;
