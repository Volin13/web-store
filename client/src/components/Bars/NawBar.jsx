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
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
  SHOP_ROUTE,
} from '../../utils/constants';
import { observer } from 'mobx-react-lite';
import storeLogo from '../../assets/shopIcons/shoppingLogo.svg';
import basketImg from '../../assets/shopIcons/buy-cart-discount-3-svgrepo-com.svg';
import BasketModal from '../modals/BasketModal';
import MenuIcon from '../UI/UX/MenuIcon/MenuIcon';
import MainFilter from '../UI/UX/MainFilter/MainFilter';

const NavBar = observer(() => {
  const [basketVisible, setBasketVisible] = useState(false);
  const [basketLength, setBasketLength] = useState(0);
  const [show, setShow] = useState(false);

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
          {/* logo */}
          <Col md="3">
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
          </Col>

          {/* search */}

          <Col md="7">
            <MainFilter />
          </Col>
          <Col md="2" className="d-flex align-items-center ">
            {/* basket*/}
            {!basketLocation && (
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip id="tooltip-bottom">Кошик</Tooltip>}
              >
                <button
                  className="d-flex align-items-center justify-content-center basket_btn"
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
              {user.isAuth ? (
                <Nav
                  className="d-flex flex-column align-items-start"
                  id="collapse"
                  style={{
                    gap: '20px',
                  }}
                >
                  <NavLink to={ADMIN_ROUTE}>
                    <Button
                      variant="outline-dark"
                      onClick={() => setShow(false)}
                    >
                      Адміністратору
                    </Button>{' '}
                  </NavLink>
                  <Button
                    variant="outline-dark"
                    onClick={() => {
                      setShow(false);
                      logOut();
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
