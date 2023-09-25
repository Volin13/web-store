import React, { useContext } from 'react';
import { Context } from '..';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import { ADMIN_ROUTE, LOGIN_ROUTE, SHOP_ROUTE } from '../utils/constants';
import { observer } from 'mobx-react-lite';

const NavBar = observer(() => {
  const { user } = useContext(Context);
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <NavLink style={{ color: 'white' }} to={SHOP_ROUTE}>
            OnlineStore
          </NavLink>
          {user.isAuth ? (
            <Nav className="ml-auto" style={{ color: 'white' }}>
              <NavLink to={ADMIN_ROUTE}>
                <Button variant="outline-light">Адміністратору</Button>{' '}
              </NavLink>
              <NavLink to={LOGIN_ROUTE} style={{ marginLeft: '1rem' }}>
                <Button variant="outline-light">Вийти</Button>{' '}
              </NavLink>
            </Nav>
          ) : (
            <Nav className="ml-auto" style={{ color: 'white' }}>
              <NavLink to={LOGIN_ROUTE}>
                <Button
                  variant="outline-light"
                  onClick={() => {
                    user.setIsAuth(true);
                  }}
                >
                  Авторизація
                </Button>{' '}
              </NavLink>
            </Nav>
          )}
        </Container>
      </Navbar>
    </>
  );
});

export default NavBar;
