import React, { useContext } from 'react';
import { Col, Container } from 'react-bootstrap';
import { Context } from '../..';
import { SHOP_ROUTE } from '../../utils/constants';
import Logo from '../UI/Logo/Logo';
import SNWList from '../UI/SocialNW/SNWList';

const FooterBar = () => {
  const { device } = useContext(Context);

  return (
    <div className="bg-dark p-2">
      <Container>
        <div
          className="d-flex flex-column justify-content-center flex-md-row justify-content-md-around p-2"
          style={{ color: 'white', gap: '20px' }}
        >
          <Col md="3" className="text-center">
            <Logo toRoute={SHOP_ROUTE} device={device} />
          </Col>
          <Col md="3">
            <SNWList />
          </Col>
          <Col md="3" className="text-center">
            <span style={{ marginRight: '5px' }}>Наш чат-бот:</span>{' '}
            <a href="https://t.me/webStoreOKbot"> OnlineStoreBot</a>
          </Col>
        </div>
      </Container>
    </div>
  );
};

export default FooterBar;
