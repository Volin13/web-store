import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Col } from 'react-bootstrap';
import { Context } from '../..';
import { fetchUserOrders } from '../../http/ordersApi';
import formatDate from '../../utils/formatDate';
import CastomerSingleOrder from './CastomerSingleOrder';
import css from './Orders.module.css';

const CustomersOrders = () => {
  const [userOrderList, setUserOrderList] = useState([]);
  const [visible, setVisible] = useState('');
  const { user } = useContext(Context);

  console.log(userOrderList);

  useEffect(() => {
    fetchUserOrders(user.id).then(data => setUserOrderList(data));
  }, []);
  const hendleBtnClick = () => {
    fetchUserOrders(user.id).then(data => setUserOrderList(data));
  };
  const hendleOrderClick = index => {
    setVisible(index);
  };
  return (
    <div>
      <h3 className="mb-2">Ваші замовлення:</h3>
      {userOrderList.length ? (
        <Card className="mb-3 p-3">
          <ul>
            {userOrderList?.map((item, index) => (
              <li
                onClick={() => hendleOrderClick(index)}
                className="mb-2"
                key={item?.id}
              >
                <div
                  className="d-flex justify-content-between gap-1 text-center mb-2"
                  style={{
                    borderRadius: '8px',
                    backgroundColor: item?.checked ? '#ABEBAB' : '#fbc1bc',
                    cursor: 'pointer',
                  }}
                >
                  <Col md="1">
                    <span className={css.ordersItemData}>{index + 1}</span>
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
          </ul>
        </Card>
      ) : (
        <Card
          className="d-flex align-items-center mb-3"
          style={{ minHeight: '20vh' }}
        >
          <h4 className="text-center">У вас ще не було замовлень</h4>
        </Card>
      )}
      <div className="text-end">
        <Button variant="outline-dark" onClick={() => hendleBtnClick()}>
          Оновити
        </Button>
      </div>
    </div>
  );
};

export default CustomersOrders;
