import React, { useState } from 'react';
import { Button, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { DEVICE_ROUTE } from '../../utils/constants';
import css from './Orders.module.css';

const OrdersItem = ({ item, index }) => {
  const [isHidden, setIsHidden] = useState(true);

  const dateObject = new Date(item.updatedAt);
  const formattedDate = dateObject.toLocaleString();
  const navigate = useNavigate();

  return (
    <li
      className={css.ordersItem}
      onClick={() => setIsHidden(!isHidden)}
      style={{ cursor: 'pointer' }}
    >
      <div
        className="d-flex justify-content-between gap-1 text-center mb-2"
        style={{
          background: index % 2 === 0 ? 'lightgrey' : 'transparent',
        }}
      >
        <Col md="1">
          <span className={css.ordersItemData}>{index}</span>
        </Col>
        <Col md="1" onClick={() => navigate(DEVICE_ROUTE + '/' + item.userId)}>
          <span className={css.ordersItemData}>{item.userId}</span>
        </Col>
        <Col md="2">
          <span className={css.ordersItemData}>{item.userData.firstName}</span>
        </Col>
        <Col md="2">
          <span className={css.ordersItemData}>{item.userData.lastName}</span>
        </Col>
        <Col md="3">
          <span className={css.ordersItemData}>{item.userData.city}</span>
        </Col>{' '}
        <Col md="3">
          <span className={css.ordersItemData}>{formattedDate}</span>
        </Col>
      </div>
      {!isHidden && (
        <div className="d-flex gap-1 justify-content-around align-items-center p-2">
          <Col md="3">
            <Button className={css.orderItemBtn} variant="outline-dark">
              Переглянути замовлення
            </Button>
          </Col>
          <Col md="3">
            <Button
              className={css.orderItemBtn}
              onClick={() => setIsHidden(true)}
              variant="outline-primary"
            >
              Переглянути всі замовлення користувача
            </Button>
          </Col>
          <Col md="3">
            <Button
              className={css.orderItemBtn}
              onClick={() => setIsHidden(true)}
              variant="outline-danger"
            >
              Закрити
            </Button>
          </Col>
        </div>
      )}
    </li>
  );
};

export default OrdersItem;
