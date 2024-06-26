import React, { useState, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useContext, useEffect } from 'react';
import { Image, ListGroup, Placeholder } from 'react-bootstrap';
import Arrow from '../../assets/defultIcons/down-arrow-arrows-svgrepo-com.svg';
import { Context } from '../..';
import PropTypes from 'prop-types';

const BrandBar = observer(({ loading }) => {
  const { device } = useContext(Context);
  const [hidden, setHidden] = useState(true);
  const [showMoreBtn, setShowMoreBtn] = useState(true);
  const [checkedItem, setСheckedItem] = useState(false);
  const listRef = useRef(null);
  const timerRef = useRef(null);

  // кнопка пропадає в кінці списку
  const list = listRef.current;
  const isEndOfList =
    list?.scrollWidth - list?.scrollLeft === list?.clientWidth;
  const hiddenList = listRef?.current?.clientHeight === 49;

  useEffect(() => {
    if (isEndOfList && timerRef.current && hiddenList) {
      setShowMoreBtn(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listRef, timerRef.current]);

  const handleScroll = () => {
    clearTimeout(timerRef.current);
    // кнопка пропадає на час скролінгу
    if (hiddenList) {
      setShowMoreBtn(false);
    }
    // Час для визначення завершення скролінгу
    timerRef.current = setTimeout(() => {
      // кнопка з'являється під кінець склолінгу

      setShowMoreBtn(true);
    }, 300);
  };

  const handleBrandBarClick = brand => {
    // якщо натиснутий бренд співпадає з обраним раніше то відміняємо фільтрацію
    if (brand.id === device.selectedBrand.id) {
      device.setSelectedBrand({});
      setСheckedItem(false);
    } else {
      device.setSelectedBrand(brand);
      setСheckedItem(device.selectedBrand);
    }
  };

  const handleWheel = e => {
    if (list) {
      list.scrollLeft += e.deltaY;
    }
  };
  const handleMouseWheel = action => {
    if (action === 'enter') {
      document.body.style.overflow = 'hidden';
    }
    if (action === 'leave') {
      document.body.style.overflow = 'auto';
    }
  };

  return (
    <div
      className="position-relative"
      style={{ marginBottom: hidden ? '' : '45px' }}
    >
      <ListGroup
        onScroll={handleScroll}
        onWheel={e => handleWheel(e)}
        onMouseEnter={() => handleMouseWheel('enter')}
        onMouseLeave={() => handleMouseWheel('leave')}
        ref={listRef}
        className={`d-flex ${
          hidden ? 'brandListHidden' : 'brandListOpen'
        } justify-content-start  text-center`}
        style={{
          width: hidden ? '95%' : '100%',
        }}
        horizontal={true}
      >
        {loading ? (
          <>
            {Array.from({ length: 7 }, (_, index) => (
              <ListGroup.Item
                key={index}
                style={{
                  cursor: 'pointer',
                  width: hidden ? '110px' : '50%',
                  minWidth: '110px',
                  border: '1px solid #e6e9ec',
                }}
              >
                <Placeholder as="p" animation="glow">
                  <Placeholder xs={12} />
                </Placeholder>
              </ListGroup.Item>
            ))}
          </>
        ) : (
          <>
            {checkedItem && (
              <ListGroup.Item
                style={{
                  cursor: 'pointer',
                  width: hidden ? '' : '50%',
                  minWidth: '110px',
                  border: '1px solid #e6e9ec',
                }}
                active={checkedItem?.id === device.selectedBrand?.id}
                action
                onClick={() => {
                  device.setSelectedBrand({});
                  setСheckedItem(false);
                }}
              >
                {checkedItem?.name}
              </ListGroup.Item>
            )}
            {device?.brands?.map(brand => (
              <ListGroup.Item
                style={{
                  cursor: 'pointer',
                  width: hidden ? '110px' : '50%',
                  minWidth: '110px',
                  border: '1px solid #e6e9ec',
                  display:
                    brand.id === device.selectedBrand.id
                      ? 'none'
                      : 'inline-block',
                }}
                action
                key={brand.id}
                onClick={() => handleBrandBarClick(brand)}
              >
                {brand.name}
              </ListGroup.Item>
            ))}
          </>
        )}
      </ListGroup>
      {showMoreBtn && (
        <button
          onClick={() => {
            setHidden(!hidden);
          }}
          className={`d-flex align-items-center justify-content-center ${
            hidden ? 'showMoreBtn' : 'showLessBtn'
          }`}
        >
          <Image
            width={25}
            height={25}
            src={Arrow}
            className={`${
              hidden ? 'brandBarBtnOpenImg' : 'brandBarBtnCloseImg'
            }`}
          />
        </button>
      )}
    </div>
  );
});

BrandBar.propTypes = {
  loading: PropTypes.bool,
};

export default BrandBar;
