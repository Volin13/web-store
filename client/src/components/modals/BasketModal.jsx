import React, { useState } from 'react';
import { Button, Card, Modal, NavLink } from 'react-bootstrap';
import BasketList from '../basket/BasketList';

const BasketModal = ({ show, onHide }) => {
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

  const submitOrder = order => {
    console.log('Замовлення відправлено:', order);
  };

  return (
    <Modal size="lg" show={show} onHide={onHide} centered className="text-end">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Корзина</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ textAlign: 'center' }}>
        <BasketList list={list} removeCard={removeFromList} />
      </Modal.Body>
      <Card>
        <Card.Body className="d-flex align-items-center justify-content-around">
          <span>Кількість: {list.length} шт.</span>
          <span>Сума: {total} грн.</span>
        </Card.Body>
      </Card>

      <Modal.Footer style={{ textAlign: 'center' }}>
        <NavLink>
          <Button variant={'outline-dark'} onClick={onHide}>
            Оформити замовлення
          </Button>
        </NavLink>
      </Modal.Footer>
    </Modal>
  );
};

export default BasketModal;
