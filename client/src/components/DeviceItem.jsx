import React from 'react';
import { Card, Col, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { DEVICE_ROUTE } from '../utils/constants';
import star from '../assets/shopIcons/smallStar.svg';
const DeviceItem = ({ device }) => {
  const navigate = useNavigate();

  const styledContainer = {
    width: 150,
    overflow: 'hidden',
    cursor: 'pointer',
  };

  return (
    <Col
      md={3}
      className="mt-3"
      onClick={() => navigate(DEVICE_ROUTE + '/' + device.id)}
    >
      <Card style={{ width: 150, cursor: 'pointer' }} border={'light'}>
        <div className="d-flex justify-content-center align-items-center deviceItem_imgThumb">
          <Image
            className="deviceItem_img"
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
        <div style={styledContainer}>
          <span
            style={{
              display: 'inline-block',
              height: '3.1em',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}
          >
            {device.name}
          </span>
        </div>
      </Card>
    </Col>
  );
};

export default DeviceItem;
