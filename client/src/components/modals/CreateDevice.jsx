import React, { useContext, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import { Context } from '../../index';
import { Col, Row } from 'react-bootstrap';
const CreateDevice = ({ show, onHide }) => {
  const { device } = useContext(Context);
  const [info, setInfo] = useState([]);
  const addInfo = () => {
    setInfo([...info, { title: '', description: '', number: Date.now() }]);
  };
  const removeInfo = number => {
    setInfo(info.filter(i => i.number != number));
  };
  return (
    <Modal size="lg" show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Додати новий пристрій
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Dropdown className="mt-2 mb-2">
            <Dropdown.Toggle>Виберіть тип</Dropdown.Toggle>
            <Dropdown.Menu>
              {device.types.map(type => (
                <Dropdown.Item key={type.id}>{type.name}</Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown className="mt-2 mb-2">
            <Dropdown.Toggle>Виберіть бренд</Dropdown.Toggle>
            <Dropdown.Menu>
              {device.brands.map(brand => (
                <Dropdown.Item key={brand.id}>{brand.name}</Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Form.Control
            className="mt-3"
            type="text"
            placeholder="Введіть назву пристрою"
          />
          <Form.Control
            className="mt-3"
            type="number"
            placeholder="Введіть вартість пристрою"
          />
          <Form.Control
            className="mt-3"
            type="file"
            placeholder="Завантажте зображення пристрою"
          />
          <hr />
          <Button variant="outline-dark" onClick={addInfo}>
            Додати нову властивість
          </Button>
          {info.map(i => (
            <Row key={i.number}>
              <Col md={4}>
                <Form.Control
                  className="mt-3"
                  type="text"
                  placeholder="Введіть введіть назву "
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  className="mt-3"
                  type="text"
                  placeholder="Введіть введіть опис "
                />
              </Col>
              <Col md={4}>
                <Button
                  className="mt-3"
                  variant="outline-danger"
                  onClick={() => removeInfo(i.number)}
                >
                  Видалити
                </Button>
              </Col>
            </Row>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>
          Вийти
        </Button>
        <Button variant="outline-success" onClick={onHide}>
          Додати
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateDevice;
