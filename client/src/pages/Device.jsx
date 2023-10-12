import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Image, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { fetchSingleDevice } from '../http/deviceApi';
import pickStarColor from '../utils/pickStarColor';
import CountUp from 'react-countup';
import packageImg from '../assets/shopIcons/packageImg.svg';
const Device = () => {
  const [device, setDevice] = useState({ info: [] });
  const { id } = useParams();

  useEffect(() => {
    fetchSingleDevice(id).then(data => setDevice(data));
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
          <Row className="d-flex flex-column align-items-center text-center">
            <h1>{device.name}</h1>
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                clipPath:
                  'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                width: 240,
                height: 240,
                background: `linear-gradient(to top, #ffd000 ${pickStarColor(
                  device.rating
                )}%, #f0f0f0 ${100 - pickStarColor(device.rating)}%)`,
                fontSize: 64,
                boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.5)',
              }}
            >
              {device.rating}
            </div>
          </Row>
        </Col>
        <Col md={4}>
          <Card
            className="d-flex flex-column align-items-center justify-content-around"
            style={{
              width: 300,
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
            <Button variant={'outline-dark'}>Додати до корзини</Button>
          </Card>
        </Col>
      </Row>
      <Row className=" mt-3 d-flex flex-column">
        <h2>Характеристики</h2>
        {device.info.map((info, index) => (
          <Row
            key={info.id}
            className="d-flex justify-content-between"
            style={{
              background: index % 2 === 0 ? 'lightgrey' : 'transparent',
              padding: 10,
            }}
          >
            <span style={{ display: 'inline-block', width: '50%' }}>
              {info.title}:
            </span>
            <span
              style={{
                display: 'inline-block',
                width: '50%',
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
