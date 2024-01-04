import React, { useState } from 'react';
import css from './MenuIcon.module.css';
import { ReactComponent as Circle } from '../../../../assets/defultIcons/menu/circle-svgrepo-com.svg';
import { ReactComponent as HalfCircle } from '../../../../assets/defultIcons/menu/circle-notch-svgrepo-com.svg';

const MenuIcon = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={css.menuThumb}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <HalfCircle className={isHovered ? css.rotateAnimationFirst : ''} />
      <Circle />
      <HalfCircle className={isHovered ? css.rotateAnimationSecond : ''} />
    </div>
  );
};

export default MenuIcon;
