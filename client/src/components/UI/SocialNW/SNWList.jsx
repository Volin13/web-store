import React from 'react';
import instagramIcon from '../../../assets/socialIcons/social-instagram-svgrepo-com.svg';
import facebookIcon from '../../../assets/socialIcons/social-facebook-svgrepo-com.svg';
import telegramIcon from '../../../assets/socialIcons/social-telegram-svgrepo-com.svg';
import twitterIcon from '../../../assets/socialIcons/social-twitter-svgrepo-com.svg';
import youtubeIcon from '../../../assets/socialIcons/social-youtube-svgrepo-com.svg';
import SNWItem from './SNWItem';

const SNWList = () => {
  return (
    <>
      <ul className="d-flex justify-content-around align-items-center">
        <li>
          <SNWItem url="https://www.instagram.com/" image={instagramIcon} />
        </li>
        <li>
          <SNWItem
            url="https://www.facebook.com/?locale=uk_UA"
            image={facebookIcon}
          />
        </li>
        <li>
          <SNWItem url="https://web.telegram.org" image={telegramIcon} />
        </li>
        <li>
          <SNWItem url="https://x.com/?lang=uk" image={twitterIcon} />
        </li>
        <li>
          <SNWItem url="https://www.youtube.com/" image={youtubeIcon} />
        </li>
      </ul>
    </>
  );
};

export default SNWList;
