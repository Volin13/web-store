import React from 'react';
import BasketItem from './BasketItem';

const BasketList = ({ list, removeCard, reduceOne, addOne }) => {
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ height: '45vh', overflow: 'auto' }}
    >
      {list.length > 0 ? (
        <>
          {list.map((item, index) => (
            <BasketItem
              addOne={addOne}
              reduceOne={reduceOne}
              key={index}
              item={item}
              index={index}
              removeCard={removeCard}
            />
          ))}
        </>
      ) : (
        <h2>Ваша корзина порожня</h2>
      )}
    </div>
  );
};

export default BasketList;
