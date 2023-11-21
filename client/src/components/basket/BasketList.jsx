import React from 'react';
import BasketItem from './BasketItem';

const BasketList = ({ list, removeCard, reduceOne, addOne, closeModal }) => {
  return (
    <div style={{ minHeight: '20vh' }}>
      {list?.length > 0 ? (
        <ul
          className="d-flex flex-column align-items-center mb-2 "
          style={{
            maxHeight: '50vh',
            overflow: 'auto',
            paddingTop: '10px',
            width: '100%',
            margin: '0 auto',
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
