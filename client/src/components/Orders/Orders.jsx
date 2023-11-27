import React, { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { fetchNewOrders, fetchOrdersHistory } from '../../http/ordersApi';
import OrdersList from './OrdersList';

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
  console.log(orders);
  return (
    <>
      <h2 className="mb-2">Поточні замовлення</h2>

      <Card className="mb-3" style={{ height: '50vh', overflow: 'auto' }}>
        {!history && !orders ? (
          <Card.Body>
            {!history || !orders ? (
              <OrdersList list={orders} />
            ) : (
              <OrdersList list={history} />
            )}
          </Card.Body>
        ) : (
          <Card.Body className="d-flex align-items-center justify-content-center">
            <h3>Замовлень поки що немає</h3>
          </Card.Body>
        )}
      </Card>
      <Button variant="outline-dark" onClick={hendleHistoryModeBtnClick}>
        {!history
          ? 'Повернутись до поточних замовлень'
          : 'Переглянути історію замовленнь'}
      </Button>
    </>
  );
};

export default Orders;
