import React, { useContext, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { observer } from 'mobx-react-lite';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import {
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
  SHOP_ROUTE,
} from '../utils/constants';
import { Row } from 'react-bootstrap';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { login, registration } from '../http/userAPI';
import { Context } from '..';

const Auth = observer(() => {
  const { user } = useContext(Context);
  const location = useLocation();
  const isLogin = location.pathname === LOGIN_ROUTE;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const click = async () => {
    try {
      let userData;
      if (isLogin) {
        userData = await login(email, password);
      } else {
        userData = await registration(email, password);
      }
      console.log(userData);
      user.setUser(userData);
      user.setIsAuth(true);
      navigate(SHOP_ROUTE);
    } catch (e) {
      alert(e.response?.data?.message) ||
        console.error('An error occurred:', e);
    }
  };
  return (
    <Container
      className="d-flex justify-content-center
  align-items-center"
      style={{ height: window.innerHeight - 54 }}
    >
      <Card style={{ width: 600 }} className="p-5">
        <h2 className="m-auto">{isLogin ? 'Авторизація' : 'Регістрація'}</h2>
        <Form className="d-flex flex-column">
          <Form.Control
            className="mt-3"
            type="email"
            placeholder="Введіть ваш email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Form.Control
            className="mt-3"
            type="password"
            placeholder="Введіть ваш пароль"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Row className="d-flex align-items-center justify-content-between mt-3 px-3">
            {isLogin ? (
              <div style={{ display: 'inline', width: '70%' }}>
                Немає акаунта?{' '}
                <NavLink to={REGISTRATION_ROUTE}>Зареєструйся</NavLink>{' '}
              </div>
            ) : (
              <div style={{ display: 'inline', width: '70%' }}>
                Є акаунт? <NavLink to={LOGIN_ROUTE}>Увійди</NavLink>{' '}
              </div>
            )}
            <Button
              variant={'outline-success'}
              type="button"
              className="ml-auto"
              style={{ maxWidth: '30%' }}
              onClick={click}
            >
              {isLogin ? 'Увійти' : 'Регістрація'}
            </Button>
          </Row>
        </Form>
      </Card>
    </Container>
  );
});

export default Auth;
