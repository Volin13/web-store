import React from 'react';
import OrdersItem from './OrdersItem';
import PropTypes from 'prop-types';

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

OrdersList.propTypes = {
  list: PropTypes.array.isRequired,
};
export default OrdersList;
