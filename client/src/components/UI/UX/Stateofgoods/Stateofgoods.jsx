import React from 'react';
import css from './Stateofgoods.module.css';
import notInStockImg from '../../../../assets/shopIcons/Unavailable.svg';
import discountImg from '../../../../assets/shopIcons/discount.svg';
import { Image } from 'react-bootstrap';
import PropTypes from 'prop-types';

const Stateofgoods = ({ device }) => {
  return (
    <>
      {!device?.inStock && (
        <div className={css.notInStockImgThumb}>
          <Image
            height={100}
            width={100}
            className={css.notInStockImg}
            src={notInStockImg}
          />
        </div>
      )}

      {device?.inStock && device?.discount && (
        <div className={css.discountImgThumb}>
          <Image
            height={50}
            width={50}
            className={css.discountImg}
            src={discountImg}
          />
        </div>
      )}
    </>
  );
};

Stateofgoods.propTypes = {
  device: PropTypes.object,
};
export default Stateofgoods;
