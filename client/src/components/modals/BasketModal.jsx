import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Button, Card, Image, Modal } from 'react-bootstrap';
import { BASKET_ROUTE } from '../../utils/constants';
import trashIcon from '../../assets/defultIcons/trash-bin-trash-svgrepo-com.svg';
import BasketList from '../basket/BasketList';

const BasketModal = observer(({ localBasket, basket, show, onHide }) => {
  const [list, setList] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();

  // Обробка змін кількості девайсів у кошику разом з змінами підрахованої кількості і ціни

  useEffect(() => {
    const uniqueItems = [];
    localBasket.forEach(item => {
      const existingItem = uniqueItems.find(uItem => uItem.id === item.id);
      if (existingItem) {
        existingItem.count += 1;
      } else {
        uniqueItems.push({ ...item, count: 1 });
      }
    });

    setList([...uniqueItems]);
    recalculateTotal(uniqueItems);
    recalculateAmount(uniqueItems);
  }, [localBasket, localBasket?.length, basket.basket.length]);

  // Очищення кошику і оновлення заг. ціни і кількості

  const clearList = () => {
    setList([]);
    recalculateTotal([]);
    recalculateAmount([]);
    basket.setBasket([]);
    sessionStorage.removeItem('basket');
  };

  // Видалення 1 виду девайсу з кошику і оновлення заг. ціни і кількості

  const removeFromList = index => {
    const newCart = [...list];
    newCart.splice(index, 1);
    basket.setBasket(newCart);
    if (newCart) {
      sessionStorage.setItem('basket', JSON.stringify(newCart));
    } else {
      sessionStorage.removeItem('basket');
    }
    setList(newCart);
    recalculateAmount(newCart);
    recalculateTotal(newCart);
  };

  // Збільшення кількості 1 типу девайсу на 1 одиницю

  const addItemCount = id => {
    const listItem = list.find(item => item.id === id);
    listItem.count += 1;
    recalculateTotal(list);
    recalculateAmount(list);
    sessionStorage.setItem('basket', JSON.stringify(list));
  };

  // Зменшення кількості 1 типу девайсу на 1 одиницю

  const reduceItemCount = id => {
    const listItem = list.find(item => item.id === id);
    if (listItem.count > 1) {
      listItem.count -= 1;
    } else {
      const removeIndex = list.indexOf(listItem);
      list.splice(removeIndex, 1);
      setList(list);
      basket.setBasket([]);
      sessionStorage.removeItem('basket');
    }
    recalculateTotal(list);
    recalculateAmount(list);
    sessionStorage.setItem('basket', JSON.stringify(list));
  };

  // Оновлення заг. ціни

  const recalculateTotal = cartItems => {
    const newTotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );
    setTotalPrice(newTotal);
  };

  // Оновлення заг. кількості

  const recalculateAmount = cartItems => {
    const newTotal = cartItems.reduce((acc, item) => acc + item.count, 0);
    setTotalAmount(newTotal);
  };

  return (
    <Modal size="lg" show={show} onHide={onHide} centered className="text-end">
      <Modal.Header closeButton>
        <Modal.Title
          className="d-flex align-items-center justify-content-between"
          id="contained-modal-title-vcenter"
          style={{ width: '100%' }}
        >
          <span>Кошик:</span>

          {list.length !== 0 ? (
            <button
              onClick={() => clearList()}
              type="button"
              className="d-flex"
              style={{ marginRight: '45px' }}
            >
              <span>Очистити </span>
              <Image width={35} height={35} src={trashIcon} />
            </button>
          ) : (
            <div></div>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-0 pb-0" style={{ textAlign: 'center' }}>
        <BasketList
          closeModal={onHide}
          addOne={addItemCount}
          reduceOne={reduceItemCount}
          list={list}
          removeCard={removeFromList}
        />
        {totalAmount !== 0 && (
          <div className="text-end">
            <Card
              className="mb-2 text-center"
              bg="secondary"
              text="white"
              style={{ width: '50%', margin: '0 0 0 auto' }}
            >
              <Card.Body className="d-flex align-items-center justify-content-around">
                <span>Кількість: {totalAmount} шт. </span>
                <span>Сума: {totalPrice} грн.</span>
              </Card.Body>
            </Card>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer style={{ textAlign: 'center' }}>
        <Button
          disabled={totalAmount === 0}
          variant={'info'}
          onClick={() => {
            navigate(BASKET_ROUTE);
            onHide();
          }}
        >
          Оформити замовлення
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default BasketModal;
