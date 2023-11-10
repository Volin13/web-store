import React, { useState } from 'react';
import { Col } from 'react-bootstrap';

const CustomMenu = React.forwardRef(
  ({ children, className, 'aria-labelledby': labeledBy }, ref) => {
    const [value, setValue] = useState('');

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
              !value || child.props.children.toLowerCase().startsWith(value)
          )}
        </ul>
      </Col>
    );
  }
);

export default CustomMenu;
