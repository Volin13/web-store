import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Image, ListGroup, Placeholder } from 'react-bootstrap';
import { Context } from '../..';
import showMoreIcon from '../../assets/defultIcons/down-arrow-arrows-svgrepo-com.svg';
import hideMoreIcon from '../../assets/defultIcons/up-arrow-arrows-svgrepo-com.svg';

const TypeBar = observer(({ loading }) => {
  const { device } = useContext(Context);
  const [showBar, setShowBar] = useState(false);
  const [showBtn, setShowBtn] = useState(false);
  // const [scrollPosition, setScrollPosition] = useState(0);
  const listRef = useRef(null);

  const handleTypeBarClick = type => {
    // якщо натиснутий тип співпадає з обраним раніше то відміняємо фільтрацію
    if (type.id === device.selectedType.id) {
      device.setSelectedType({});
    } else {
      device.setSelectedType(type);
    }
  };
  // const list = listRef?.current;

  // useEffect(() => {
  //   const position = listRef?.current?.scrollTop;
  //   setScrollPosition(position);

  //   if (device.selectedType.name && scrollPosition && list !== null) {
  //     listRef?.current?.scrollTo({
  //       top: scrollPosition,
  //       behavior: 'smooth', // опціонально: зробить прокрутку плавною
  //     });
  //   }
  // }, [device.selectedType.name, list]);

  // const handleScroll = () => {
  //   if (listRef.current) {
  //   }
  // };
  return (
    <div
      onMouseEnter={() => {
        setShowBtn(true);
      }}
      onMouseLeave={() => {
        setShowBtn(false);
      }}
      className="position-relative"
    >
      <ListGroup
        ref={listRef}
        // onScroll={handleScroll}
        style={{
          position: 'sticky',
          maxHeight: showBar ? '80vh' : '141px',
          borderBottom: '1px solid #e6e9ec',
          overflow: 'auto',
        }}
        className="typeBarList"
      >
        {loading ? (
          <>
            {Array.from({ length: 4 }, (_, index) => (
              <ListGroup.Item
                key={index}
                className="text-center text-sm-start "
              >
                <Placeholder as="p" animation="glow">
                  <Placeholder xs={12} />
                </Placeholder>
              </ListGroup.Item>
            ))}
          </>
        ) : (
          <>
            {device?.types?.map(type => (
              <ListGroup.Item
                className="text-center text-sm-start"
                style={{ cursor: 'pointer' }}
                active={type.id === device.selectedType.id}
                key={type.id}
                onClick={() => {
                  handleTypeBarClick(type);
                }}
                action
              >
                {type.name}
              </ListGroup.Item>
            ))}
          </>
        )}
      </ListGroup>
      {showBtn && (
        <button
          type="button"
          className="d-flex align-items-center justify-content-center"
          style={{
            width: '100%',
            border: '1px solid #e6e9ec',
            borderRadius: '6px',
            position: 'absolute',
            left: 0,
            bottom: '-25px',
          }}
          onClick={() => {
            setShowBar(!showBar);
          }}
        >
          {!showBar ? (
            <Image width={25} height={25} src={showMoreIcon} />
          ) : (
            <Image width={25} height={25} src={hideMoreIcon} />
          )}
        </button>
      )}
    </div>
  );
});

TypeBar.propTypes = {
  loading: PropTypes.bool,
};

export default TypeBar;
