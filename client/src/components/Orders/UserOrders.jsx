import React, { useEffect, useState } from 'react';
import { Button, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchUserOrders } from '../../http/ordersApi';
import { ORDERS_ROUTE } from '../../utils/constants';
import Spiner from '../UI/UX/Spinner/Spinner';
import css from './Orders.module.css';

const UserOrders = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [userOrders, setUserOrders] = useState([]);
  const [userName, setUserName] = useState('');
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    fetchUserOrders(id).then(data => {
      setUserOrders(data);
      if (data.length > 0) {
        setUserName(
          `${data[0]?.userData?.firstName} ${data[0]?.userData?.lastName}`
        );
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setFormatDate = date => {
    const dateObject = new Date(date);
    const year = dateObject.getFullYear();
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObject.getDate().toString().padStart(2, '0');
    const hours = dateObject.getHours().toString().padStart(2, '0');
    const minutes = dateObject.getMinutes().toString().padStart(2, '0');
    const formattedDate = `${day}.${month}.${year} / ${hours}:${minutes}`;
    return formattedDate;
  };

  return (
    <>
      {userOrders.length > 0 ? (
        <>
          <h2 className="my-2" style={{ textAlign: 'center' }}>
            {userName}
          </h2>
          <div
            className={`d-flex justify-content-between align-items-center gap-1 text-center ${css.ordersMainThumb}`}
          >
            <Col md="1">
              <span className={css.ordersItemTitle}>№</span>
            </Col>
            <Col md="2">
              <span className={css.ordersItemTitle}>Сума, грн</span>
            </Col>
            <Col md="3">
              <span className={css.ordersItemTitle}>Місто</span>
            </Col>
            <Col md="3">
              <span className={css.ordersItemTitle}>Термінал</span>
            </Col>{' '}
            <Col md="3">
              <span className={css.ordersItemTitle}>Дата, час</span>
            </Col>
          </div>
          <ul style={{ maxHeight: '40vh', overflow: 'auto' }}>
            {userOrders?.map((item, index) => (
              <li
                key={item.id}
                item={item}
                style={{
                  background: item?.declined ? 'transparent' : '#ffc2c2',
                  padding: '16px',
                  border: '1px solid #212529',
                  cursor: 'pointer',
                }}
                onClick={() => setIsHidden(!isHidden)}
              >
                <div className="d-flex justify-content-between gap-1 text-center mb-2">
                  <Col md="1">
                    <span className={css.ordersItemTitle}>{index + 1}</span>
                  </Col>
                  <Col md="2">
                    <span className={css.ordersItemTitle}>
                      {item?.userData?.total}
                    </span>
                  </Col>
                  <Col md="3">
                    <span className={css.ordersItemTitle}>
                      {item?.userData?.city}
                    </span>
                  </Col>
                  <Col md="3" className={css.runningThumb}>
                    <span
                      className={`${css.ordersItemTitle} ${
                        isHidden && css.runningString
                      }`}
                    >
                      {item?.userData?.terminal}
                    </span>
                  </Col>{' '}
                  <Col md="3">
                    <span className={css.ordersItemTitle}>
                      {setFormatDate(item?.createdAt)}
                    </span>
                  </Col>
                </div>

                {!isHidden && (
                  <div
                    className={`d-flex gap-1  justify-content-around align-items-center p-2 ${
                      isHidden ? css.expandExitActive : css.expandEenterActive
                    }`}
                  >
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
                          setIsHidden(true);
                        }}
                        variant="outline-danger"
                      >
                        Закрити
                      </Button>
                    </Col>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div
          className={`d-flex align-items-center justify-content-center ${css.orderDataList}`}
        >
          <Spiner />
        </div>
      )}
    </>
  );
};

export default UserOrders;
