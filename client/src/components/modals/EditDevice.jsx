import React, { useContext, useEffect, useState } from 'react';
import * as yup from 'yup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import { Context } from '../../index';
import { Col, Image, InputGroup, Row } from 'react-bootstrap';
import { editDevice, fetchBrands, fetchTypes } from '../../http/deviceApi';
import { observer } from 'mobx-react-lite';
import { useFormik } from 'formik';

import imageIcon from '../../assets/adminIcons/imageIcon.svg';
import nameIcon from '../../assets/adminIcons/deviceNameIcon.svg';
import priceIcon from '../../assets/adminIcons/priceIcon.svg';
import ratingIcon from '../../assets/adminIcons/ratingIcon.svg';

const EditDeviceModal = observer(({ show, onHide, deviceToEdit }) => {
  const { device } = useContext(Context);
  const [info, setInfo] = useState([]);
  const [deviseImages, setDeviceImages] = useState([]);

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
      formik.setFieldValue('mainImg', selectedFile);
    } else {
      formik.setFieldValue('mainImg', '');
    }
  };
  const addDevice = () => {
    const formData = new FormData();
    formData.append('name', formik.values.name);
    formData.append('price', `${formik.values.price}`);
    formData.append('mainImg', formik.values.mainImg);
    formData.append('rating', formik.values.rating);
    formData.append('brandId', device.selectedBrand.id);
    formData.append('typeId', device.selectedType.id);
    formData.append('info', JSON.stringify(info));

    editDevice(formData).then(() => onHide());
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
      .required('Введіть назву девайсу'),
    price: yup
      .number('Ціна повинна бути числом')
      .positive('Ціна повинна бути додатнім числом')
      .integer('Ціна повинна бути цілим числом')
      .required('Введіть ціну'),
    mainImg: yup
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
    rating: yup
      .number('Рейтинг повинна бути числом')
      .min(1, 'Мінімальний рейтинг 1')
      .max(10, 'Максимальний рейтинг 10')
      .required('Введіть рейтинг'),
  });
  const formik = useFormik({
    initialValues: {
      name: deviceToEdit?.name || '',
      price: deviceToEdit?.price || 0,
      mainImg: deviceToEdit?.mainImg || null,
      rating: deviceToEdit?.rating || 0,
      brandId: deviceToEdit?.brandId || '',
      typeId: deviceToEdit?.typeId || '',
      info: deviceToEdit?.info || [],
    },
    validationSchema: deviceSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      addDevice(values);
      setSubmitting(false);
      resetForm();
    },
  });
  const isValid = deviceSchema.isValidSync(formik.values);
  console.log(deviceToEdit);
  console.log(formik.values);
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
          {/* ТИП  */}
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

          {/* БРЕНД           */}
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
          {/* НАЗВА  */}
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
              value={formik.values.name}
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
            {/* КАРТИНКА  */}
            <InputGroup.Text style={{ height: '38px' }}>
              <Image width={30} height={30} src={priceIcon} />
            </InputGroup.Text>
            <Form.Control
              style={{ height: '38px' }}
              type="number"
              name="price"
              isInvalid={formik.values.price && formik.errors.price}
              value={formik.values.price}
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
              isInvalid={formik.values.mainImg && formik.errors.mainImg}
              onChange={e => {
                selectFile(e);
              }}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.mainImg}
            </Form.Control.Feedback>
          </InputGroup>

          {/* РЕЙТИНГ  */}
          <InputGroup
            hasValidation
            className="mt-3"
            style={{ minHeight: '63px' }}
          >
            <InputGroup.Text style={{ height: '38px' }}>
              <Image width={30} height={30} src={ratingIcon} />
            </InputGroup.Text>
            <Form.Control
              style={{ height: '38px' }}
              type="text"
              name="rating"
              isInvalid={formik.values.rating && formik.errors.rating}
              value={formik.values.rating}
              onChange={e => {
                const newValue = parseFloat(e.target.value);
                formik.setFieldValue('rating', newValue);
              }}
              placeholder="Введіть рейтинг пристрою Х.Х"
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.rating}
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

export default EditDeviceModal;
