import React from 'react';

import { Dropdown } from 'react-bootstrap';
import CustomMenu from './CustomMenu';
import CustomToggle from './CustomToggle';

const CheckoutDropdown = ({
  list,
  children,
  setInput,
  inputName = '',
  formik = {},
}) => {
  return (
    <Dropdown>
      <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
        {children}
      </Dropdown.Toggle>
      {list.length > 0 && (
        <Dropdown.Menu as={CustomMenu}>
          {list?.map(item => (
            <Dropdown.Item
              key={item.Ref}
              onClick={() => {
                if (inputName === 'region') {
                  formik.setFieldValue('regionRef', item.Ref);
                  return setInput(`${item.Description} обл.`);
                }
                setInput(item.Description);
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

export default CheckoutDropdown;
