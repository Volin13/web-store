import React from 'react';
import { Card, Image, Placeholder } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { DEVICE_ROUTE } from '../../utils/constants';
import star from '../../assets/shopIcons/smallStar.svg';
import css from './Device.module.css';
import storeLogo from '../../assets/shopIcons/shoppingLogo.svg';

const DeviceItem = ({ device, loading }) => {
  const navigate = useNavigate();

  return (
    <li
      className={css.deviceItemCol}
      onClick={() => navigate(DEVICE_ROUTE + '/' + device.id)}
    >
      {loading ? (
        <Card style={{ width: '150px', textAlign: 'center' }} border={'light'}>
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              minHeight: '150px',
              border: '1px solid #13B7E6',
              borderRadius: '15px',
            }}
          >
            <Card.Img variant="top" src={storeLogo} width={100} height={100} />
          </div>
          <Card.Body style={{ padding: '12px 8px' }}>
            <Placeholder
              as={Card.Title}
              animation="glow"
              className="d-flex align-items-center justify-content-between"
            >
              <Placeholder xs={8} bg="primary" />{' '}
              <Placeholder xs={2} bg="primary" />
            </Placeholder>
            <Placeholder
              as={Card.Text}
              animation="glow"
              className="d-flex flex-wrap align-items-center justify-content-between"
            >
              <Placeholder xs={7} bg="primary" />{' '}
              <Placeholder xs={4} bg="primary" />
            </Placeholder>
            <Placeholder
              as={Card.Text}
              animation="glow"
              className="d-flex flex-wrap align-items-center justify-content-between mt-2"
            >
              <Placeholder xs={5} bg="primary" />{' '}
              <Placeholder xs={6} bg="primary" />
            </Placeholder>
          </Card.Body>
        </Card>
      ) : (
        <Card style={{ cursor: 'pointer' }} border={'light'}>
          <div
            className={`d-flex justify-content-center align-items-center ${css.deviceItem_imgThumb}`}
          >
            <Image
              className={css.deviceItem_img}
              src={process.env.REACT_APP_API_URL + device.img}
            />
          </div>
          <div className="text-black-50 d-flex justify-content-between align-items-center">
            <div className="mt-1 d-flex justify-content-between align-items-center">
              {device.price + ' грн'}
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <div>{device.rating}</div>
              <Image src={star} width={18} height={18} />
            </div>
          </div>
          <div className={css.deviceItemTextContainer}>
            <span className={css.deviceItemText}>{device.name}</span>
          </div>
        </Card>
      )}
    </li>
  );
};

export default DeviceItem;
