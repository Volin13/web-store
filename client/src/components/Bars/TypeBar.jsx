import React from 'react';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { ListGroup } from 'react-bootstrap';
import { Context } from '../..';

const TypeBar = observer(() => {
  const { device } = useContext(Context);
  return (
    <ListGroup
      style={{ position: 'sticky', maxHeight: '300px', overflow: 'auto' }}
    >
      {device.types.map(type => (
        <ListGroup.Item
          className="text-center text-sm-start"
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
