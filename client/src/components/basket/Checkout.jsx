import React, { useState } from 'react';

const Checkout = ({ list, total }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = () => {
    const order = { name, address, list, total };
    submitOrder(order);

    const submitOrder = order => {
      console.log('Замовлення відправлено:', order);
    };
  };
  return <div>Checkout</div>;
};

export default Checkout;
