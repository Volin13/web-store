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
  setOnShow: PropTypes.func.isRequired,
  setInput: PropTypes.func.isRequired,
  onShow: PropTypes.bool.isRequired,
  list: PropTypes.array.isRequired,
  children: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
  inputName: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default CheckoutDropdown;
