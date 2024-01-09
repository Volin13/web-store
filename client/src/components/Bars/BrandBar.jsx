import { observer } from 'mobx-react-lite';
import React, { useState, useRef } from 'react';
import { useContext, useEffect } from 'react';
import { Image, ListGroup, Placeholder } from 'react-bootstrap';
import Arrow from '../../assets/defultIcons/down-arrow-arrows-svgrepo-com.svg';
import { Context } from '../..';

const BrandBar = observer(({ loading }) => {
  const { device } = useContext(Context);
  const [hidden, setHidden] = useState(true);
  const [showMoreBtn, setShowMoreBtn] = useState(true);
  const [showScrollToBtn, setShowScrollToBtn] = useState(false);
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
      setShowScrollToBtn(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listRef, timerRef.current]);

  const handleScroll = () => {
    setShowScrollToBtn(false);
    clearTimeout(timerRef.current);
    // кнопка пропадає на час скролінгу
    if (hiddenList) {
      setShowMoreBtn(false);
    }
    // Час для визначення завершення скролінгу
    timerRef.current = setTimeout(() => {
      // кнопка з'являється під кінець склолінгу
      if (!isEndOfList) {
        setShowMoreBtn(true);
      }
    }, 300);
  };

  const handleBrandBarClick = brand => {
    // якщо натиснутий бренд співпадає з обраним раніше то відміняємо фільтрацію
    if (brand.id === device.selectedBrand.id) {
      device.setSelectedBrand({});
    } else {
      device.setSelectedBrand(brand);
    }
  };

  const scrollToStart = () => {
    if (list) {
      listRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  const handleWheel = e => {
    if (list) {
      list.scrollLeft += e.deltaY;
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
            {device?.brands?.map(brand => (
              <ListGroup.Item
                style={{
                  cursor: 'pointer',
                  width: hidden ? '110px' : '50%',
                  minWidth: '110px',
                  border: '1px solid #e6e9ec',
                }}
                action
                active={brand.id === device.selectedBrand.id}
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
      {showScrollToBtn && hidden && !showMoreBtn && (
        <button
          onClick={() => {
            scrollToStart();
          }}
          className={`d-flex align-items-center justify-content-center showMoreBtn
          `}
        >
          <Image
            width={25}
            height={25}
            src={Arrow}
            className="scrollToStartBtnImg"
          />
        </button>
      )}
    </div>
  );
});

export default BrandBar;
