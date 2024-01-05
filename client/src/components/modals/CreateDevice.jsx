import React, { useContext, useEffect, useState } from 'react';
import * as yup from 'yup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import { Context } from '../../index';
import { Col, Image, InputGroup, Row } from 'react-bootstrap';
import { createDevice, fetchBrands, fetchTypes } from '../../http/deviceApi';
import { observer } from 'mobx-react-lite';
import { useFormik } from 'formik';

import imageIcon from '../../assets/adminIcons/imageIcon.svg';
import nameIcon from '../../assets/adminIcons/deviceNameIcon.svg';
import priceIcon from '../../assets/adminIcons/priceIcon.svg';

const CreateDevice = observer(({ show, onHide }) => {
  const { device } = useContext(Context);
  const [info, setInfo] = useState([]);

  // При першому завантаженні записую в стор типи і бренди, шоб потім вибрати з існуючих
  useEffect(() => {
    fetchTypes().then(data => device.setTypes(data));
    fetchBrands().then(data => device.setBrands(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Зберегти додані і додати нову статтю в характеристики девайсу
  const addInfo = () => {
    setInfo([...info, { title: '', description: '', number: Date.now() }]);
    formik.setFieldValue('info', JSON.stringify(info));
  };
  // Видалити додану статтю характеристик девайсу
  const removeInfo = number => {
    setInfo(info.filter(i => i.number !== number));
    formik.setFieldValue('info', JSON.stringify(info));
  };

  // Змінити додану статтю характеристик девайсу
  const changeInfo = (key, value, number) => {
    setInfo(info.map(i => (i.number === number ? { ...i, [key]: value } : i)));
  };

  const selectFile = e => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      formik.setFieldValue('img', selectedFile);
    } else {
      formik.setFieldValue('img', '');
    }
  };
  const addDevice = () => {
    const formData = new FormData();
    formData.append('name', formik.values.name);
    formData.append('price', `${formik.values.price}`);
    formData.append('img', formik.values.img);
    formData.append('brandId', device.selectedBrand.id);
    formData.append('typeId', device.selectedType.id);
    formData.append('info', JSON.stringify(info));

    createDevice(formData).then(data => onHide());
  };

  // Формую масив назв девайсів, які уже є для подальшої перевірки в схемі
  let deviceNames = [];
  device.devices.map(device => deviceNames.push(device.name.toLowerCase()));

  let deviceSchema = yup.object().shape({
    name: yup
      .string()
      .trim()
      .min(3, 'Назва девайсу занадто коротка')
      .max(80, 'Назва девайсу занадто довга')
      .lowercase()
      .notOneOf(deviceNames, 'Такий девайс вже існує')
      .required('Введіть девайс'),
    price: yup
      .number('ціна повинна бути числом')
      .positive('ціна повинна бути додатнім числом')
      .integer('ціна повинна бути цілим числом')
      .required('введіть ціну'),
    img: yup
      .mixed()
      .test('type', 'Only image files are allowed', value => {
        return (
          !value || (value && ['image/jpeg', 'image/png'].includes(value.type))
        );
      })
      .test('size', 'Розмір зображення має бути менше 5 MB', value => {
        return !value || (value && value.size <= 5000000);
      })
      .required('Додайте зображення'),
  });
  const formik = useFormik({
    initialValues: {
      name: '',
      price: 0,
      img: null,
      brandId: '',
      typeId: '',
      info: [],
    },
    validationSchema: deviceSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      addDevice(values);
      console.log('poof');
      setSubmitting(false);
      resetForm();
    },
  });
  const isValid = deviceSchema.isValidSync(formik.values);

  return (
    <Modal size="lg" show={show} onHide={onHide} centered>
      <Form
        onSubmit={e => {
          e.preventDefault();
          formik.handleSubmit(e);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Додати новий пристрій
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Dropdown className="mt-2 mb-2">
            <Dropdown.Toggle>
              {device.selectedType.name || 'Виберіть тип'}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ maxHeight: '190px', overflow: 'auto' }}>
              {device.types.map(type => (
                <Dropdown.Item
                  key={type.id}
                  onClick={() => {
                    device.setSelectedType(type);
                    formik.setFieldValue('typeId', device.selectedType.id);
                  }}
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
            <Dropdown.Menu style={{ maxHeight: '190px', overflow: 'auto' }}>
              {device.brands.map(brand => (
                <Dropdown.Item
                  key={brand.id}
                  onClick={() => {
                    device.setSelectedBrand(brand);
                    formik.setFieldValue('brandId', device.selectedBrand.id);
                  }}
                >
                  {brand.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <InputGroup
            hasValidation
            className="mt-3"
            style={{ minHeight: '63px' }}
          >
            <InputGroup.Text style={{ height: '38px' }}>
              <Image width={30} height={30} src={nameIcon} />
            </InputGroup.Text>
            <Form.Control
              style={{ height: '38px' }}
              type="text"
              name="name"
              value={formik.name}
              isInvalid={formik.values.name && formik.errors.name}
              onChange={formik.handleChange}
              placeholder="Введіть назву пристрою"
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
            </Form.Control.Feedback>
          </InputGroup>
          <InputGroup
            hasValidation
            className="mt-3"
            style={{ minHeight: '63px' }}
          >
            <InputGroup.Text style={{ height: '38px' }}>
              <Image width={30} height={30} src={priceIcon} />
            </InputGroup.Text>
            <Form.Control
              style={{ height: '38px' }}
              type="number"
              name="price"
              isInvalid={formik.values.price && formik.errors.price}
              value={formik.price}
              onChange={e => {
                const newValue = Number(e.target.value);
                formik.setFieldValue('price', newValue);
              }}
              placeholder="Введіть вартість пристрою"
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.price}
            </Form.Control.Feedback>
          </InputGroup>
          <InputGroup
            hasValidation
            className="mt-3"
            style={{ minHeight: '63px' }}
          >
            <InputGroup.Text style={{ height: '38px' }}>
              <Image width={30} height={30} src={imageIcon} />
            </InputGroup.Text>
            <Form.Control
              style={{ height: '38px' }}
              type="file"
              isInvalid={formik.values.img && formik.errors.img}
              onChange={e => {
                selectFile(e);
              }}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.img}
            </Form.Control.Feedback>
          </InputGroup>

          <hr className="mb-2" />
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
                  placeholder="Введіть назву "
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
                  placeholder="Введіть опис "
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={onHide}>
            Вийти
          </Button>
          <Button disabled={!isValid} type="submit" variant="outline-success">
            Додати
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
});

export default CreateDevice;
