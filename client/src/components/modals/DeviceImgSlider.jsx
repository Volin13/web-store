import React, { useState } from 'react';
import { Carousel, Image, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import useBreakpoint from '../../hooks/useBreakpoint';

const DeviceImgSlider = ({ show, onHide, deviceImages = [], mainImg = '' }) => {
  const [index, setIndex] = useState(0);
  const handleSelect = selectedIndex => {
    setIndex(selectedIndex);
  };
  let breakpoint = useBreakpoint();
  const getImgSize = () => {
    switch (breakpoint) {
      case 'xs':
        return 250;
      case 'sm':
        return 450;
      case 'md':
        return 550;
      case 'lg':
        return 650;
      case 'xl':
        return 750;
      default:
        return 250;
    }
  };
  return (
    <Modal
      // dialogClassName="modal-90h"
      size="lg"
      show={show}
      onHide={onHide}
      centered
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        {deviceImages?.length > 0 ? (
          <Carousel
            slide
            touch
            activeIndex={index}
            variant="dark"
            pause="hover"
            onSelect={handleSelect}
            style={{
              padding: '0 35px 35px',
              textAlign: 'center',
            }}
          >
            {deviceImages?.map(item => (
              <Carousel.Item key={item?.id}>
                <Image
                  height={getImgSize()}
                  src={item?.fileName}
                  style={{
                    objectFit: 'scale-down',
                  }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        ) : (
          <div className="d-flex justify-content-center">
            <Image
              height="400px"
              //   className={`${!device?.inStock ? css.greyColors : ''}`}
              src={mainImg}
              style={{
                margin: '0 auto',
              }}
            />
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

DeviceImgSlider.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  deviceImages: PropTypes.array,
  mainImg: PropTypes.string,
};

export default DeviceImgSlider;
