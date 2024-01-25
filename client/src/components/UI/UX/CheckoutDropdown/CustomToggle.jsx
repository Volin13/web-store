import React from 'react';
import PropTypes from 'prop-types';

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <div
    ref={ref}
    onClick={e => {
      onClick(e);
    }}
  >
    {children}
  </div>
));

CustomToggle.displayName = 'CustomToggle';

CustomToggle.propTypes = {
  children: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default CustomToggle;
