import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../..';
import {
  Navbar,
  Button,
  Nav,
  Container,
  OverlayTrigger,
  Tooltip,
  Col,
  Image,
  Offcanvas,
} from 'react-bootstrap';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  ADMIN_ROUTE,
  BASKET_ROUTE,
  CUSTOMERS_ORDERS_ROUTE,
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
  SHOP_ROUTE,
} from '../../utils/constants';
import { observer } from 'mobx-react-lite';
import storeLogo from '../../assets/shopIcons/shoppingLogo.svg';
import basketImg from '../../assets/shopIcons/buy-cart-discount-3-svgrepo-com.svg';
import logInIcon from '../../assets/authIcons/login-2-svgrepo-com.svg';
import BasketModal from '../modals/BasketModal';
import MenuIcon from '../UI/UX/MenuIcon/MenuIcon';
import MainFilter from '../UI/UX/MainFilter/MainFilter';
import UserMenu from '../modals/userMenu/UserMenu';
import { getUserData } from '../../http/userAPI';
import { toast } from 'react-toastify';
import logout from '../../utils/logOut';

const NavBar = observer(() => {
  const [basketVisible, setBasketVisible] = useState(false);
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [basketLength, setBasketLength] = useState(0);
  const [show, setShow] = useState(false);

  const { user, basket, device } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();
  const authLocation =
    location.pathname === LOGIN_ROUTE ||
    location.pathname === REGISTRATION_ROUTE;

  // Кнопка кошика не має відображатись на сторінці кошика та аутентифікації
  const basketVisivility =
    location.pathname === BASKET_ROUTE ||
    location.pathname === LOGIN_ROUTE ||
    location.pathname === REGISTRATION_ROUTE;

  const localbasketData = sessionStorage.getItem('basket');
  let localBasket = null;
  localBasket = localbasketData ? JSON.parse(localbasketData) : basket.basket;

  useEffect(() => {
    if (user?.isAuth) {
      getUserData().then(data => {
        user.setUserLogin(data?.login);
        user.setAvatar(data?.avatar);
        user.setEmail(data?.email);
        user.setRole(data?.role);
        user.setId(data?.id);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Встановлюю кількість покупок в кошику залежно від записаного в sessionStorage або в store MobX
  useEffect(() => {
    setBasketLength(localBasket?.length || basket.basket.length);
  }, [basket.basket.length, localBasket.length]);

  return (
    <>
      <Navbar sticky="top" bg="dark" data-bs-theme="dark">
        <Container>
          {/* logo */}
          <Col md="3">
            <NavLink
              className="navBar_mainLogo"
              to={SHOP_ROUTE}
              onClick={() => {
                device.setSelectedBrand({});
                device.setSelectedType({});
                device.setQuery('');
              }}
            >
              Online
              <Image
                className="navBar_mainLogo_image"
                src={storeLogo}
                width={25}
                height={25}
              />
              Store
            </NavLink>
          </Col>

          {/* search */}

          <Col md="7" style={{ margin: '0 0 0 auto', overflow: 'hidden' }}>
            <MainFilter />
          </Col>
          <Col md="2" className="d-flex align-items-center ">
            {/* basket*/}

            {!basketVisivility && user?.isAuth && (
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip id="tooltip-bottom">Кошик</Tooltip>}
              >
                <button
                  className="d-flex align-items-center justify-content-center button_thumb"
                  type="button"
                  onClick={() => setBasketVisible(true)}
                  style={{ marginLeft: '10px' }}
                >
                  <Image width={30} height={30} src={basketImg} />
                  {basketLength > 0 && (
                    <div className="basket_btn_count">{basketLength}</div>
                  )}
                </button>
              </OverlayTrigger>
            )}

            {/* menu */}
            {user?.isAuth ? (
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip id="tooltip-bottom">Меню</Tooltip>}
              >
                <button
                  onClick={() => setShow(true)}
                  style={{ marginLeft: '10px' }}
                >
                  <MenuIcon />
                </button>
              </OverlayTrigger>
            ) : (
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip id="tooltip-bottom">Увійти</Tooltip>}
              >
                <button
                  className="d-flex align-items-center justify-content-center button_thumb"
                  type="button"
                  disabled={location.pathname === LOGIN_ROUTE}
                  onClick={() => navigate(LOGIN_ROUTE)}
                  style={{ marginLeft: '10px' }}
                >
                  <Image width={20} height={20} src={logInIcon} />
                </button>
              </OverlayTrigger>
            )}
          </Col>

          <Offcanvas
            show={show}
            scroll={true}
            placement="end"
            onHide={() => {
              setShow(false);
            }}
            style={{ width: '250px' }}
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Меню</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              {user?.isAuth ? (
                <Nav
                  className="d-flex flex-column align-items-start"
                  id="collapse"
                  style={{
                    gap: '20px',
                  }}
                >
                  <Button
                    variant="outline-dark"
                    onClick={() => setUserMenuVisible(true)}
                  >
                    Профіль
                  </Button>{' '}
                  <NavLink to={CUSTOMERS_ORDERS_ROUTE}>
                    <Button
                      variant="outline-dark"
                      onClick={() => setShow(false)}
                    >
                      Ваші покупки
                    </Button>{' '}
                  </NavLink>
                  {user?.role === 'ADMIN' && (
                    <NavLink to={ADMIN_ROUTE}>
                      <Button
                        variant="outline-dark"
                        onClick={() => setShow(false)}
                      >
                        Адміністратору
                      </Button>{' '}
                    </NavLink>
                  )}
                  <Button
                    variant="outline-dark"
                    onClick={() => {
                      setShow(false);
                      logout(user, navigate, toast, LOGIN_ROUTE);
                    }}
                  >
                    Вийти
                  </Button>{' '}
                </Nav>
              ) : (
                <Nav className="ml-auto flex-md-column">
                  <NavLink to={authLocation ? location.pathname : LOGIN_ROUTE}>
                    <Button variant="outline-dark" disabled={authLocation}>
                      Авторизація
                    </Button>{' '}
                  </NavLink>
                </Nav>
              )}
            </Offcanvas.Body>
          </Offcanvas>
        </Container>
      </Navbar>
      <UserMenu
        show={userMenuVisible}
        onHide={() => setUserMenuVisible(false)}
      />
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
