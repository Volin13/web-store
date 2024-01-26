import React from 'react';
import { Spinner } from 'react-bootstrap';

const MessagesLoading = () => {
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ gap: '20px' }}
    >
      <Spinner animation="grow" variant="info" />
      <Spinner animation="grow" variant="info" />
      <Spinner animation="grow" variant="info" />
    </div>
  );
};

export default MessagesLoading;
