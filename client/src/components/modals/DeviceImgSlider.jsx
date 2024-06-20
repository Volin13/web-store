import React, { useState } from 'react';
import { Carousel, Image, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

const DeviceImgSlider = ({ show, onHide, deviceImages = [], mainImg = '' }) => {
  const [index, setIndex] = useState(0);
  const handleSelect = selectedIndex => {
    setIndex(selectedIndex);
  };

  return (
    <Modal
      dialogClassName="modal-90h"
      // size="lg"
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
                  height={250}
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
