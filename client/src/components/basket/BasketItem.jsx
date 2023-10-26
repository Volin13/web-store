import React from 'react';
import { Button, Card } from 'react-bootstrap';

const BasketItem = (item, index, removeFromBasket) => {
  return (
    <Card key={index}>
      <Card.Header>{item.price} грн.</Card.Header>
      <Card.Body>
        <Card.Title>{item.name}</Card.Title>
        <Card.Text>
          With supporting text below as a natural lead-in to additional content.
        </Card.Text>
        <Button
          type="button"
          variant="primary"
          onClick={() => removeFromBasket(index)}
        >
          Видалити
        </Button>
      </Card.Body>
    </Card>
  );
};

export default BasketItem;
