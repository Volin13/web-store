import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import CreateBrand from './modals/CreateBrand';
import CreateDevice from './modals/CreateDevice';
import CreateType from './modals/CreateType';

const Admin = () => {
  const [brandVisible, setBrandVisible] = useState(false);
  const [typeVisible, setTypeVisible] = useState(false);
  const [deviceVisible, setDeviceVisible] = useState(false);
  return (
    <>
      <Button
        variant={'outline-dark'}
        className="mt-4 p-2"
        onClick={() => setTypeVisible(true)}
      >
        Додати тип
      </Button>
      <Button
        variant={'outline-dark'}
        className="mt-4 p-2"
        onClick={() => setBrandVisible(true)}
      >
        Додати бренд
      </Button>
      <Button
        variant={'outline-dark'}
        className="mt-4 p-2"
        onClick={() => setDeviceVisible(true)}
      >
        Додати пристрій
      </Button>
      <CreateBrand show={brandVisible} onHide={() => setBrandVisible(false)} />
      <CreateType show={typeVisible} onHide={() => setTypeVisible(false)} />
      <CreateDevice
        show={deviceVisible}
        onHide={() => setDeviceVisible(false)}
      />
    </>
  );
};

export default Admin;
