import React, { useContext, useEffect, useState } from 'react';
import { Image } from 'react-bootstrap';
import twoBigPacks from '../../../../assets/shopIcons/package-svgrepo-com.svg';
import oneBigPack from '../../../../assets/shopIcons/package-box-svgrepo-com.svg';
import twoSmallPacks from '../../../../assets/shopIcons/shopping-bag-svgrepo-com.svg';
import threeBigPacks from '../../../../assets/shopIcons/threePackags-svgrepo-com.svg';
import css from './PackageImage.module.css';
import { Context } from '../../../..';

const PackageIcon = () => {
  const { basket } = useContext(Context);
  const [img, setImg] = useState(null);
  const localbasketData = sessionStorage.getItem('basket');
  const localBasket = localbasketData
    ? JSON.parse(localbasketData)
    : basket.basket;

  useEffect(() => {
    setImg(chooseImage(basket.basket.length || localBasket.length));
    console.log(basket.basket.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basket.basket.length, localBasket.length]);
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
    <div className={css.imageContainer}>
      <Image width={100} height={100} src={img} />
    </div>
  );
};

export default PackageIcon;
