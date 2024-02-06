import React, { useContext, useEffect, useRef, useState } from 'react';
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
  const messageInput = useRef(null);

  const { device } = useContext(Context);

  // Завантажуєм коментарі до девайсу при першому завантаженні сторінки
  useEffect(() => {
    setLoading(true);
    fetchDeviceComments(id, device.page, device.limit).then(data => {
      setCommentsList(data.rows);
      setLoading(false);
    });
  }, []);

  //  відправка повідомлення/відповіді + редагування
  const handleSendMessageClick = (type, commentId) => {
    if (isEdditing) {
      editMessage(type, formik.values.messageId);
      setIsEdditing(false);
    }
    if (type === 'comment' && !isEdditing) {
      createComment(id, user, formik.values.comment);
    }
    if (type === 'reply' && !isEdditing) {
      createReply(commentId, formik.values.reply);
      setShowReplyInput(false);
    }
  };
  // редагую коментар/відповідь
  const editMessage = (type, messageId) => {
    if (type === 'comment') {
      editComment(messageId, user, formik.values.comment);
    }
    if (type === 'reply') {
      editReply(messageId, formik.values.reply);
      setShowReplyInput(false);
    }
  };
  const handleEditClick = (type, text, ref) => {
    formik.setFieldValue(type, text);
    formik.setFieldValue('type', type);

    setIsEdditing(true);

    if (ref?.current) {
      ref?.current.scrollIntoView({ behavior: 'smooth' });
    }
    if (type === 'comment' && messageInput?.current) {
      messageInput?.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const formik = useFormik({
    initialValues: {
      comment: '',
      reply: '',
      type: '',
      messageId: 0,
    },
    validationSchema: commentSchema,
    onSubmit: (values, { resetForm }) => {
      const { type, messageId } = values;
      try {
        setLoading(true);
        handleSendMessageClick(type, messageId);
        setIsEdditing(false);
      } catch (error) {
        toast.error('При відправці сталась помилка, спробуйте пізніше');
        console.log(error);
      } finally {
        fetchDeviceComments(id, device.page, device.limit).then(data => {
          console.log(data);
          setCommentsList(data.rows);
          resetForm(true);
          setLoading(false);
        });
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
                user={user}
                formik={formik}
                isValid={isValid}
                loading={loading}
                list={commentsList}
                setIsEdditing={setIsEdditing}
                showReplyInput={showReplyInput}
                handleEditClick={handleEditClick}
                setShowReplyInput={setShowReplyInput}
                handleSendMessageClick={handleSendMessageClick}
              />
            ) : (
              <Row className="my-3">
                {loading ? (
                  <MessagesLoading />
                ) : (
                  <h2 className="text-center "> Коментарів поки немає</h2>
                )}
              </Row>
            )}
            {!showReplyInput && (
              <>
                <Row className="p-3">
                  {loading ? (
                    <MessagesLoading />
                  ) : (
                    <Form.Group ref={messageInput}>
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
                <div className="text-end  mt-1">
                  <Button
                    variant="outline-primary"
                    type="submit"
                    disabled={!user?.isAuth || !isValid}
                    className="p-2"
                    onClick={() => {
                      formik.setFieldValue('type', 'comment');
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
                      className="p-2"
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
