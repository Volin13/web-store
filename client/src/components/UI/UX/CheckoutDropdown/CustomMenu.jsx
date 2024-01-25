import React from 'react';
import { Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

const CustomMenu = React.forwardRef(({ children, className }, ref) => {
  const prefix =
    className.substring(0, className.indexOf(' ')) !== 'dropdown-menu'
      ? className.substring(0, className.indexOf(' ')).toLowerCase()
      : '';
  return (
    <Col
      style={{ maxHeight: 150, overflow: 'auto', width: '100%' }}
      ref={ref}
      className={className}
      // aria-labelledby={labeledBy}
    >
      <ul>
        {React.Children.toArray(children).filter(
          child =>
            prefix === '' ||
            child.props.children.toLowerCase().startsWith(prefix)
        )}
      </ul>
    </Col>
  );
});

CustomMenu.displayName = 'CustomMenu';

CustomMenu.propTypes = {
  children: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired,
};

export default CustomMenu;
