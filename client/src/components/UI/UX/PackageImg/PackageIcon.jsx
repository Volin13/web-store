import React, { useEffect, useState } from 'react';
import { Image } from 'react-bootstrap';
import twoBigPacks from '../../../../assets/shopIcons/package-svgrepo-com.svg';
import oneBigPack from '../../../../assets/shopIcons/package-box-svgrepo-com.svg';
import twoSmallPacks from '../../../../assets/shopIcons/shopping-bag-svgrepo-com.svg';
import threeBigPacks from '../../../../assets/shopIcons/threePackags-svgrepo-com.svg';
import css from './PackageImage.module.css';
import PropTypes from 'prop-types';

const PackageIcon = ({ count }) => {
  const [img, setImg] = useState(null);
  // Зміна іконки в залежності від кількості товарів у кошику
  useEffect(() => {
    setImg(chooseImage(count));
  }, [count]);
  const chooseImage = count => {
    if (count >= 4) {
      return threeBigPacks;
    } else if (count === 3) {
      return twoBigPacks;
    } else if (count === 2) {
      return oneBigPack;
    } else {
      return twoSmallPacks;
    }
  };

  return (
    <>
      <Image
        className={img ? css.packageIcon : ''}
        width={100}
        height={100}
        src={img}
      />
    </>
  );
};

PackageIcon.propTypes = {
  count: PropTypes.number.isRequired,
};

export default PackageIcon;
