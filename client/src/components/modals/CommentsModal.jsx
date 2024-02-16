import React, { useContext } from 'react';
import { useFormik } from 'formik';
import { Context } from '../..';
import * as yup from 'yup';
import { Image, Form, Modal } from 'react-bootstrap';
import { fetchAllComments } from '../../http/deviceApi';
import editIcon from '../../assets/adminIcons/typeIcon.svg';
import deleteIcon from '../../assets/adminIcons/typeIcon.svg';
import PropTypes from 'prop-types';

const CommentsModal = ({ show, onHide }) => {
  const { device } = useContext(Context);
  useEffect(() => {
    fetchAllComments('', 1, 10);
  }, []);

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
      <Modal.Body></Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

CommentsModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
};

export default CommentsModal;
