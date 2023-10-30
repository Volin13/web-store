import React from 'react';
import { Button, Card } from 'react-bootstrap';

const BasketItem = ({ item, index, removeCard }) => {
  return (
    <Card className="mb-1" style={{ width: '80%' }}>
      <Card.Header>{item.title}</Card.Header>
      <div className="d-flex align-items-center justify-content-around p-3">
        <Card.Img
          style={{ width: 'auto' }}
          height="130px"
          variant="top"
          src={process.env.REACT_APP_API_URL + item.img}
        />
        <Card.Body style={{ width: '50%', flex: ' 0 1 auto' }}>
          <Card.Title>{item.price * item.count} грн.</Card.Title>
          <Card.Text>
            {item.price} грн. (x{item.count})
          </Card.Text>

          <Button
            type="button"
            variant="info"
            onClick={() => removeCard(index)}
          >
            Видалити
          </Button>
        </Card.Body>
      </div>
    </Card>
  );
};

export default BasketItem;
