import React from 'react';
import BasketItem from './BasketItem';

const BasketList = ({ list, removeCard }) => {
  return (
    <div style={{ height: '45vh', overflow: 'auto' }}>
      {list.length > 0 ? (
        <div className="d-flex flex-column align-items-center justify-content-center">
          {list.map((item, index) => (
            <BasketItem
              key={index}
              item={item}
              index={index}
              removeCard={removeCard}
            />
          ))}
        </div>
      ) : (
        <h2>Ваша корзина порожня</h2>
      )}
    </div>
  );
};

export default BasketList;
