import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Image, Row } from 'react-bootstrap';
import largeStar from '../assets/largeStar.svg';
import { useParams } from 'react-router-dom';
import { fetchSingleDevice } from '../http/deviceApi';
const Device = () => {
  const [device, setDevice] = useState({ info: [] });
  const { id } = useParams();
  console.log(device);
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
                background: `url(${largeStar}) no-repeat center center`,
                width: 240,
                height: 240,
                backgroundSize: 'cover',
                fontSize: 64,
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
            <h3>Від: {device.price} грн.</h3>
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
