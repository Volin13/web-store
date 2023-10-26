import React from 'react';
import BasketItem from './BasketItem';

const BasketList = ({ list, removeFromBasket }) => {
  return (
    <>
      {list.length > 0 ? (
        <div className="d-flex flex-column align-items-center justify-content-center">
          {list.map((item, index) => (
            <BasketItem
              item={item}
              index={index}
              removeItemFn={removeFromBasket}
            />
          ))}
        </div>
      ) : (
        <h2>Ваша корзина порожня</h2>
      )}
    </>
  );
};

export default BasketList;
