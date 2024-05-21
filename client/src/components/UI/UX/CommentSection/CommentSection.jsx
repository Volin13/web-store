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
import CommentPagination from './CommentPagination';

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
    fetchDeviceComments(id, device.commentPage, device.commentsLimit).then(
      data => {
        setCommentsList(data.rows);
        setLoading(false);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  //  відправка повідомлення/відповіді + редагування
  const handleSendMessageClick = async (type, commentId) => {
    if (isEdditing) {
      await editMessage(type, formik.values.messageId);
      setIsEdditing(false);
    }
    if (type === 'comment' && !isEdditing) {
      const commentText = formik.values.comment;
      await createComment(id, user, commentText.trim());
    }
    if (type === 'reply' && !isEdditing) {
      const replyText = formik.values.reply;
      await createReply(commentId, replyText.trim());
      setShowReplyInput(false);
    }
  };
  // редагую коментар/відповідь
  const editMessage = async (type, messageId) => {
    if (type === 'comment') {
      await editComment(messageId, user, formik.values.comment);
    }
    if (type === 'reply') {
      await editReply(messageId, formik.values.reply);
      setShowReplyInput(false);
    }
  };
  // обробка кліку на кнопку едіт - встановлюю режим редагування, тип і скролю до відповідного інпута
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
  // скидаю режим редагування (якшо є) скидаю значення інпуту
  // (якшо є) встановлюю тип і значення інпута який треба показувати
  const handleReplyClick = (type, commentId, ref) => {
    setShowReplyInput(commentId);
    formik.setFieldValue('messageId', commentId);
    formik.setFieldValue('comment', '');
    formik.setFieldValue('type', type);
    setIsEdditing(false);
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
    onSubmit: async (values, { resetForm }) => {
      const { type, messageId } = values;
      try {
        setLoading(true);
        handleSendMessageClick(type, messageId);
        setIsEdditing(false);
      } catch (error) {
        toast.error('При відправці сталась помилка, спробуйте пізніше');
        console.log(error);
      } finally {
        await fetchDeviceComments(
          id,
          device.commentPage,
          device.commentsLimit
        ).then(data => {
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
                id={id}
                user={user}
                formik={formik}
                isValid={isValid}
                loading={loading}
                list={commentsList}
                setIsEdditing={setIsEdditing}
                showReplyInput={showReplyInput}
                setCommentsList={setCommentsList}
                handleEditClick={handleEditClick}
                handleReplyClick={handleReplyClick}
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
            {(formik.values.type === 'comment' || !showReplyInput) && (
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
      <CommentPagination state={device} />
    </div>
  );
});

CommentSection.propTypes = {
  user: PropTypes.object,
  id: PropTypes.string,
};

export default CommentSection;
