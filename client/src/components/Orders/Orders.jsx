import React, { useEffect, useState } from 'react';
import { Button, Card, Col } from 'react-bootstrap';
import { fetchNewOrders, fetchOrdersHistory } from '../../http/ordersApi';
import OrdersList from './OrdersList';
import css from './Orders.module.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyMode, setHistoryMode] = useState(false);

  // При першому завантаженню зтягую список замовлень
  useEffect(() => {
    fetchNewOrders().then(data => setOrders(data));
  }, []);

  // Оновлення списку по зміні "мода"
  useEffect(() => {
    if (!historyMode) {
      fetchNewOrders().then(data => setOrders(data));
    }
  }, [historyMode]);
  const hendleHistoryModeBtnClick = () => {
    setHistoryMode(!historyMode);
    fetchOrdersHistory().then(data => setHistory(data));
  };

  // console.log(orders);
  return (
    <>
      <h2 className="mb-2">Поточні замовлення</h2>

      <Card className="mb-3" style={{ height: '50vh', overflow: 'auto' }}>
        <Card.Title>
          <div
            className="d-flex justify-content-between gap-1 text-center"
            variant="outline-dark"
            style={{
              padding: '16px',
              background: '#212529',
              color: 'white',
            }}
          >
            <Col md="1">
              <span className={css.ordersItemTitle}>№</span>
            </Col>
            <Col md="1">
              <span className={css.ordersItemTitle}>Юзер</span>
            </Col>
            <Col md="2">
              <span className={css.ordersItemTitle}>Ім'я</span>
            </Col>
            <Col md="2">
              <span className={css.ordersItemTitle}>Прізвище</span>
            </Col>
            <Col md="3">
              <span className={css.ordersItemTitle}>Місто</span>
            </Col>{' '}
            <Col md="3">
              <span className={css.ordersItemTitle}>Дата, час</span>
            </Col>
          </div>
        </Card.Title>
        {!history && !orders ? (
          <Card.Body className="d-flex align-items-center justify-content-center">
            <h3>Замовлень поки що немає</h3>
          </Card.Body>
        ) : (
          <Card.Body>
            {!historyMode ? (
              <OrdersList list={orders} />
            ) : (
              <OrdersList list={history} />
            )}
          </Card.Body>
        )}
      </Card>
      <Button
        className="ml-auto"
        variant="outline-dark"
        onClick={hendleHistoryModeBtnClick}
      >
        {!history
          ? 'Повернутись до поточних замовлень'
          : 'Переглянути історію замовленнь'}
      </Button>
    </>
  );
};

export default Orders;
