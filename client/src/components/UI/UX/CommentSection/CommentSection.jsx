import React from 'react';
import { Button, Card, Form, Row } from 'react-bootstrap';
import { useFormik } from 'formik';
import css from './CommentSection.module.css';
import { commentSchema } from '../../../../utils/commentSchema';

const CommentSection = ({ sendMessage, user }) => {
  const formik = useFormik({
    initialValues: {
      comment: '',
      reply: '',
    },

    validationSchema: commentSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      //   createOrder(user, values, list);
      setSubmitting(false);
      resetForm(false);
    },
  });
  return (
    <div>
      <Card className="mb-3">
        <Card.Body>
          <Row>
            <Form.Group>
              <Form.Label>Коментарі</Form.Label>
              <Form.Control
                placeholder="Додайте свій відгук на девайс"
                name="comment"
                onChange={formik.handleChange}
                as="textarea"
                rows={3}
              />
            </Form.Group>
          </Row>
          <Button
            variant="primary"
            disabled={!user.isAuth}
            className="p-2"
            onClick={sendMessage}
          >
            {user.isAuth ? 'Відправити' : 'Увійдіть щоб прокоментувати'}
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CommentSection;
