import React, { useState } from 'react';
import css from './MenuIcon.module.css';
import { ReactComponent as FirstDot } from '../../../../assets/defultIcons/menu/firstDot.svg';
import { ReactComponent as SecondDot } from '../../../../assets/defultIcons/menu/secondDot.svg';
import { ReactComponent as ThirdDot } from '../../../../assets/defultIcons/menu/thirdDot.svg';

const MenuIcon = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={css.menuThumb}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <FirstDot className={isHovered ? css.rotateAnimationFirst : ''} />
      <SecondDot />
      <ThirdDot className={isHovered ? css.rotateAnimationSecond : ''} />
    </div>
  );
};

export default MenuIcon;
