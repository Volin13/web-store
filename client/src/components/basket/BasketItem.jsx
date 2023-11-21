import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as AddIcon } from '../../assets/basketIcons/arrow-next-small-svgrepo-com.svg';
import { ReactComponent as ReduceIcon } from '../../assets/basketIcons/arrow-prev-small-svgrepo-com.svg';
import { DEVICE_ROUTE } from '../../utils/constants';

const BasketItem = ({
  item,
  index,
  removeCard,
  reduceOne,
  addOne,
  closeModal,
}) => {
  const navigate = useNavigate();
  return (
    <Card className="mb-2" style={{ width: '80%' }}>
      <Card.Header>
        <button
          type="button"
          onClick={() => {
            navigate(DEVICE_ROUTE + '/' + item.id);
            closeModal();
          }}
          style={{ width: '100%' }}
        >
          {item.title}
        </button>
      </Card.Header>
      <div className="d-flex align-items-center justify-content-around p-3">
        <button
          type="button"
          onClick={() => {
            navigate(DEVICE_ROUTE + '/' + item.id);
            closeModal();
          }}
        >
          <Card.Img
            style={{ width: 'auto' }}
            height="130px"
            variant="top"
            src={process.env.REACT_APP_API_URL + item.img}
          />
        </button>
        <Card.Body style={{ flex: ' 0 1 auto' }}>
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
