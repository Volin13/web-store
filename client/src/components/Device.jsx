import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Col, Container, Image, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { fetchSingleDevice, getDeviceRating } from '../http/deviceApi';
import CountUp from 'react-countup';
import packageImg from '../assets/shopIcons/packageImg.svg';
import Rating from './UI/UX/Rating/Rating';
import { Context } from '..';
const Device = () => {
  const [device, setDevice] = useState({ info: [] });
  const [rate, setRate] = useState(0);
  const { id } = useParams();
  const { user } = useContext(Context);
  useEffect(() => {
    fetchSingleDevice(id).then(data => setDevice(data));
    getDeviceRating(id).then(data => setRate(data.averageRating));
  }, [id]);
  return (
    <Container className="mt-3">
      <Row className="d-flex align-items-center">
        <Col md={4}>
          <Image
            width={300}
            height={300}
            src={process.env.REACT_APP_API_URL + device.img}
          />
        </Col>
        <Col md={4}>
          <h1 className="text-center">{device.name}</h1>
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
            <Image width={100} height={100} src={packageImg} />
            <Button disabled={!user.isAuth} variant={'outline-dark'}>
              {!user.isAuth
                ? 'Увійдіть щоб зробити покупку'
                : 'Додати до корзини'}
            </Button>
          </Card>
        </Col>
      </Row>
      <Row className=" mt-3 d-flex flex-column">
        <Row className="d-flex justify-content-between mb-1">
          <h2 className="mb-0" style={{ maxWidth: '50%' }}>
            Характеристики
          </h2>
          <Rating
            userId={user.id}
            deviceId={device.id}
            apiRating={rate}
            isAuth={user.isAuth}
          />
        </Row>
        {device.info.map((info, index) => (
          <Row
            key={info.id}
            className="d-flex justify-content-between"
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
