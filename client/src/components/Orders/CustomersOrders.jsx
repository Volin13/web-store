import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Col } from 'react-bootstrap';
import { Context } from '../..';
import { fetchUserOrders } from '../../http/ordersApi';
import formatDate from '../../utils/formatDate';
import MessagesLoading from '../UI/UX/Spinner/MessagesLoading';
import CastomerSingleOrder from './CastomerSingleOrder';
import css from './Orders.module.css';

const CustomersOrders = () => {
  const [userOrderList, setUserOrderList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState('');
  const { user } = useContext(Context);

  useEffect(() => {
    fetchUserOrders(user.id).then(data => setUserOrderList(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const hendleBtnClick = () => {
    setLoading(true);
    fetchUserOrders(user.id)
      .then(data => {
        setUserOrderList(data);
      })
      .catch(error => {
        console.error('Error fetching user orders:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const hendleOrderClick = (index, visible) => {
    if (visible && index !== visible) {
      setVisible(index);
    } else if (index === visible) {
      setVisible('');
    } else {
      setVisible(index);
    }
  };

  const pickOrderColor = (declined, checked) => {
    if (checked && declined) {
      return '#fbc1bc';
    } else if (checked && !declined) {
      return '#ABEBAB';
    } else {
      return '#FEEFBE';
    }
  };

  return (
    <div>
      <h3 className="mb-2">Ваші замовлення:</h3>
      {userOrderList.length ? (
        <Card className="mb-3 p-3" style={{ height: '60vh', overflow: 'auto' }}>
          <ul style={{ minHeight: '100%' }}>
            {loading ? (
              <div
                style={{ minHeight: '100%' }}
                className="d-flex align-items-center justify-content-center"
              >
                <MessagesLoading />
              </div>
            ) : (
              <>
                {userOrderList?.map((item, index) => (
                  <li
                    onClick={() => hendleOrderClick(index, visible)}
                    className="mb-2"
                    key={item?.id}
                  >
                    <div
                      className="d-flex justify-content-md-center justify-content-xl-between gap-1 text-center flex-wrap flex-xl-nowrap  mb-2"
                      style={{
                        borderRadius: '8px',
                        backgroundColor: pickOrderColor(
                          item?.declined,
                          item?.checked
                        ),
                        cursor: 'pointer',
                      }}
                    >
                      <Col md="1">
                        <span className={css.ordersItemData}>{index + 1}.</span>
                      </Col>
                      <Col md="2">
                        <span className={css.ordersItemData}>
                          {item.userData.firstName}
                        </span>
                      </Col>
                      <Col md="3">
                        <span className={css.ordersItemData}>
                          {item.userData.lastName}
                        </span>
                      </Col>
                      <Col md="3">
                        <span className={css.ordersItemData}>
                          {item.userData.city}
                        </span>
                      </Col>{' '}
                      <Col md="3" style={{ overflow: 'hidden' }}>
                        <span className={css.ordersItemData}>
                          {formatDate(item.updatedAt)}
                        </span>
                      </Col>
                    </div>
                    <CastomerSingleOrder
                      list={item?.orderList}
                      visible={visible}
                      index={index}
                    />
                  </li>
                ))}
              </>
            )}
          </ul>
        </Card>
      ) : (
        <Card
          className="d-flex justify-content-center align-items-center mb-3"
          style={{ minHeight: '20vh' }}
        >
          <h4 className="text-center">У вас ще не було замовлень</h4>
        </Card>
      )}
      <div className="d-flex justify-content-between">
        <div
          className="d-flex justify-content-md-around align-items-center flex-wrap"
          style={{ flex: 1 }}
        >
          <div className="d-flex justify-content-between align-items-center m-1">
            <span style={{ marginRight: '5px' }}>В обробці:</span>
            <span
              className="d-inline-block"
              style={{
                width: '50px',
                height: '30px',
                backgroundColor: '#FEEFBE',
              }}
            ></span>
          </div>
          <div className="d-flex justify-content-between align-items-center m-1">
            <span style={{ marginRight: '5px' }}>Відправлено:</span>
            <span
              className="d-inline-block"
              style={{
                width: '50px',
                height: '30px',
                backgroundColor: '#ABEBAB',
              }}
            ></span>
          </div>
          <div className="d-flex justify-content-between align-items-center m-1">
            <span style={{ marginRight: '5px' }}>Відхилено:</span>{' '}
            <span
              className="d-inline-block"
              style={{
                width: '50px',
                height: '30px',
                backgroundColor: '#fbc1bc',
              }}
            ></span>
          </div>
        </div>
        <Button
          variant="outline-dark"
          disabled={loading}
          onClick={() => hendleBtnClick()}
          style={{ minWidth: '162px', minHeight: '46px' }}
        >
          {loading ? <MessagesLoading /> : 'Оновити'}
        </Button>
      </div>
    </div>
  );
};

export default CustomersOrders;
