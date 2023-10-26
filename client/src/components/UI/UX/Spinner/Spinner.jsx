import React from 'react';
import { Spinner } from 'react-bootstrap';

const Spiner = () => {
  return (
    <Spinner
      style={{
        height: 200,
        width: 200,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
      animation={'grow'}
    />
  );
};

export default Spiner;
