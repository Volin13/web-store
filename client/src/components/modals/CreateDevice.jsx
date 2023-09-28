import React, { useContext, useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import { Context } from '../../index';
import { Col, Row } from 'react-bootstrap';
import { createDevice, fetchBrands, fetchTypes } from '../../http/deviceApi';
import { observer } from 'mobx-react-lite';

const CreateDevice = observer(({ show, onHide }) => {
  const { device } = useContext(Context);
  const [info, setInfo] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchTypes().then(data => device.setTypes(data));
    fetchBrands().then(data => device.setBrands(data));
  }, [device]);

  const addInfo = () => {
    setInfo([...info, { title: '', description: '', number: Date.now() }]);
  };
  const removeInfo = number => {
    setInfo(info.filter(i => i.number !== number));
  };

  const changeInfo = (key, value, number) => {
    setInfo(info.map(i => (i.number ? { ...i, [key]: value } : i)));
  };

  const addDevice = () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', `${price}`);
    formData.append('img', file);
    formData.append('brandId', device.selectedBrand.id);
    formData.append('typeId', device.selectedType.id);
    formData.append('info', JSON.stringify(info));

    createDevice(formData).then(data => onHide());
  };

  const selectFile = e => {
    setFile(e.target.files[0]);
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
            <Dropdown.Toggle>
              {device.selectedType.name || 'Виберіть тип'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {device.types.map(type => (
                <Dropdown.Item
                  key={type.id}
                  onClick={() => device.setSelectedType(type)}
                >
                  {type.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown className="mt-2 mb-2">
            <Dropdown.Toggle>
              {device.selectedBrand.name || 'Виберіть бренд'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {device.brands.map(brand => (
                <Dropdown.Item
                  key={brand.id}
                  onClick={() => device.setSelectedBrand(brand)}
                >
                  {brand.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Form.Control
            className="mt-3"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Введіть назву пристрою"
          />
          <Form.Control
            className="mt-3"
            type="number"
            value={price}
            onChange={e => setPrice(Number(e.target.value))}
            placeholder="Введіть вартість пристрою"
          />
          <Form.Control
            className="mt-3"
            type="file"
            placeholder="Завантажте зображення пристрою"
            onChange={selectFile}
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
                  value={i.title}
                  onChange={e => changeInfo('title', e.target.value, i.number)}
                  placeholder="Введіть введіть назву "
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  className="mt-3"
                  type="text"
                  value={i.description}
                  onChange={e =>
                    changeInfo('description', e.target.value, i.number)
                  }
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
        <Button variant="outline-success" onClick={addDevice}>
          Додати
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default CreateDevice;
