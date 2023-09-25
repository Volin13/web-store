import React from 'react';
import { useContext } from 'react';
import { Card, Row } from 'react-bootstrap';
import { Context } from '..';

const BrandBar = () => {
  const { device } = useContext(Context);
  return (
    <Row className="d-flex">
      {device.brands.map(brand => (
        <Card
          style={{ cursor: 'pointer', width: 'auto' }}
          key={brand.id}
          className="p-3"
          onClick={() => {
            device.setSelectedBrand(brand);
          }}
          border={brand.id === device.selectedBrand.id ? 'danger' : 'light'}
        >
          {brand.name}
        </Card>
      ))}
    </Row>
  );
};

export default BrandBar;
