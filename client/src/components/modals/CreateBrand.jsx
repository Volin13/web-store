import React, { useContext } from 'react';
import { Context } from '../..';
import { useFormik } from 'formik';
import { Image, InputGroup, Form, Button, Modal } from 'react-bootstrap';
import * as yup from 'yup';
import { createBrand } from '../../http/deviceApi';
import brandIcon from '../../assets/adminIcons/brandIcon.svg';
import PropTypes from 'prop-types';

const CreateBrand = ({ show, onHide }) => {
  const { device } = useContext(Context);
  let brandNames = [];
  device.brands.map(brand => brandNames.push(brand.name.toLowerCase()));
  const addBrand = value => {
    createBrand({ name: value }).then(() => {
      onHide();
    });
  };
  let brandSchema = yup.object().shape({
    brand: yup
      .string()
      .trim()
      .min(2, 'Назва занадто коротка')
      .max(60, 'Назва занадто довга')
      .lowercase()
      .notOneOf(brandNames, 'Такий бренд вже існує')
      .required('Введіть бренд'),
  });
  const formik = useFormik({
    initialValues: {
      brand: '',
    },
    validationSchema: brandSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      addBrand(values.brand);
      setSubmitting(true);
      resetForm(true);
    },
  });
  const isValid = brandSchema.isValidSync(formik.values);
  return (
    <Modal size="lg" show={show} onHide={onHide} centered>
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Додати новий бренд
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup
            hasValidation
            className="mt-3"
            style={{ minHeight: '63px' }}
          >
            <InputGroup.Text style={{ height: '38px' }}>
              <Image width={50} height={50} src={brandIcon} />
            </InputGroup.Text>
            <Form.Control
              style={{ height: '38px' }}
              type="text"
              name="brand"
              value={formik.values.brand}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.values.brand && formik.errors.brand}
              placeholder="Введіть назву бренду"
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.brand}
            </Form.Control.Feedback>
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={onHide}>
            Вийти
          </Button>
          <Button variant="outline-success" type="submit" disabled={!isValid}>
            Додати
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

CreateBrand.propTypes = {
  onHide: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
};

export default CreateBrand;
