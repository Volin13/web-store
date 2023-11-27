import React from 'react';
import { ListGroup } from 'react-bootstrap';
import OrdersItem from './OrdersItem';

const OrdersList = ({ list }) => {
  return (
    <ListGroup>
      {list.map((item, index) => (
        <OrdersItem key={index} item={item} />
      ))}
    </ListGroup>
  );
};

export default OrdersList;
