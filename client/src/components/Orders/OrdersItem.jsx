import React, { useState } from 'react';
import { Button, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ORDERS_ROUTE, USER_ORDERS_ROUTE } from '../../utils/constants';
import css from './Orders.module.css';
import formatDate from '../../utils/formatDate';

const OrdersItem = ({ item, index }) => {
  const [isHidden, setIsHidden] = useState(true);
  const navigate = useNavigate();

  return (
    <li
      className={`${css.ordersItem} ${
        isHidden ? css.expandEnter : css.expandExit
      } mb-2`}
      onClick={() => setIsHidden(!isHidden)}
      style={{ cursor: 'pointer' }}
    >
      <div
        className="d-flex justify-content-between gap-1 text-center mb-2"
        style={{
          background: item?.declined ? 'transparent' : '#ffc2c2',
        }}
      >
        <Col md="1">
          <span className={css.ordersItemData}>{index}</span>
        </Col>
        <Col md="2">
          <span className={css.ordersItemData}>{item.userData.firstName}</span>
        </Col>
        <Col md="3">
          <span className={css.ordersItemData}>{item.userData.lastName}</span>
        </Col>
        <Col md="3">
          <span className={css.ordersItemData}>{item.userData.city}</span>
        </Col>{' '}
        <Col md="3" style={{ overflow: 'hidden' }}>
          <span className={css.ordersItemData}>
            {formatDate(item.updatedAt)}
          </span>
        </Col>
      </div>
      <div
        className={`d-flex gap-1  justify-content-around align-items-center p-2 ${
          isHidden ? css.expandExitActive : css.expandEenterActive
        }`}
      >
        {!isHidden && (
          <>
            <Col md="3">
              <Button
                className={css.orderItemBtn}
                variant="outline-dark"
                onClick={() => navigate(ORDERS_ROUTE + '/' + item.id)}
              >
                Переглянути замовлення
              </Button>
            </Col>
            <Col md="3">
              <Button
                className={css.orderItemBtn}
                onClick={() => {
                  navigate(USER_ORDERS_ROUTE + '/' + item.userId);
                  setIsHidden(true);
                }}
                variant="outline-primary"
              >
                Переглянути всі замовлення користувача
              </Button>
            </Col>
            <Col md="3">
              <Button
                className={css.orderItemBtn}
                onClick={() => {
                  setIsHidden(true);
                }}
                variant="outline-danger"
              >
                Закрити
              </Button>
            </Col>
          </>
        )}
      </div>
    </li>
  );
};

OrdersItem.propTypes = {
  item: PropTypes.object,
  index: PropTypes.number,
};

export default OrdersItem;
