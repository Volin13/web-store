import React from 'react';
import BasketItem from './BasketItem';

const BasketList = ({ list, removeCard, reduceOne, addOne, closeModal }) => {
  return (
    <>
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
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: '20vh' }}
        >
          <h2>Ваш кошик порожній</h2>
        </div>
      )}
    </>
  );
};

export default BasketList;
