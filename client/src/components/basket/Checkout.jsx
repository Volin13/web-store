import React, { useRef } from 'react';
import { useFormik } from 'formik';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { checkoutSchema } from '../../utils/checkoutSchema';
import NPterminalFilter from '../UI/UX/NPterminalFilter/NPterminalFilter';

const Checkout = ({ list, total }) => {
  const terminalInput = useRef(null);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      state: '',
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

            <Row className="mb-3">
              <Form.Group as={Col} md="6">
                <Form.Label>Область</Form.Label>
                <Form.Control
                  type="text"
                  name="state"
                  value={formik.values.state}
                  onChange={formik.handleChange}
                  isInvalid={formik.touched.state && !formik.errors.state}
                />

                {formik.touched.state && formik.errors.state && (
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.state}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
              <Form.Group as={Col} md="6">
                <Form.Label>Місто</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  isInvalid={formik.touched.city && !formik.errors.city}
                />
                {formik.touched.city && formik.errors.city && (
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.city}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="6">
                <Form.Label>№ Відділення (Нова пошта)</Form.Label>
                <NPterminalFilter ref={terminalInput} formik={formik} />
                {formik.touched.terminal && formik.errors.terminal && (
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.terminal}
                  </Form.Control.Feedback>
                )}
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
