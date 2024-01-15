import React, { useContext, useRef, useState } from 'react';
import { Image, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { Context } from '../../../..';
import searchIcon from '../../../../assets/defultIcons/search-svgrepo-com.svg';
import clearIcon from '../../../../assets/defultIcons/clear-circle-svgrepo-com.svg';
import css from './MainFilter.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
  SHOP_ROUTE,
} from '../../../../utils/constants';
const MainFilter = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [visibility, setVisibility] = useState(false);

  const mainFilter = useRef(null);

  const { device } = useContext(Context);

  const navigate = useNavigate();
  const location = useLocation();
  const filterVisivility =
    location.pathname === LOGIN_ROUTE ||
    location.pathname === REGISTRATION_ROUTE;

  const shopLocation = location.pathname === SHOP_ROUTE;
  // Відслідковую ширину невеликих екранів для застосування стилів пошукового інпута
  const smallSizeScreen = window.innerWidth < 560;
  const handleChange = event => {
    if (!visibility) {
      setVisibility(true);
    }
    setInputValue(event.target.value);
  };

  const handleClick = () => {
    if (!shopLocation) {
      navigate(SHOP_ROUTE);
    }
    if (inputValue) {
      device.setQuery(inputValue);
      device.setSelectedType({});
      device.setSelectedBrand({});
    }
  };

  const hendleClearClick = ref => {
    setInputValue('');
    setVisibility(false);
    if (ref) return ref.current.focus(ref);
    else return;
  };
  const handleKeyPress = event => {
    if (event.key === 'Enter') {
      handleClick();
    }
  };
  return (
    <>
      {!filterVisivility && (
        <div
          className={`${
            smallSizeScreen && isHovered
              ? css.mobileSearchInput
              : 'd-flex justify-content-end'
          }`}
        >
          <InputGroup
            hasValidation
            className={`${css.searchInput} ${
              smallSizeScreen && !isHovered && css.searchBtnMobile
            }`}
            style={{
              width: isHovered ? '' : '45px',
            }}
          >
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="tooltip-bottom">Знайти</Tooltip>}
            >
              <button type="button" className="d-flex align-items-center">
                <InputGroup.Text
                  className={css.searchLable}
                  style={{
                    borderRadius: isHovered ? 'initial' : ' 50px',
                    padding: '12px',
                  }}
                  onMouseEnter={() => {
                    setIsHovered(true);
                  }}
                  onClick={handleClick}
                >
                  <Image width={18} height={18} src={searchIcon} />
                </InputGroup.Text>
              </button>
            </OverlayTrigger>

            <Form.Control
              ref={mainFilter}
              className={css.searchInput}
              style={{
                flex: isHovered ? '1 1 auto' : 'unset',
                opacity: isHovered ? '1' : '0',
                width: isHovered ? '' : '0px',
                padding: isHovered ? '' : '0px',
              }}
              type="text"
              name="search"
              value={inputValue}
              onBlur={() => {
                if (!inputValue) {
                  setIsHovered(false);
                }
              }}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              placeholder={smallSizeScreen ? 'Пошук' : 'Пошук по девайсам'}
            />
            {inputValue && (
              <button
                className={css.clearBtn}
                type="button"
                onClick={e => {
                  hendleClearClick(mainFilter);
                  setVisibility(false);
                }}
                style={{ opacity: visibility ? '1' : '0', borderRadius: '50%' }}
              >
                <Image width={18} height={18} src={clearIcon} />
              </button>
            )}
          </InputGroup>
        </div>
      )}
    </>
  );
};

export default MainFilter;
