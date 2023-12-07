import React from 'react';
import OrdersItem from './OrdersItem';

const OrdersList = ({ list }) => {
  return (
    <div>
      {list.length !== 0 && (
        <ul>
          {list?.map((item, index) => (
            <OrdersItem key={item.id} item={item} index={index + 1} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrdersList;
