import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { ReactComponent as AddIcon } from '../../assets/basketIcons/arrow-next-small-svgrepo-com.svg';
import { ReactComponent as ReduceIcon } from '../../assets/basketIcons/arrow-prev-small-svgrepo-com.svg';

const BasketItem = ({ item, index, removeCard, reduceOne, addOne }) => {
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
          <Card.Title>
            {item.price * item.count} грн.{' '}
            {item.count > 1 && (
              <span>
                ( {item.price} грн. x{item.count})
              </span>
            )}
          </Card.Title>
          <Card.Text>
            <span className="d-flex align-items-center justify-content-center p-1">
              <button
                type="button"
                onClick={() => {
                  reduceOne(item.id);
                }}
              >
                <ReduceIcon />
              </button>
              <span>{item.count} шт.</span>
              <button
                type="button"
                onClick={() => {
                  addOne(item.id);
                }}
              >
                <AddIcon />
              </button>
            </span>
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
