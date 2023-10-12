import React, { useContext } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { createBrand } from '../../http/deviceApi';
import { useFormik } from 'formik';
import { Image, InputGroup } from 'react-bootstrap';
import brandIcon from '../../assets/adminIcons/brandIcon.svg';
import * as yup from 'yup';
import { Context } from '../..';

const CreateBrand = ({ show, onHide }) => {
  const { device } = useContext(Context);
  let brandNames = [];
  device.brands.map(brand => brandNames.push(brand.name.toLowerCase()));
  const addBrand = value => {
    createBrand({ name: value }).then(data => {
      onHide();
    });
  };
  let brandSchema = yup.object().shape({
    brand: yup
      .string()
      .trim()
      .min(3, 'Назва занадто коротка')
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
      setSubmitting(false);
      resetForm(true);
    },
  });
  const isValid = brandSchema.isValidSync(formik.values);
  return (
    <Modal size="lg" show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Додати новий бренд
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
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
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>
          Вийти
        </Button>
        <Button
          variant="outline-success"
          disabled={!isValid}
          onClick={() => addBrand(formik.values.brand)}
        >
          Додати
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateBrand;
