import React from 'react';
import { Image } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import css from './Logo.module.css';
import storeLogo from '../../../assets/shopIcons/shoppingLogo.svg';
import PropTypes from 'prop-types';

const Logo = ({ device, toRoute }) => {
  return (
    <>
      <NavLink
        className={css.navBar_mainLogo}
        to={toRoute}
        onClick={() => {
          device.setSelectedBrand({});
          device.setSelectedType({});
          device.setQuery('');
        }}
      >
        Online
        <Image
          className={css.navBar_mainLogo_image}
          src={storeLogo}
          width={25}
          height={25}
        />
        Store
      </NavLink>
    </>
  );
};

Logo.propTypes = {
  device: PropTypes.object,
  toRoute: PropTypes.string,
};

export default Logo;
