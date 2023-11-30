import { observer } from 'mobx-react-lite';
import React from 'react';
import { useContext } from 'react';
import { Col } from 'react-bootstrap';
import { Context } from '../..';
import DeviceItem from './DeviceItem';

const DeviceList = observer(() => {
  const { device } = useContext(Context);
  return (
    <Col md="12" className="d-flex mt-3">
      {device.devices.map(device => (
        <DeviceItem key={device.id} device={device}></DeviceItem>
      ))}
    </Col>
  );
});

export default DeviceList;
