import React from 'react';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { ListGroup } from 'react-bootstrap';
import { Context } from '../..';

const TypeBar = observer(() => {
  const { device } = useContext(Context);
  return (
    <ListGroup
      className="mb-3"
      style={{ position: 'sticky', maxHeight: '500px', overflow: 'auto' }}
    >
      {device.types.map(type => (
        <ListGroup.Item
          style={{ cursor: 'pointer' }}
          active={type.id === device.selectedType.id}
          key={type.id}
          onClick={() => {
            device.setSelectedType(type);
            device.setSelectedBrand({});
          }}
          action
        >
          {type.name}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
});

export default TypeBar;
