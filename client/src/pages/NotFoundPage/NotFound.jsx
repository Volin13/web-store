import React from 'react';
import { Card, Container } from 'react-bootstrap';

const NotFound = () => {
  return (
    <Container
      className="d-flex justify-content-center
align-items-center"
      style={{ height: window.innerHeight - 54 }}
    >
      <Card style={{ width: 600 }} className="p-5">
        <h2 className="m-auto">Page is not found</h2>
      </Card>
    </Container>
  );
};

export default NotFound;
