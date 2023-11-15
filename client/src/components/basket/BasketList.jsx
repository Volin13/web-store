import React from 'react';
import BasketItem from './BasketItem';

const BasketList = ({ list, removeCard, reduceOne, addOne, closeModal }) => {
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '20vh' }}
    >
      {list?.length > 0 ? (
        <ul
          className="d-flex align-items-center justify-content-center mb-2 "
          style={{
            height: '50vh',
            overflow: 'auto',
            paddingTop: '10px',
            width: '100%',
          }}
        >
          {list.map((item, index) => (
            <BasketItem
              closeModal={closeModal}
              addOne={addOne}
              reduceOne={reduceOne}
              key={index}
              item={item}
              index={index}
              removeCard={removeCard}
            />
          ))}
        </ul>
      ) : (
        <h2>Ваш кошик порожній</h2>
      )}
    </div>
  );
};

export default BasketList;
