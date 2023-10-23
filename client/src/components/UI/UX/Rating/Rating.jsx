import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import { createRating } from '../../../../http/deviceApi';
import css from './Rating.module.css';

const Rating = ({ deviceId, apiRating, isAuth }) => {
  const rating = useRef(null);
  const ratingActive = useRef(null);
  const ratingValue = useRef(null);
  const [rate, setRate] = useState(0);

  const ratingActiveWidth = apiRating / 0.1;
  useEffect(() => {
    ratingActive.current.style.width = `${ratingActiveWidth}%`;
  }, [ratingActiveWidth]);

  const hendleActiveStarChange = value => {
    ratingActive.current.style.width = `${value * 10}%`;
  };
  return (
    <div ref={rating} className={css.rating} style={{ maxWidth: '50%' }}>
      <div className={css.rating_body}>
        <div ref={ratingActive} className={css.rating_active}></div>
        <div className={css.rating_items}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item => (
            <input
              type="radio"
              onMouseEnter={() => {
                hendleActiveStarChange(item);
              }}
              onMouseLeave={() =>
                (ratingActive.current.style.width = `${ratingActiveWidth}%`)
              }
              key={item}
              className={css.rating_item}
              value={item}
              name="rating"
              onClick={e => {
                setRate(Number(e.target.value));
                createRating(deviceId, rate, isAuth);
              }}
            />
          ))}
        </div>
      </div>
      <div ref={ratingValue} className={css.rating_value}>
        {apiRating}
      </div>
    </div>
  );
};

export default Rating;
