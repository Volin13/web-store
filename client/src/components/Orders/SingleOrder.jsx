import React, { useEffect, useState } from 'react';
import { Button, Card, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { checkOrder, declineOrder, fetchOrderById } from '../../http/ordersApi';
import Invoice from './Invoice';
import css from './Orders.module.css';

const SingleOrder = () => {
  const [order, setOrder] = useState({});
  const [checked, setChecked] = useState(true);
  const [declined, setDeclined] = useState(true);
  const [showInvoice, setShowInvoice] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    fetchOrderById(id).then(data => {
      setChecked(data.checked);
      setDeclined(data.decline);
      setOrder(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Card className="mx-auto my-3">
        <Card.Header>Замовлення користувача</Card.Header>
        <Card.Body>
          <ul className={css.orderDataList}>
            {order.orderList?.map(item => (
              <li key={item.id} className="d-flex justify-content-between">
                <Col
                  md="3"
                  className={css.orderData}
                  style={{ minWidth: '150px' }}
                >
                  <Card.Img
                    className={css.orderDataImg}
                    height="130px"
                    variant="top"
                    src={process.env.REACT_APP_API_URL + item.img}
                  />
                </Col>
                <Col
                  md="7"
                  className={css.orderData}
                  style={{ minWidth: '150px' }}
                >
                  {item.title}{' '}
                </Col>

                <Col
                  md="2"
                  className={css.orderData}
                  style={{ minWidth: '150px' }}
                >
                  <div>{item.count} шт.</div>
                  <div>{item.price} грн.</div>
                </Col>
              </li>
            ))}
          </ul>
        </Card.Body>
      </Card>
      <Card className="mb-3">
        <Card.Title className="text-center pt-2 ">
          {order.userData?.firstName} {order.userData?.lastName}
        </Card.Title>
        <Card.Body className="p-0">
          <div className="d-flex overflow-auto">
            <Col
              md="3"
              className={`d-flex flex-column justify-content-center  align-items-center gap-1 text-center ${css.ordersMainThumb}`}
            >
              <div className={css.userDataTitle}>Email</div>
              <div className={css.userDataTitle}>Тел.</div>
              <div className={css.userDataTitle}>Область</div>
              <div className={css.userDataTitle}>Місто</div>
              <div className={css.userDataTitle}>Відділення</div>
              <div className={css.userDataTitle}>До сплати</div>
            </Col>
            <Col
              md="9"
              className={`d-flex flex-column justify-content-center align-items-center gap-1 text-center p-2 ${css.userDataThumb}`}
            >
              <div className={css.userDataItem}>{order.userData?.email}</div>
              <div className={css.userDataItem}>{order.userData?.phone}</div>
              <div className={css.userDataItem}>{order.userData?.city}</div>
              <div className={css.userDataItem}>{order.userData?.region}</div>
              <div className={css.userDataItem}>{order.userData?.terminal}</div>
              <div className={css.userDataItem}>
                {order.userData?.total} грн.
              </div>
            </Col>
          </div>
        </Card.Body>
      </Card>
      {order.userData?.comment?.length > 0 && (
        <Card calssName="mb-2">
          <Card.Text>{order.userData?.comment}</Card.Text>
        </Card>
      )}

      <div className="d-flex justify-content-around align-items-center gap-3 gap-sm-unset flex-wrap mb-3">
        <Button
          type="button"
          variant="outline-danger"
          onClick={() => {
            declineOrder(id);
            setDeclined(!declined);
          }}
        >
          {!declined ? 'Скасувати замовлення' : 'Відновити замовлення'}
        </Button>
        <Button
          type="button"
          variant="outline-primary"
          onClick={() => {
            setShowInvoice(!showInvoice);
          }}
        >
          {!checked ? 'Переглянути накладну' : 'Закрити накладну'}
        </Button>
        <Button
          type="button"
          variant="outline-primary"
          onClick={() => {
            setChecked(!checked);
            checkOrder(id);
          }}
        >
          {!checked ? 'Відправити' : 'Відмінити відправлення'}
        </Button>
      </div>
      {showInvoice && (
        <div className={css.invoiceThumb}>
          <Invoice order={order} />
        </div>
      )}
    </>
  );
};

export default SingleOrder;
