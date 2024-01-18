import React, { useState } from 'react';
import { Carousel, Image } from 'react-bootstrap';

const DeviceImgSlider = ({ showSlider, deviceImages }) => {
  const [index, setIndex] = useState(0);

  const handleSelect = selectedIndex => {
    setIndex(selectedIndex);
  };
  return (
    <>
      {showSlider && (
        <Carousel activeIndex={index} onSelect={handleSelect}>
          {deviceImages?.map(item => (
            <Carousel.Item>
              <Image
                width={'100%'}
                //   className={`${!device?.inStock ? css.greyColors : ''}`}
                src={process.env.REACT_APP_API_URL + deviceImages?.fileName}
                fluid
              />{' '}
              <Carousel.Caption>
                <h3>First slide label</h3>
                <p>
                  Nulla vitae elit libero, a pharetra augue mollis interdum.
                </p>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      )}
    </>
  );
};

export default DeviceImgSlider;
