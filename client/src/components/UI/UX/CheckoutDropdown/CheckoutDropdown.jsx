import React from 'react';
import { Dropdown } from 'react-bootstrap';
import CustomMenu from './CustomMenu';
import CustomToggle from './CustomToggle';

const CheckoutDropdown = ({ setOnShow, onShow, list, children, setInput }) => {
  return (
    <Dropdown>
      <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
        {children}
      </Dropdown.Toggle>
      {list?.length > 0 && (
        <Dropdown.Menu as={CustomMenu} show={onShow}>
          {list?.map(item => (
            <Dropdown.Item
              key={item.Ref}
              onClick={() => {
                setOnShow(false);
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
