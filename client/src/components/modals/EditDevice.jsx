import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../index';
import {
  Col,
  Image,
  InputGroup,
  Row,
  Form,
  Button,
  Modal,
  Dropdown,
  Card,
} from 'react-bootstrap';
import { editDevice } from '../../http/deviceApi';
import { observer } from 'mobx-react-lite';
import { runInAction } from 'mobx';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { editDeviceSchema } from '../../utils/editDeviceSchema';
import imageIcon from '../../assets/adminIcons/imageIcon.svg';
import deviceNameIcon from '../../assets/adminIcons/deviceNameIcon.svg';
import priceIcon from '../../assets/adminIcons/priceIcon.svg';
import ratingIcon from '../../assets/adminIcons/ratingIcon.svg';
import PropTypes from 'prop-types';

const EditDeviceModal = observer(({ show, onHide, deviceToEdit }) => {
  const { device } = useContext(Context);
  const [info, setInfo] = useState([]);
  const [deviceImages, setDeviceImages] = useState([]);
  const [imageSectionVisible, setImageSectionVisible] = useState(false);
  const [infoSectionVisible, setInfoSectionVisible] = useState(false);
  // За наявності даних девайсу заповнюю поля введення його інформацією
  useEffect(() => {
    if (deviceToEdit) {
      formik.setFieldValue('name', deviceToEdit.name);
      formik.setFieldValue('price', deviceToEdit.price);
      formik.setFieldValue('rating', deviceToEdit.rating);
      formik.setFieldValue('brandId', deviceToEdit.brandId);
      formik.setFieldValue('typeId', deviceToEdit.typeId);
      formik.setFieldValue('info', deviceToEdit.info);
      setInfo(deviceToEdit.info);
      setDeviceImages(deviceToEdit.deviceImages || []);
      formik.setFieldValue('deviceImages', deviceToEdit.deviceImages || []);
      // Формую масив назв девайсів, які уже є для подальшої перевірки в схемі
    }
  }, [deviceToEdit]);
  console.log(deviceToEdit);
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

  // Змінити/додати/видалити додані зображення девайсу
  const addImage = () => {
    setDeviceImages([
      ...deviceImages,
      { deviceImage: null, number: Date.now() },
    ]);
    formik.setFieldValue('deviceImages', deviceImages);
  };
  const changeImages = (key, value, number) => {
    setDeviceImages(
      deviceImages.map(i => (i.number === number ? { ...i, [key]: value } : i))
    );
    formik.setFieldValue('deviceImages', deviceImages);
  };
  const removeImage = number => {
    setDeviceImages(deviceImages.filter(i => i.number !== number));
    formik.setFieldValue('deviceImages', deviceImages);
  };

  // Зміна головного зображення
  const selectFile = e => {
    const selectedFile = e.target.files[0];
    formik.setFieldValue('mainImg', selectedFile || null);
  };

  // Задаємо тип і бренд по айді
  const ChoseDevPropByID = (arr, name) => {
    runInAction(() => {
      console.log('poof');
      arr.forEach(item => {
        if (item.id === deviceToEdit?.typeId && name === 'type') {
          device.setSelectedType(item);
        } else {
          device.setSelectedBrand(item);
        }
      });
    });
  };

  // Функція для збору і відправки даних на бекенд

  const editData = values => {
    const formData = new FormData();
    const fileNames = [];
    const oldfileNames = [];

    formData.append('name', values.name);
    formData.append('price', values.price);
    formData.append('oldMainImg', deviceToEdit?.mainImg);
    formData.append('rating', values.rating);
    formData.append('brandId', device.selectedBrand.id);
    formData.append('typeId', device.selectedType.id);
    formData.append('info', JSON.stringify(info));
    deviceImages.forEach((item, index) => {
      if (item.deviceImage instanceof File) {
        formData.append(`images[${index}][deviceImage]`, item.deviceImage);
        formData.append(`images[${index}][number]`, item.number);
      } else if (item.fileName) {
        fileNames.push(item.fileName);
      }
    });
    deviceToEdit.deviceImages.forEach(image => {
      oldfileNames.push(image.fileName);
    });
    formData.append('oldDeviceImages', JSON.stringify(oldfileNames));
    formData.append('deviceImagesNames', JSON.stringify(fileNames));
    editDevice(deviceToEdit?.id, formData).then(() => onHide());
  };

  const formik = useFormik({
    initialValues: {
      name: deviceToEdit?.name || '',
      price: deviceToEdit?.price || 0,
      discount: deviceToEdit?.discount || false,
      inStock: deviceToEdit?.inStock || true,
      newPrice: deviceToEdit?.newPrice || 0,
      mainImg: deviceToEdit?.mainImg || null,
      deviceImages: deviceToEdit?.info || [],
      rating: deviceToEdit?.rating || 0,
      brandId: deviceToEdit?.brandId || '',
      typeId: deviceToEdit?.typeId || '',
      info: deviceToEdit?.info || [],
    },
    validationSchema: editDeviceSchema,
    onSubmit: (values, { setSubmitting }) => {
      try {
        editData(values);
        setSubmitting(false);
        toast.success('Девайс було змінено');
      } catch (error) {
        toast.error('Сталась помилка спробуйте пізніше');
      }
    },
  });
  const isValid = editDeviceSchema.isValidSync(formik.values);
  return (
    <Modal size="lg" show={show} onHide={onHide} centered>
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Редагувати пристрій
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* ТИП  */}
          <Dropdown className="mt-2 mb-2">
            <Dropdown.Toggle>
              {device.selectedType.name ||
                ChoseDevPropByID(device.types, 'type')}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ maxHeight: '190px', overflow: 'auto' }}>
              {device.types.map((type, index) => (
                <Dropdown.Item
                  key={index}
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
              {device.selectedBrand.name ||
                ChoseDevPropByID(device.brands, 'brand')}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ maxHeight: '190px', overflow: 'auto' }}>
              {device.brands.map((brand, index) => (
                <Dropdown.Item
                  key={index}
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
              <Image width={30} height={30} src={deviceNameIcon} />
            </InputGroup.Text>
            <Form.Control
              style={{ height: '38px' }}
              type="text"
              name="name"
              value={formik.values.name}
              isInvalid={formik.touched.name && formik.errors.name}
              onChange={formik.handleChange}
              placeholder="Введіть назву пристрою"
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
            </Form.Control.Feedback>
          </InputGroup>
          {/* ЦІНА  */}
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
              isInvalid={formik.touched.price && formik.errors.price}
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
          <Card className="d-flex flex-row justify-content-around align-items-center">
            <Form.Check
              type="switch"
              checked={formik.values.discount}
              onChange={() => {
                formik.setFieldValue('discount', !formik.values.discount);
              }}
              label="Знижка"
            />
            <Form.Check
              checked={formik.values.inStock}
              type="switch"
              onChange={() => {
                formik.setFieldValue('inStock', !formik.values.inStock);
              }}
              label="Є у наявності"
            />
          </Card>
          {/* НОВА ЦІНА  */}
          {formik.values.discount && (
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
                name="newPrice"
                isInvalid={formik.touched.newPrice && formik.errors.newPrice}
                value={formik.values.newPrice}
                onChange={e => {
                  const newValue = Number(e.target.value);
                  formik.setFieldValue('newPrice', newValue);
                }}
                placeholder="Введіть нову вартість пристрою"
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.newPrice}
              </Form.Control.Feedback>
            </InputGroup>
          )}

          {/* КАРТИНКА */}
          <Form.Label className="my-2">Нове головне зображення</Form.Label>
          <InputGroup hasValidation style={{ minHeight: '63px' }}>
            <InputGroup.Text style={{ height: '38px' }}>
              <Image width={30} height={30} src={imageIcon} />
            </InputGroup.Text>
            <Form.Control
              style={{ height: '38px' }}
              type="file"
              isInvalid={formik.touched.mainImg && formik.errors.mainImg}
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
              isInvalid={formik.touched.rating && formik.errors.rating}
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
          <Button
            className="mt-3"
            style={{ marginRight: '12px' }}
            variant="outline-dark"
            onClick={() => setImageSectionVisible(!imageSectionVisible)}
          >
            {imageSectionVisible ? 'Закрити' : 'Змінити другорядні зображення'}
          </Button>
          {/* Картинки (декілька)  */}
          {imageSectionVisible && (
            <>
              <hr className="my-2" />
              <Button variant="outline-dark" onClick={addImage}>
                Додати зображення
              </Button>
              <ul>
                {deviceImages.map(i => (
                  <Row key={i?.number} as="li" className="my-3">
                    <Col
                      md={6}
                      className="d-flex align-items-center justify-content-center mb-2"
                    >
                      <Image
                        width={50}
                        src={
                          i.fileName
                            ? process.env.REACT_APP_API_URL + i.fileName
                            : imageIcon
                        }
                        fluid
                        style={{ marginRight: '10px' }}
                      />
                      <Form.Control
                        type="file"
                        onChange={e =>
                          changeImages(
                            'deviceImage',
                            e.target.files[0],
                            i.number
                          )
                        }
                      />
                    </Col>
                    <Col md={4} className="d-flex align-items-center">
                      <Button
                        variant="outline-danger"
                        onClick={() => removeImage(i.number)}
                      >
                        Видалити
                      </Button>
                    </Col>
                  </Row>
                ))}
              </ul>
            </>
          )}
          <Button
            className="mt-3"
            variant="outline-dark"
            onClick={() => setInfoSectionVisible(!infoSectionVisible)}
          >
            {infoSectionVisible ? 'Закрити' : 'Змінити характеристики'}
          </Button>
          {/* ХАРАКТЕРИСТИКИ  */}
          {infoSectionVisible && (
            <>
              <hr className="my-2" />
              <Button variant="outline-dark" onClick={addInfo}>
                Додати нову властивість
              </Button>
              <ul>
                {info.map(i => (
                  <Row key={i.id} as="li">
                    <Col md={4}>
                      <Form.Control
                        className="mt-3"
                        type="text"
                        value={i.title}
                        onChange={e =>
                          changeInfo('title', e.target.value, i.number)
                        }
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
              </ul>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={onHide}>
            Вийти
          </Button>
          <Button disabled={!isValid} type="submit" variant="outline-success">
            Змінити
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
});

EditDeviceModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  deviceToEdit: PropTypes.object,
};

export default EditDeviceModal;
