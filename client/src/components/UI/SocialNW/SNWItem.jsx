import React from 'react';
import PropTypes from 'prop-types';
import css from './SNW.module.css';
import { Image } from 'react-bootstrap';

const SNWItem = ({ image, url }) => {
  return (
    <a target="_blank" rel="noreferrer" href={url} className={css.iconThumb}>
      <Image src={image} className={css.icon} />
    </a>
  );
};
SNWItem.propTypes = {
  image: PropTypes.string,
  url: PropTypes.string,
};
export default SNWItem;
