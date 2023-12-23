import React, { useContext, useState } from 'react';
import { Image, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { Context } from '../../../..';
import searchIcon from '../../../../assets/defultIcons/search-svgrepo-com.svg';
import css from './MainFilter.module.css';

const MainFilter = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { device } = useContext(Context);

  const handleChange = event => {
    setInputValue(event.target.value);
  };

  const handleClick = () => {
    device.setQuery(inputValue);
    device.setSelectedType({});
    device.setSelectedBrand({});
  };

  const handleKeyPress = event => {
    if (event.key === 'Enter') {
      handleClick();
    }
  };

  return (
    <div className="d-flex justify-content-end">
      <InputGroup
        hasValidation
        className={css.searchInput}
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
          placeholder="Пошук по девайсам"
        />
      </InputGroup>
    </div>
  );
};

export default MainFilter;
