import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../../..';
import { Button, Card, Form, Row } from 'react-bootstrap';
import { useFormik } from 'formik';
import { observer } from 'mobx-react-lite';
import { commentSchema } from '../../../../utils/commentSchema';
import {
  createComment,
  createReply,
  fetchDeviceComments,
  editComment,
  editReply,
} from '../../../../http/commentsApi';
import { toast } from 'react-toastify';

import PropTypes from 'prop-types';
import MessagesLoading from '../Spinner/MessagesLoading';
import CommentsList from './CommentsList';

const CommentSection = observer(({ user, id }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [isEdditing, setIsEdditing] = useState(false);
  const [commentsList, setCommentsList] = useState([]);
  const [loading, setLoading] = useState(false);

  const { device } = useContext(Context);

  // Завантажуєм коментарі до девайсу при першому завантаженні сторінки
  useEffect(() => {
    fetchDeviceComments(id, device.page, device.limit).then(data =>
      setCommentsList(data.rows)
    );
  }, []);

  //  відправка повідомлення/відповіді + редагування
  const handleSendMessageClick = (type, commentId) => {
    try {
      setLoading(true);
      if (type === 'comment') {
        createComment(id, user, formik.values.comment);
      }
      if (type === 'reply') {
        createReply(commentId, formik.values.reply);
        setShowReplyInput(false);
      }
      if (isEdditing) {
        editMessage(type, commentId);
        setIsEdditing(false);
      }
    } catch (error) {
      toast.error('При відправці сталась помилка, спробуйте пізніше');
      console.log(error);
    } finally {
      setLoading(false);
      fetchDeviceComments(id, device.page, device.limit).then(data =>
        setCommentsList(data.rows)
      );
    }
  };
  // редагую коментар/відповідь
  const editMessage = (type, commentId) => {
    if (type === 'comment') {
      editComment(commentId, user, formik.values.comment);
    }
    if (type === 'reply') {
      editReply(commentId, formik.values.reply);
      setShowReplyInput(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      comment: '',
      reply: '',
    },

    validationSchema: commentSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      try {
        setLoading(true);
        handleSendMessageClick();
      } catch (error) {
        toast.error('При відправці сталась помилка, спробуйте пізніше');
      } finally {
        setLoading(false);
        fetchDeviceComments(id, device.page, device.limit).then(data =>
          setCommentsList(data.rows)
        );
        setSubmitting(false);
        resetForm();
      }
    },
  });
  const isValid = commentSchema.isValidSync(formik.values);

  return (
    <div className="mt-3">
      <Card className="pt-3 mt-2">
        {commentsList.length ? (
          <Card.Title as="h2" style={{ paddingLeft: '12px', margin: 0 }}>
            Відгуки
          </Card.Title>
        ) : null}
        <Card.Body>
          <Form onSubmit={formik.handleSubmit}>
            {commentsList.length ? (
              <CommentsList
                list={commentsList}
                user={user}
                formik={formik}
                isValid={isValid}
                loading={loading}
                setIsEdditing={setIsEdditing}
                showReplyInput={showReplyInput}
                setShowReplyInput={setShowReplyInput}
                handleSendMessageClick={handleSendMessageClick}
              />
            ) : (
              <Row className="my-3">
                <h2 className="text-center "> Коментарів поки немає</h2>
              </Row>
            )}
            {!showReplyInput && (
              <>
                <Row className="p-3">
                  {loading ? (
                    <MessagesLoading />
                  ) : (
                    <Form.Group>
                      <Form.Label>
                        {isEdditing
                          ? 'Редагувати коментар'
                          : 'Додайте свій відгук'}
                      </Form.Label>
                      <Form.Control
                        placeholder="Дотримуйтесь культури спілкування, будь ласка."
                        name="comment"
                        value={formik.values.comment}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={
                          formik.touched.comment && !!formik.errors.comment
                        }
                        as="textarea"
                        rows={3}
                      />

                      {formik.touched.comment && formik.errors.comment && (
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.comment}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                  )}
                </Row>
                <div className="text-end">
                  <Button
                    variant="outline-primary"
                    type="submit"
                    disabled={!user?.isAuth || !isValid}
                    className="p-2 mt-1"
                    onClick={() => {
                      handleSendMessageClick('comment');
                    }}
                  >
                    {user.isAuth ? 'Відправити' : 'Увійдіть щоб прокоментувати'}
                  </Button>
                  {isEdditing && (
                    <Button
                      style={{ marginLeft: '15px' }}
                      variant="outline-danger"
                      type="submit"
                      disabled={!isValid}
                      className="p-2 mt-3"
                      onClick={() => {
                        setIsEdditing(false);
                        formik.setFieldValue('comment', '');
                      }}
                    >
                      Відмінити{' '}
                    </Button>
                  )}
                </div>
              </>
            )}
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
});

CommentSection.propTypes = {
  user: PropTypes.object,
  id: PropTypes.number,
};

export default CommentSection;
