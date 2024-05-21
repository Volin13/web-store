import React, { useEffect } from 'react';
const tg = window.Telegram.WebApp;

const Telegram = () => {
  useEffect(() => {
    tg.ready();
  }, []);

  const onClose = () => {
    tg.close();
  };
  return <button onClick={() => onClose()}>Close</button>;
};

export default Telegram;
