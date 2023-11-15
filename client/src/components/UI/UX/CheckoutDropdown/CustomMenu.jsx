import React from 'react';
import { Col } from 'react-bootstrap';

const CustomMenu = React.forwardRef(
  ({ children, className, 'aria-labelledby': labeledBy }, ref) => {
    const prefix =
      className.substring(0, className.indexOf(' ')) !== 'dropdown-menu'
        ? className.substring(0, className.indexOf(' ')).toLowerCase()
        : '';
    return (
      <Col
        style={{ maxHeight: 150, overflow: 'auto', width: '100%' }}
        ref={ref}
        className={className}
        aria-labelledby={labeledBy}
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
  }
);

export default CustomMenu;
