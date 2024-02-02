import React from 'react';
import { Dropdown } from 'react-bootstrap';
import CustomMenu from './CustomMenu';
import CustomToggle from './CustomToggle';
import PropTypes from 'prop-types';

const CheckoutDropdown = ({
  setOnShow,
  onShow,
  list,
  children,
  formik,
  inputName,
  setInput,
  value = '',
}) => {
  return (
    <Dropdown>
      <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
        {children}
      </Dropdown.Toggle>
      {list?.length > 0 && (
        <Dropdown.Menu className={value} as={CustomMenu} show={onShow}>
          {list?.map(item => (
            <Dropdown.Item
              key={item.Ref}
              onClick={() => {
                setOnShow(false);
                setInput(item.Description);
                formik.setFieldValue(inputName, item.Description);
              }}
              eventKey={item.Description}
            >
              {item.Description}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      )}
    </Dropdown>
  );
};

CheckoutDropdown.propTypes = {
  setOnShow: PropTypes.func,
  setInput: PropTypes.func,
  onShow: PropTypes.bool,
  list: PropTypes.array,
  children: PropTypes.object,
  formik: PropTypes.object,
  inputName: PropTypes.string,
  value: PropTypes.string,
};

export default CheckoutDropdown;
