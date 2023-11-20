import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Col, Container, Image, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { fetchSingleDevice } from '../http/deviceApi';
import CountUp from 'react-countup';
import Rating from './UI/UX/Rating/Rating';
import { Context } from '..';
import { toast } from 'react-toastify';
import PackageIcon from './UI/UX/PackageImg/PackageIcon';

const Device = () => {
  const [device, setDevice] = useState({ info: [] });
  const [clickedState, setClickedState] = useState(false);
  const { id } = useParams();
  const { user, basket } = useContext(Context);
  useEffect(() => {
    fetchSingleDevice(id).then(data => setDevice(data));
  }, [id]);
  const hendleOrderClick = () => setClickedState(true);
  const addOrder = () => {
    basket.addToBasket({
      id: device.id,
      title: device.name,
      price: device.price,
      added: Date.now(),
      img: device.img,
    });

    toast.info(`${device.name} було додано до кошика`);
    sessionStorage.setItem('basket', JSON.stringify(basket.basket));
  };

  return (
    <Container className="mt-3">
      <Row className="d-flex align-items-center text-center">
        <Col md={4}>
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ minHeight: '300px' }}
          >
            <Image
              width={'100%'}
              src={process.env.REACT_APP_API_URL + device.img}
              fluid
            />
          </div>
        </Col>
        <Col md={4}>
          <h1
            style={{
              display: 'inline-block',
              maxWidth: '100%',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}
          >
            {device.name}
          </h1>
        </Col>
        <Col md={4}>
          <Card
            className="d-flex flex-column align-items-center justify-content-around"
            style={{
              width: '100%',
              height: 300,
              fontSize: 32,
              border: '5px solid lightgray',
            }}
          >
            <h3>
              Від:
              <CountUp start={0} end={+device.price} duration={2} />
              грн.
            </h3>
            <PackageIcon />
            {user.isAuth ? (
              <Button
                variant={clickedState ? 'info' : 'outline-dark'}
                onClick={() => {
                  addOrder();
                  hendleOrderClick();
                }}
              >
                Додати до корзини
              </Button>
            ) : (
              <Button variant="outline-light">
                Увійдіть щоб зробити покупку
              </Button>
            )}
          </Card>
        </Col>
      </Row>
      <Row className=" mt-3 d-flex flex-column align-items-center py-3">
        <Row className="d-flex justify-content-between mb-1">
          <Col md={6}>
            <h2 className="mb-0" style={{ maxWidth: '50%' }}>
              Характеристики
            </h2>
          </Col>
          <Col md={6}>
            <Rating
              userId={user.id}
              deviceId={device.id}
              apiRating={device.rating}
              isAuth={user.isAuth}
            />
          </Col>
        </Row>
        {device.info.map((info, index) => (
          <Row
            key={info.id}
            className="d-flex justify-content-between align-items-center"
            style={{
              background: index % 2 === 0 ? 'lightgrey' : 'transparent',
              padding: '10px 0 ',
            }}
          >
            <span style={{ display: 'inline-block', width: '40%' }}>
              {info.title}:
            </span>
            <span
              style={{
                display: 'inline-block',
                width: '40%',
                textAlign: 'end',
              }}
            >
              {' '}
              {info.description}
            </span>
          </Row>
        ))}
      </Row>
    </Container>
  );
};

export default Device;
