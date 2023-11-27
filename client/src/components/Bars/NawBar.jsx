import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../..';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  ADMIN_ROUTE,
  BASKET_ROUTE,
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
  SHOP_ROUTE,
} from '../../utils/constants';
import { observer } from 'mobx-react-lite';
import { Image } from 'react-bootstrap';

import storeLogo from '../../assets/shopIcons/shoppingLogo.svg';
import basketImg from '../../assets/shopIcons/buy-cart-discount-3-svgrepo-com.svg';
import BasketModal from '../modals/BasketModal';

const NavBar = observer(() => {
  const [basketVisible, setBasketVisible] = useState(false);
  const [basketLength, setBasketLength] = useState(0);
  const { user, basket, device } = useContext(Context);

  const navigate = useNavigate();
  const location = useLocation();
  const authLocation =
    location.pathname === LOGIN_ROUTE ||
    location.pathname === REGISTRATION_ROUTE;

  // Кнопка кошика не має відображатись на сторінці кошика
  const basketLocation = location.pathname === BASKET_ROUTE;

  const logOut = () => {
    user.setUser({});
    user.setIsAuth(false);
    sessionStorage.removeItem('basket');
    localStorage.removeItem('token');
    navigate(LOGIN_ROUTE);
  };

  const localbasketData = sessionStorage.getItem('basket');
  let localBasket = null;
  localBasket = localbasketData ? JSON.parse(localbasketData) : basket.basket;

  // Встановлюю кількість покупок в кошику залежно від записаного в sessionStorage або в store MobX
  useEffect(() => {
    setBasketLength(localBasket?.length || basket.basket.length);
  }, [basket.basket.length, localBasket.length]);

  return (
    <>
      <Navbar sticky="top" bg="dark" data-bs-theme="dark">
        <Container>
          <NavLink className="navBar_mainLogo" to={SHOP_ROUTE}>
            Online
            <Image
              className="navBar_mainLogo_image"
              src={storeLogo}
              width={25}
              height={25}
              onClick={() => {
                device.setSelectedBrand({});
                device.setSelectedType({});
              }}
            />
            Store
          </NavLink>

          {user.isAuth ? (
            <Nav className="ml-auto" style={{ color: 'white' }}>
              {!basketLocation && (
                <button
                  className="d-flex align-items-center justify-content-center basket_btn"
                  type="button"
                  onClick={() => setBasketVisible(true)}
                >
                  <Image width={30} height={30} src={basketImg} />
                  {basketLength > 0 && (
                    <div className="basket_btn_count">{basketLength}</div>
                  )}
                </button>
              )}
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
        basket={basket}
        localBasket={localBasket}
      />
    </>
  );
});

export default NavBar;
