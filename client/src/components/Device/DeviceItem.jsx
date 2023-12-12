import React from 'react';
import { Card, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { DEVICE_ROUTE } from '../../utils/constants';
import star from '../../assets/shopIcons/smallStar.svg';
import css from './Device.module.css';

const DeviceItem = ({ device }) => {
  const navigate = useNavigate();

  return (
    <div
      className={css.deviceItemCol}
      onClick={() => navigate(DEVICE_ROUTE + '/' + device.id)}
    >
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
    </div>
  );
};

export default DeviceItem;
