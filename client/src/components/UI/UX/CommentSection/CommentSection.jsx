import React, { useEffect } from 'react';
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
} from '../../../../http/commentsApi';
import replyImg from '../../../../assets/defultIcons/reply.svg';
const CommentSection = ({ user, id }) => {
  const [comments, setComments] = useState([]);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  useEffect(() => {
    fetchDeviceComments(id).then(data => setComments(data.rows));
  }, []);

  const handleSendMessageClick = (type, commentId) => {
    if (type === 'comment') {
      createComment(id, user, formik.values.comment);
    }
    if (type === 'reply') {
      createReply(commentId, formik.values.reply);
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
                        <div className="d-flex justify-content-between">
                          <div className="flex-grow-1">
                            <p>{comment?.text}</p>
                          </div>
                          {user?.isAuth && (
                            <OverlayTrigger
                              placement="bottom"
                              delay={{ show: 250, hide: 400 }}
                              overlay={<Tooltip>Відповісти</Tooltip>}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setShowReplyInput(!showReplyInput);
                                }}
                              >
                                <Image src={replyImg} width={20} height={20} />
                              </button>
                            </OverlayTrigger>
                          )}
                        </div>
                        {showReplies && comment?.reply?.length ? (
                          <>
                            <ul className="p-3">
                              {comment?.reply.map(item => (
                                <li key={item?.id} className="mb-2">
                                  <p>{item?.text}</p>
                                </li>
                              ))}
                            </ul>
                            {!showReplyInput && (
                              <div
                                className="d-flex justify-content-end"
                                style={{ paddingRight: '16px' }}
                              >
                                <button
                                  onClick={() => setShowReplyInput(true)}
                                  style={{
                                    color: '#0c6efc',
                                    marginRight: '20px',
                                  }}
                                >
                                  Відповісти
                                </button>
                                <button
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
                                placeholder="Дотримуйтесь культури спілкування будь-ласка"
                                name="reply"
                                as="textarea"
                                rows={2}
                                value={formik.values.reply}
                                onChange={formik.handleChange}
                              />
                            </Form.Group>
                            <div className="d-flex justify-content-end mt-3">
                              <Button
                                variant="outline-primary"
                                type="submit"
                                disabled={!user?.isAuth}
                                className="p-2"
                                onClick={() => {
                                  handleSendMessageClick('reply', comment.id);
                                }}
                                style={{ marginRight: '10px' }}
                              >
                                Відповісти
                              </Button>
                              <Button
                                className="p-2"
                                variant="outline-danger"
                                onClick={() => setShowReplyInput(false)}
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
                      as="textarea"
                      rows={3}
                    />
                  </Form.Group>
                </Row>
                <div className="text-end">
                  <Button
                    variant="outline-primary"
                    type="submit"
                    disabled={!user?.isAuth}
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
