import React from 'react';

import { Dropdown } from 'react-bootstrap';
import CustomMenu from './CustomMenu';
import CustomToggle from './CustomToggle';

const CheckoutDropdown = ({ list, children, setOfficeInput }) => {
  return (
    <Dropdown>
      <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
        {children}
      </Dropdown.Toggle>
      {list.length > 0 && (
        <Dropdown.Menu as={CustomMenu}>
          {list?.map(item => (
            <Dropdown.Item
              // onClick={setOfficeInput(item.Description)}
              eventKey={item.Number}
            >
              {item.Description.split(' ').splice(1).join()}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      )}
    </Dropdown>
  );
};

export default CheckoutDropdown;
