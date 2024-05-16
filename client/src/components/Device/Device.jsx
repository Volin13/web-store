import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Container, Image, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchSingleDevice,
  fetchBrands,
  fetchTypes,
} from '../../http/deviceApi';
import CountUp from 'react-countup';
import Rating from '../UI/UX/Rating/Rating';
import CommentSection from '../UI/UX/CommentSection/CommentSection';
import { LOGIN_ROUTE } from '../../utils/constants';
import { Context } from '../../';
import { toast } from 'react-toastify';
import css from './Device.module.css';
import PackageIcon from '../UI/UX/PackageImg/PackageIcon';
import showMoreIcon from '../../assets/defultIcons/down-arrow-arrows-svgrepo-com.svg';
import hideMoreIcon from '../../assets/defultIcons/up-arrow-arrows-svgrepo-com.svg';
import editDeviceImg from '../../assets/shopIcons/editDevice.svg';
import loadImg from '../../assets/shopIcons/shoppingLogo.svg';
import playBtn from '../../assets/shopIcons/playBtn.svg';
import EditDeviceModal from '../modals/EditDevice';
import DeviceImgSlider from '../modals/DeviceImgSlider';

const Device = () => {
  const [singleDevice, setSingleDevice] = useState({
    info: [],
    deviceImages: [],
  });
  const [info, setInfo] = useState([]);
  const [clickedState, setClickedState] = useState(false);
  const [basketLength, setBasketLength] = useState(0);
  const [showList, setShowList] = useState(false);
  const [isOverflowed, setIsOverflowed] = useState(false);
  const [showSlider, setShowSlider] = useState(false);
  const [showEditDeviceModal, setShowEditDeviceModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const containerRef = useRef(null);

  const { id } = useParams();
  const { user, basket, device } = useContext(Context);

  const localbasketData = sessionStorage.getItem('basket');
  const localBasket = localbasketData
    ? JSON.parse(localbasketData)
    : basket.basket;

  // Отримання інформації про девайс
  // При першому завантаженні записую в стор типи і бренди, шоб потім вибрати з існуючих

  useEffect(() => {
    fetchSingleDevice(id).then(data => {
      setSingleDevice(data);
      setLoading(false);
    });
    fetchTypes().then(data => device.setTypes(data));
    fetchBrands().then(data => device.setBrands(data));
  }, [id, device]);

  // Визначення величини кошика для зміни іконки при кліку на кнопку "купити"
  useEffect(() => {
    setBasketLength(basket.basket.length || localBasket.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basket.basket]);

  // Кнопка розгортання списку характеристик додається за умови що їх більше ніж 3

  useEffect(() => {
    const container = containerRef?.current;
    if (container) {
      const isContentOverflowed =
        container.scrollHeight > container.clientHeight;
      // Перевірка, чи вміст більший за висоту
      setIsOverflowed(isContentOverflowed);
    }
  }, [singleDevice?.info?.length]);

  // Формування замовлення в кошик
  const hendleOrderClick = () => setClickedState(true);
  const addOrder = () => {
    basket.addToBasket({
      id: singleDevice.id,
      title: singleDevice.name,
      price: singleDevice.newPrice || singleDevice.price,
      added: Date.now(),
      mainImg: singleDevice.mainImg,
    });

    toast.info(`${singleDevice.name} було додано до кошика`);
    sessionStorage.setItem('basket', JSON.stringify(basket.basket));
  };

  return (
    <Container className="mt-3 ">
      <Row className="d-flex align-items-center text-center">
        <Col md={4}>
          <button
            type="button"
            onClick={() => {
              setShowSlider(true);
            }}
            className="position-relative"
          >
            <div
              className={`d-flex justify-content-between align-items-center ${css.blurOnHover}`}
              style={{ minHeight: '300px' }}
            >
              <Image
                width={'100%'}
                height={300}
                className={`${!singleDevice?.inStock ? css.greyColors : ''}`}
                src={loading ? loadImg : singleDevice.mainImg}
                style={{ objectFit: 'contain' }}
              />
            </div>
            {!loading && (
              <Image
                width={80}
                height={80}
                src={playBtn}
                fluid
                className={css.playBtnImg}
              />
            )}
          </button>
        </Col>
        <Col
          md={4}
          className="position-relative"
          style={{ paddingTop: '75px' }}
        >
          <button
            type="button"
            className={css.editDeviceBtn}
            onClick={() => {
              setShowEditDeviceModal(true);
            }}
          >
            <span>Редагувати</span>
            <Image width={30} height={30} src={editDeviceImg} />{' '}
          </button>
          <h1
            style={{
              display: 'inline-block',
              maxWidth: '100%',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}
          >
            {singleDevice.name}
          </h1>
        </Col>
        <Col md={4}>
          <Card
            className="d-flex flex-column align-items-center justify-content-around position-relative p-3"
            style={{
              width: '100%',
              height: 300,
              fontSize: 32,
              border: '5px solid lightgray',
            }}
          >
            {singleDevice?.inStock && singleDevice?.discount ? (
              <>
                <h3
                  className={css.initialPrice}
                  style={{
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '20px',
                  }}
                >
                  {singleDevice.price}
                </h3>
                <h3 className={css.newPrice}>
                  <CountUp
                    start={0}
                    end={+singleDevice.newPrice}
                    duration={2}
                  />
                  {' грн'}
                </h3>{' '}
              </>
            ) : (
              <h3>
                {' Від:'}{' '}
                <CountUp start={0} end={+singleDevice.price} duration={2} />
                {' грн.'}
              </h3>
            )}

            <PackageIcon count={basket.basket.length || localBasket.length} />
            {user.isAuth ? (
              <Button
                variant={clickedState ? 'info' : 'outline-dark'}
                onClick={() => {
                  addOrder();
                  hendleOrderClick();
                  setBasketLength(basketLength + 1);
                }}
                disabled={!singleDevice?.inStock}
              >
                {singleDevice?.inStock
                  ? 'Додати до корзини'
                  : 'Немає в наявності'}
              </Button>
            ) : (
              <Button
                variant="outline-dark"
                onClick={() => {
                  navigate(LOGIN_ROUTE);
                }}
              >
                Увійдіть щоб купити
              </Button>
            )}
          </Card>
        </Col>
      </Row>
      <Row className=" my-3 d-flex flex-column align-items-center py-3 position-relative">
        <Row className="d-flex justify-content-between mb-1">
          <Col md={6}>
            <h2 className="mb-0" style={{ maxWidth: '50%' }}>
              Характеристики
            </h2>
          </Col>

          {/* Рейтинг */}

          <Col md={6}>
            <Rating
              userId={user.id}
              deviceId={singleDevice.id}
              apiRating={singleDevice.rating}
              isAuth={user.isAuth}
            />
          </Col>
        </Row>

        {/* Девайс інфо  */}
        {singleDevice?.info?.length > 0 && (
          <ul
            className={css.deviceInfoThumb}
            ref={containerRef}
            style={{
              maxHeight: showList ? '10000px' : '155px',
            }}
          >
            {singleDevice?.info.map((info, index) => (
              <li
                key={info.id}
                className="d-flex justify-content-between align-items-center"
                style={{
                  background: index % 2 === 0 ? 'lightgrey' : 'transparent',
                  padding: '10px',
                }}
              >
                <span style={{ display: 'inline-block', width: '40%' }}>
                  {info.title}:
                </span>
                <span
                  style={{
                    display: 'inline-block',
                    width: '40%',
                    textAlign: 'end',
                  }}
                >
                  {' '}
                  {info.description}
                </span>
              </li>
            ))}
          </ul>
        )}
        {isOverflowed && (
          <button
            type="button"
            className={`d-flex align-items-center justify-content-center ${
              css.showBtn
            } ${!showList ? css.showMoreBtn : css.showLessBtn}`}
            onClick={() => {
              setShowList(!showList);
            }}
            style={{ backgroundColor: 'white' }}
          >
            {!showList ? (
              <Image width={25} height={25} src={showMoreIcon} />
            ) : (
              <Image width={25} height={25} src={hideMoreIcon} />
            )}
          </button>
        )}
      </Row>
      <CommentSection user={user} id={id} device={singleDevice} />
      <DeviceImgSlider
        onHide={() => setShowSlider(false)}
        deviceImages={singleDevice?.deviceImages}
        mainImg={singleDevice?.mainImg}
        show={showSlider}
      />

      <EditDeviceModal
        show={showEditDeviceModal}
        deviceToEdit={singleDevice}
        info={info}
        setInfo={setInfo}
        onHide={() => setShowEditDeviceModal(false)}
      />
    </Container>
  );
};

export default Device;
