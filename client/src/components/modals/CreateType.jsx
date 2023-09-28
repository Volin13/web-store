import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { createType } from '../../http/deviceApi';
const CreateType = ({ show, onHide }) => {
  const [value, setValue] = useState('');
  const addType = () => {
    createType().then()(data => {
      setValue('');
      onHide();
    });
  };
  return (
    <Modal size="lg" show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Додати новий тип
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control
            type="text"
            placeholder="Введіть назву типу"
            value={value}
            onChange={e => setValue(e.target.value)}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>
          Вийти
        </Button>
        <Button variant="outline-success" onClick={addType}>
          Додати
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateType;
