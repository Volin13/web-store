import React, { useContext } from 'react';
import { useFormik } from 'formik';
import { Context } from '../..';
import * as yup from 'yup';
import { Image, InputGroup, Form, Button, Modal } from 'react-bootstrap';
import { createType } from '../../http/deviceApi';
import typeIcon from '../../assets/adminIcons/typeIcon.svg';

const CreateType = ({ show, onHide }) => {
  const { device } = useContext(Context);

  const addType = value => {
    createType({ name: value }).then(data => {
      onHide();
    });
  };
  let typeNames = [];
  device.types.map(brand => typeNames.push(brand.name.toLowerCase()));
  let typeSchema = yup.object().shape({
    type: yup
      .string()
      .trim()
      .min(3, 'Назва занадто коротка')
      .max(30, 'Назва занадто довга')
      .lowercase()
      .notOneOf(typeNames, 'Такий тип вже існує')
      .required('Введіть тип'),
  });
  const formik = useFormik({
    initialValues: {
      type: '',
    },
    validationSchema: typeSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setSubmitting(false);
      resetForm(true);
    },
  });
  const isValid = typeSchema.isValidSync(formik.values);
  return (
    <Modal size="lg" show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Додати новий тип
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
              <Image width={30} height={30} src={typeIcon} />
            </InputGroup.Text>
            <Form.Control
              style={{ height: '38px' }}
              type="text"
              name="type"
              value={formik.values.type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.values.type && formik.errors.type}
              placeholder="Введіть назву типу"
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.type}
            </Form.Control.Feedback>
          </InputGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>
          Вийти
        </Button>
        <Button
          disabled={!isValid}
          variant="outline-success"
          onClick={() => addType(formik.values.type)}
        >
          Додати
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateType;
