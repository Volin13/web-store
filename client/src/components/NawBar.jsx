import React, { useContext, useState } from 'react';
import { Context } from '..';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  ADMIN_ROUTE,
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
  SHOP_ROUTE,
} from '../utils/constants';
import { observer } from 'mobx-react-lite';
import { Image } from 'react-bootstrap';

import storeLogo from '../assets/shopIcons/shoppingLogo.svg';
import basketImg from '../assets/shopIcons/buy-cart-discount-3-svgrepo-com.svg';
import BasketModal from './modals/BasketModal';
const NavBar = observer(() => {
  const [basketVisible, setBasketVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const authLocation =
    location.pathname === LOGIN_ROUTE ||
    location.pathname === REGISTRATION_ROUTE;

  const { user, basket } = useContext(Context);
  const logOut = () => {
    user.setUser({});
    user.setIsAuth(false);
    localStorage.removeItem('token');
    navigate(LOGIN_ROUTE);
  };

  return (
    <>
      <Navbar sticky="top" bg="dark" data-bs-theme="dark">
        <Container>
          <NavLink style={{ color: 'white' }} to={SHOP_ROUTE}>
            Online
            <Image src={storeLogo} width={25} height={25} />
            Store
          </NavLink>

          {user.isAuth ? (
            <Nav className="ml-auto" style={{ color: 'white' }}>
              <button
                className="d-flex align-items-center justify-content-center"
                style={{
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  height: '38px',
                  width: '38px',
                  position: 'relative',
                  outline: '2px ridge #ffffff99',
                }}
                type="button"
                onClick={() => setBasketVisible(true)}
              >
                <Image width={30} height={30} src={basketImg} />
                {basket.basket.length > 0 && (
                  <div
                    style={{
                      width: 15,
                      height: 15,
                      fontSize: 10,
                      color: 'white',
                      position: 'absolute',
                      bottom: 0,
                      left: '-5px',
                      borderRadius: '50%',
                      backgroundColor: '#1cb4e3',
                    }}
                  >
                    {basket.basket.length}
                  </div>
                )}
              </button>
              <NavLink to={ADMIN_ROUTE}>
                <Button style={{ marginLeft: '1rem' }} variant="outline-light">
                  Адміністратору
                </Button>{' '}
              </NavLink>
              <Button
                variant="outline-light"
                style={{ marginLeft: '1rem' }}
                onClick={() => logOut()}
              >
                Вийти
              </Button>{' '}
            </Nav>
          ) : (
            <Nav className="ml-auto" style={{ color: 'white' }}>
              <NavLink to={authLocation ? location.pathname : LOGIN_ROUTE}>
                <Button variant="outline-light" disabled={authLocation}>
                  Авторизація
                </Button>{' '}
              </NavLink>
            </Nav>
          )}
        </Container>
      </Navbar>
      <BasketModal
        show={basketVisible}
        onHide={() => setBasketVisible(false)}
      />
    </>
  );
});

export default NavBar;
