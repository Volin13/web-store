import React, { useRef } from 'react';
import { useFormik } from 'formik';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { checkoutSchema } from '../../utils/checkoutSchema';
import NPterminalFilter from '../UI/UX/NPAddressFilters/NPterminalFilter';
import NPregionsFilter from '../UI/UX/NPAddressFilters/NPregionsFilter';
import NPcityFilter from '../UI/UX/NPAddressFilters/NPcitiesFilter';

const Checkout = ({ list, total }) => {
  const terminalInput = useRef(null);
  const regionInput = useRef(null);
  const cityInput = useRef(null);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      region: '',
      regionRef: '',
      city: '',
      phone: '',
      terminal: '',
      comment: '',
    },
    validationSchema: checkoutSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setSubmitting(false);
      resetForm(false);
    },
  });

  const handleSubmit = () => {
    const order = { list, total };
    submitOrder(order);
  };
  const submitOrder = order => {
    console.log('Замовлення відправлено:', order);
  };

  return (
    <>
      <Form noValidate onSubmit={handleSubmit}>
        <Card className="mb-3">
          <Card.Body>
            <h2 className="mb-3">Покупець</h2>
            <Row className="mb-3">
              {/* ІМ'Я */}

              <Form.Group as={Col} md="6">
                <Form.Label>Ім&#39;я</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  isValid={formik.touched.firstName && !formik.errors.firstName}
                />

                {formik.touched.firstName && formik.errors.firstName && (
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.firstName}
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              {/* Прізвище */}

              <Form.Group as={Col} md="6">
                <Form.Label>Прізвище</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  isValid={formik.touched.lastName && !formik.errors.lastName}
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

              <Form.Group as={Col} md="6">
                <Form.Label>Email</Form.Label>
                <InputGroup hasValidation>
                  <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                  <Form.Control
                    type="email"
                    placeholder="XXX@XXX.XX"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    isInvalid={formik.touched.email && !formik.errors.email}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.email}
                    </Form.Control.Feedback>
                  )}
                </InputGroup>
              </Form.Group>

              {/* Моб ТЕЛЕФОН */}

              <Form.Group as={Col} md="6">
                <Form.Label>Моб. телефон</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="+38(0ХХ)ХХХХХХХ"
                  maxLength="10"
                  name="phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  isInvalid={formik.touched.phone && !formik.errors.phone}
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
          <Card.Body>
            <h2 className="mb-3">Адреса доставки</h2>

            {/* Область */}

            <Row className="mb-3">
              <Form.Group as={Col} md="6">
                <Form.Label>Область</Form.Label>
                <NPregionsFilter ref={regionInput} formik={formik} />
              </Form.Group>

              {/* МІСТО */}

              <Form.Group as={Col} md="6">
                <Form.Label>Місто</Form.Label>

                <NPcityFilter ref={cityInput} formik={formik} />
              </Form.Group>
            </Row>

            {/* Відділення */}

            <Row className="mb-3">
              <Form.Group as={Col} md="6">
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
                <Form.Label>Коментар</Form.Label>
                <Form.Control name="comment" as="textarea" rows={3} />
              </Form.Group>
            </Row>
          </Card.Body>
        </Card>
        <div className="text-end">
          <Button variant="info" type="submit">
            Оформити замовлення
          </Button>
        </div>
      </Form>
    </>
  );
};

export default Checkout;
