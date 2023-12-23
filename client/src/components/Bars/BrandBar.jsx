import { observer } from 'mobx-react-lite';
import React from 'react';
import { useContext } from 'react';
import { ListGroup } from 'react-bootstrap';
import { Context } from '../..';

const BrandBar = observer(() => {
  const { device } = useContext(Context);

  return (
    <ListGroup
      className="d-flex text-center"
      style={{ position: 'sticky' }}
      horizontal={true}
    >
      {device?.brands?.map(brand => (
        <ListGroup.Item
          style={{ cursor: 'pointer' }}
          active={brand.id === device.selectedBrand.id}
          key={brand.id}
          onClick={() => device.setSelectedBrand(brand)}
          action
        >
          {brand.name}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
});

export default BrandBar;
