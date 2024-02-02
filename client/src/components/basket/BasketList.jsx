import React from 'react';
import PropTypes from 'prop-types';
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
            margin: '0 auto',
          }}
        >
          {list.map((item, index) => (
            <li key={index} style={{ width: '80%' }}>
              <BasketItem
                closeModal={closeModal}
                addOne={addOne}
                reduceOne={reduceOne}
                item={item}
                index={index}
                removeCard={removeCard}
              />
            </li>
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

BasketList.propTypes = {
  list: PropTypes.array,
  removeCard: PropTypes.func,
  reduceOne: PropTypes.func,
  addOne: PropTypes.func,
  closeModal: PropTypes.func,
};

export default BasketList;
