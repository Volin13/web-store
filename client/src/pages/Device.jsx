import React from 'react';
import { Button, Card, Col, Container, Image, Row } from 'react-bootstrap';
import largeStar from '../assets/largeStar.svg';
const Device = () => {
  const device = {
    id: 1,
    name: 'Iphone 14 pro',
    price: 25000,
    rating: 5,
    img: 'https://support.apple.com/library/content/dam/edam/applecare/images/en_US/iphone/iphone-14-pro-max-colors.png',
  };
  const description = [
    { id: 1, title: 'Диагональ eкрана', description: '6.1' },
    { id: 2, title: 'Розширення дисплея', description: '2556x1179' },
    { id: 3, title: 'Тип матриці', description: 'OLED (Super Retina XDR)' },
    { id: 4, title: 'Частота оновлення екрану', description: '120 Гц' },
    { id: 5, title: 'Кількість SIM-карт', description: '2' },
    { id: 6, title: 'Влаштована пам&#39;ять', description: '120 Гц' },
    { id: 7, title: 'Фронтальна камера', description: '12 Мп' },
    {
      id: 8,
      title: 'Запис відео ФК',
      description: '4K / 3840x2160 / стереозвук',
    },
    { id: 9, title: 'Назва процесора', description: 'Apple A16 Bionic' },
    { id: 10, title: 'Кількість ядер', description: '2+4' },
    {
      id: 11,
      title: 'Основна камера',
      description: '48 Мп + 12 Мп + 12 Мп + 12 Мп',
    },
    { id: 12, title: 'Кількість основних камер', description: '4' },
    {
      id: 13,
      title: 'Запис відео ОК',
      description: '4K / 3840x2160 / стереозвук',
    },
    { id: 14, title: 'Роз&#39;єми', description: 'Lightning' },
    { id: 15, title: 'Вага', description: '206 гр.' },
    { id: 16, title: 'Гарантія', description: '12 міс.' },
  ];
  return (
    <Container className="mt-3">
      <Row>
        <Col md={4}>
          <Image width={300} height={300} src={device.img} />
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
        {description.map((info, index) => (
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
