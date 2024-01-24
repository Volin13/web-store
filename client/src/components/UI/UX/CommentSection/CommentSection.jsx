import React, { useEffect, useRef } from 'react';
import {
  Button,
  Card,
  Form,
  Image,
  OverlayTrigger,
  Row,
  Tooltip,
} from 'react-bootstrap';
import { useFormik } from 'formik';
import css from './CommentSection.module.css';
import { commentSchema } from '../../../../utils/commentSchema';
import { useState } from 'react';
import {
  createComment,
  createReply,
  fetchDeviceComments,
  editComment,
  editReply,
  userId,
  deleteComment,
  deleteReply,
} from '../../../../http/commentsApi';
import replyImg from '../../../../assets/defultIcons/reply.svg';
import editImg from '../../../../assets/defultIcons/edit-message.svg';
import deleteImg from '../../../../assets/defultIcons/delete-message.svg';

const CommentSection = ({ user, id }) => {
  const [comments, setComments] = useState([]);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [isEdditing, setIsEdditing] = useState(false);
  const replyInput = useRef(null);

  // Завантажуєм коментарі до девайсу при першому завантаженні сторінки
  useEffect(() => {
    fetchDeviceComments(id).then(data => setComments(data.rows));
  }, []);
  //  відправка повідомлення/відповіді + редагування
  const handleSendMessageClick = (type, commentId) => {
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
  // по кліку на едіт встановлюю текст у відповідне поле для валідації і відправки
  // вмикаю режим редагування + відкриваю інпут для редагування і скролю до нього для зручності
  console.log(replyInput);
  const handleEditClick = (type, text) => {
    formik.setFieldValue(type, text);
    setIsEdditing(true);
    setShowReplyInput(true);
    if (replyInput) {
      replyInput.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  // обробка видалення повідомлення/відповіді
  const handleDeleteClick = (type, commentId) => {
    if (type === 'comment') {
      deleteComment(commentId, user, formik.values.comment);
    }
    if (type === 'reply') {
      deleteReply(commentId, formik.values.reply);
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
      handleSendMessageClick();
      setSubmitting(false);
      resetForm();
      fetchDeviceComments(id).then(data => setComments(data.rows));
    },
  });
  const isValid = commentSchema.isValidSync(formik.values);
  console.log(isValid);
  console.log(comments);
  return (
    <div className="mt-3">
      <Card className="mb-3 pt-3">
        <Card.Title as="h2" style={{ paddingLeft: '12px' }}>
          Відгуки
        </Card.Title>
        <Card.Body>
          <Form onSubmit={formik.handleSubmit}>
            {comments?.length ? (
              <Row className="my-3">
                <ul>
                  {comments?.map(comment => (
                    <Card as="li" key={comment.id}>
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="flex-grow-1">
                            <p>{comment?.text}</p>
                          </div>
                          {user?.isAuth && (
                            <>
                              <OverlayTrigger
                                placement="bottom"
                                delay={{ show: 250, hide: 400 }}
                                overlay={<Tooltip>Змінити</Tooltip>}
                              >
                                <button
                                  onClick={() => {
                                    setShowReplyInput(true);
                                    handleEditClick('comment', comment?.text);
                                  }}
                                  style={{
                                    marginRight: '15px',
                                    display:
                                      userId === comment?.userId
                                        ? 'block'
                                        : 'none',
                                  }}
                                  className={`${css.messageBtn}`}
                                  type="button"
                                >
                                  <Image width={20} height={20} src={editImg} />
                                </button>
                              </OverlayTrigger>
                              <OverlayTrigger
                                placement="bottom"
                                delay={{ show: 250, hide: 400 }}
                                overlay={<Tooltip>Відповісти</Tooltip>}
                              >
                                <button
                                  style={{ marginRight: '15px' }}
                                  className={`${css.messageBtn}`}
                                  type="button"
                                  onClick={() => {
                                    setShowReplyInput(!showReplyInput);
                                  }}
                                >
                                  <Image
                                    src={replyImg}
                                    width={20}
                                    height={20}
                                  />
                                </button>
                              </OverlayTrigger>
                              <OverlayTrigger
                                placement="bottom"
                                delay={{ show: 250, hide: 400 }}
                                overlay={<Tooltip>Видалити</Tooltip>}
                              >
                                <button
                                  style={{
                                    display:
                                      userId === comment?.userId
                                        ? 'block'
                                        : 'none',
                                  }}
                                  type="button"
                                  className={`${css.messageBtn}`}
                                  onClick={() => handleDeleteClick('reply')}
                                >
                                  <Image
                                    width={20}
                                    height={20}
                                    src={deleteImg}
                                  />
                                </button>
                              </OverlayTrigger>
                            </>
                          )}
                        </div>
                        {showReplies && comment?.reply?.length ? (
                          <>
                            <ul className="p-3">
                              {comment?.reply.map(item => (
                                <Card
                                  as="li"
                                  key={item?.id}
                                  className="mb-2 p-2"
                                >
                                  <Card.Body className="d-flex justify-content-between align-items-center">
                                    <p className="flex-grow-1 p-1">
                                      {item?.text}
                                    </p>
                                    <OverlayTrigger
                                      placement="bottom"
                                      delay={{ show: 250, hide: 400 }}
                                      overlay={<Tooltip>Змінити</Tooltip>}
                                    >
                                      <button
                                        style={{
                                          marginRight: '15px',
                                          display:
                                            userId === item?.userId
                                              ? 'block'
                                              : 'none',
                                        }}
                                        className={`${css.messageBtn}`}
                                        type="button"
                                        onClick={() => {
                                          handleEditClick('reply', item?.text);
                                        }}
                                      >
                                        <Image
                                          width={18}
                                          height={18}
                                          src={editImg}
                                        />
                                      </button>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                      placement="bottom"
                                      delay={{ show: 250, hide: 400 }}
                                      overlay={<Tooltip>Видалити</Tooltip>}
                                    >
                                      <button
                                        style={{
                                          display:
                                            userId === item?.userId
                                              ? 'block'
                                              : 'none',
                                        }}
                                        className={`${css.messageBtn}`}
                                        type="button"
                                        onClick={() =>
                                          handleDeleteClick('reply')
                                        }
                                      >
                                        <Image
                                          width={18}
                                          height={18}
                                          src={deleteImg}
                                        />
                                      </button>
                                    </OverlayTrigger>
                                  </Card.Body>
                                </Card>
                              ))}
                            </ul>
                            {!showReplyInput && (
                              <div
                                className="d-flex justify-content-end"
                                style={{ paddingRight: '16px' }}
                              >
                                <button
                                  className={`${css.messageBtn}`}
                                  onClick={() => setShowReplyInput(true)}
                                  style={{
                                    color: '#0c6efc',
                                    marginRight: '20px',
                                  }}
                                >
                                  Відповісти
                                </button>
                                <button
                                  className={`${css.messageBtn}`}
                                  onClick={() => setShowReplies(false)}
                                  style={{ color: '#0c6efc' }}
                                >
                                  Закрити
                                </button>
                              </div>
                            )}
                          </>
                        ) : (
                          <div
                            className="d-flex justify-content-end"
                            style={{ paddingRight: '16px' }}
                          >
                            <OverlayTrigger
                              placement="bottom"
                              delay={{ show: 250, hide: 400 }}
                              overlay={<Tooltip>Переглянути</Tooltip>}
                            >
                              <button
                                className={`${css.messageBtn} mt-2`}
                                onClick={() => setShowReplies(true)}
                                style={{ color: '#0c6efc' }}
                              >
                                {`${comment?.reply?.length} ${
                                  comment?.reply?.length === 1
                                    ? 'відповідь'
                                    : 'відповідей'
                                }`}
                              </button>
                            </OverlayTrigger>
                          </div>
                        )}
                        {showReplyInput && (
                          <div className="mt-2">
                            <Form.Group>
                              <Form.Control
                                ref={replyInput}
                                placeholder="Дотримуйтесь культури спілкування будь-ласка"
                                name="reply"
                                as="textarea"
                                value={formik.values.reply}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={
                                  formik.touched.reply && !!formik.errors.reply
                                }
                                rows={2}
                              />

                              {formik.touched.reply && formik.errors.reply && (
                                <Form.Control.Feedback type="invalid">
                                  {formik.errors.reply}
                                </Form.Control.Feedback>
                              )}
                            </Form.Group>
                            <div className="d-flex justify-content-end mt-3">
                              <Button
                                variant="outline-primary"
                                type="submit"
                                disabled={!user?.isAuth || !isValid}
                                className="p-2"
                                onClick={() => {
                                  handleSendMessageClick('reply', comment.id);
                                  setIsEdditing(false);
                                }}
                                style={{ marginRight: '10px' }}
                              >
                                Відправити
                              </Button>
                              <Button
                                className="p-2"
                                variant="outline-danger"
                                onClick={() => {
                                  setShowReplyInput(false);
                                  formik.setFieldValue('reply', '');
                                  setIsEdditing(false);
                                }}
                              >
                                Закрити
                              </Button>
                            </div>
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  ))}
                </ul>
              </Row>
            ) : (
              <Row className="my-3">
                <h2 className="text-center "> Коментарів поки немає</h2>
              </Row>
            )}
            {!showReplyInput && (
              <>
                <Row className="p-3">
                  <Form.Group>
                    <Form.Label>Додайте свій відгук</Form.Label>
                    <Form.Control
                      placeholder="Дотримуйтесь культури спілкування будь-ласка"
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
                </Row>
                <div className="text-end">
                  <Button
                    variant="outline-primary"
                    type="submit"
                    disabled={!user?.isAuth || !isValid}
                    className="p-2 mt-3"
                    onClick={() => {
                      handleSendMessageClick('comment');
                    }}
                  >
                    {user.isAuth ? 'Відправити' : 'Увійдіть щоб прокоментувати'}
                  </Button>
                </div>
              </>
            )}
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CommentSection;
