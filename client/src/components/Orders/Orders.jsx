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
    if (historyMode) {
      fetchOrdersHistory().then(data => {
        if (data) {
          setHistory(data);
        } else {
          setHistory([]);
        }
      });
    }
  };

  return (
    <>
      <div className="d-flex justify-content-center justify-content-md-between align-items-center flex-wrap gap-sm-2 gap-md-auto mb-2">
        <h2>Поточні замовлення</h2>
        <Button variant="outline-dark" onClick={hendleHistoryModeBtnClick}>
          {historyMode
            ? 'Повернутись до поточних замовлень'
            : 'Переглянути історію замовленнь'}
        </Button>
      </div>

      <Card className="mb-3" style={{ height: '70vh', overflow: 'auto' }}>
        <Card.Title>
          <div
            className={`d-flex justify-content-between align-items-center gap-1 text-center ${css.ordersMainThumb}`}
          >
            <Col md="1">
              <span className={css.ordersItemTitle}>№</span>
            </Col>
            <Col md="2">
              <span className={css.ordersItemTitle}>Ім&apos;я</span>
            </Col>
            <Col md="3">
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
        {!orders ? (
          <Card.Body className="d-flex align-items-center justify-content-center">
            <h3>Замовлень поки що немає</h3>
          </Card.Body>
        ) : (
          <Card.Body>
            <OrdersList list={historyMode ? history : orders} />
          </Card.Body>
        )}
      </Card>
    </>
  );
};

export default Orders;
