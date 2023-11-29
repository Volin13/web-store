import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { checkoutSchema } from '../../utils/checkoutSchema';
import NPterminalFilter from '../UI/UX/NPAddressFilters/NPterminalFilter';
import NPregionsFilter from '../UI/UX/NPAddressFilters/NPregionsFilter';
import NPcityFilter from '../UI/UX/NPAddressFilters/NPcitiesFilter';
import { createOrder } from '../../http/ordersApi';

const Checkout = ({ list, total, user }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const terminalInput = useRef(null);
  const regionInput = useRef(null);
  const cityInput = useRef(null);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      region: '',
      city: '',
      phone: '',
      terminal: '',
      comment: '',
      total: '',
    },

    validationSchema: checkoutSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      console.log(list);
      createOrder(user, values, list);
      setSubmitting(false);
      resetForm(false);
    },
  });

  useEffect(() => {
    formik.setFieldValue('total', `${total} грн`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  const isValid = checkoutSchema.isValidSync(formik.values);

  return (
    <>
      <Form noValidate onSubmit={formik.handleSubmit}>
        <Card className="mb-3">
          <Card.Body>
            <h2 className="mb-3">Покупець</h2>
            <Row className="mb-3">
              {/* ІМ'Я */}

              <Form.Group as={Col} md="6" style={{ minHeight: '108px' }}>
                <Form.Label>Ім&#39;я</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    formik.touched.firstName && !!formik.errors.firstName
                  }
                />

                {formik.touched.firstName && formik.errors.firstName && (
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.firstName}
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              {/* Прізвище */}

              <Form.Group as={Col} md="6" style={{ minHeight: '108px' }}>
                <Form.Label>Прізвище</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    formik.touched.lastName && !!formik.errors.lastName
                  }
                />

                {formik.touched.lastName && formik.errors.lastName && (
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.lastName}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Row>
            <Row>
              {/* Email */}

              <Form.Group as={Col} md="6" style={{ minHeight: '108px' }}>
                <Form.Label>Email</Form.Label>
                <InputGroup hasValidation>
                  <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                  <Form.Control
                    type="email"
                    placeholder="XXX@XXX.XX"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.email && !!formik.errors.email}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.email}
                    </Form.Control.Feedback>
                  )}
                </InputGroup>
              </Form.Group>

              {/* Моб ТЕЛЕФОН */}

              <Form.Group as={Col} md="6" style={{ minHeight: '108px' }}>
                <Form.Label>Моб. телефон (+380)</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="+38(0ХХ)ХХХХХХХ"
                  maxLength="13"
                  name="phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.phone && !!formik.errors.phone}
                />
                {formik.touched.phone && formik.errors.phone && (
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.phone}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Row>
          </Card.Body>
        </Card>

        <Card className="mb-3" bg="secondary" text="white">
          <Card.Body style={{ position: 'relative' }}>
            <h2 className="mb-3">
              Адреса доставки{' '}
              <span
                onMouseEnter={e => {
                  setIsHovered(true);
                  setCursorPosition({ x: e.clientX, y: e.clientY });
                }}
                onMouseLeave={() => {
                  setIsHovered(false);
                }}
                className="text-danger"
              >
                *
              </span>
            </h2>
            {isHovered && (
              <span
                style={{
                  position: 'fixed',
                  left: cursorPosition.x,
                  top: cursorPosition.y,
                }}
              >
                виберіть варіант з випадаючого списку
              </span>
            )}

            {/* Область */}

            <Row className="mb-3">
              <Form.Group as={Col} md="6" style={{ minHeight: '108px' }}>
                <Form.Label>Область</Form.Label>
                <NPregionsFilter ref={regionInput} formik={formik} />
              </Form.Group>

              {/* МІСТО */}

              <Form.Group as={Col} md="6" style={{ minHeight: '108px' }}>
                <Form.Label>Місто</Form.Label>

                <NPcityFilter ref={cityInput} formik={formik} />
              </Form.Group>
            </Row>

            {/* Відділення */}

            <Row className="mb-3">
              <Form.Group as={Col} md="6" style={{ minHeight: '108px' }}>
                <Form.Label>№ Відділення (Нова пошта)</Form.Label>
                <NPterminalFilter ref={terminalInput} formik={formik} />
              </Form.Group>
            </Row>
          </Card.Body>
        </Card>
        <Card className="mb-3">
          <Card.Body>
            <Row>
              <Form.Group>
                <Form.Label>Коментар </Form.Label>
                <Form.Control
                  placeholder="Додайте деталі замовлення/доставки (за бажанням)"
                  name="comment"
                  onChange={formik.handleChange}
                  as="textarea"
                  rows={3}
                />
              </Form.Group>
            </Row>
          </Card.Body>
        </Card>
        <div className="text-end">
          <Button variant="info" disabled={!isValid} type="submit">
            {!isValid ? 'Заповніть ваші дані' : 'Оформити замовлення'}
          </Button>
        </div>
      </Form>
    </>
  );
};

export default Checkout;
