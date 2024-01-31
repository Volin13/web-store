import React, { useRef, useState } from 'react';
import {
  Button,
  Card,
  Image,
  Form,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import css from './CommentSection.module.css';
import PropTypes from 'prop-types';
import replyImg from '../../../../assets/defultIcons/reply.svg';
import editImg from '../../../../assets/defultIcons/edit-message.svg';
import deleteImg from '../../../../assets/defultIcons/delete-message.svg';

import {
  deleteComment,
  deleteReply,
  userId,
} from '../../../../http/commentsApi';

import MessagesLoading from '../Spinner/MessagesLoading';
import RepliesList from './RepliesList';
import CommentText from './CommentText';
const CommentsList = ({
  list,
  user,
  formik,
  isValid,
  loading,
  setIsEdditing,
  showReplyInput,
  setShowReplyInput,
  handleSendMessageClick,
}) => {
  const [showReplies, setShowReplies] = useState(false);

  const replyInput = useRef(null);
  // по кліку на едіт встановлюю текст у відповідне поле для валідації і відправки
  // вмикаю режим редагування + відкриваю інпут для редагування і скролю до нього для зручності

  const handleEditClick = (type, text) => {
    formik.setFieldValue(type, text);
    setIsEdditing(true);
    if (type === 'reply') {
      setShowReplyInput(true);
    }
    if (replyInput.current) {
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
  return (
    <ul className="my-3">
      {list?.map(comment => (
        <Card as="li" key={comment?.id} className="my-2">
          <Card.Body>
            <div className="d-flex align-items-start">
              <div
                className="d-flex flex-column align-items-center justify-content-start"
                style={{ marginRight: '15px' }}
              >
                <Image width={40} height={40} src={comment?.avatar} />
                <span>{comment?.login}</span>
              </div>
              <div
                className={`d-flex flex-column-reverse flex-sm-row align-items-end justify-content-sm-end justify-content-md-between align-items-sm-start flex-grow-1 ${css.commentThumb}`}
              >
                <div className="d-flex flex-column align-items-end">
                  <CommentText text={comment?.text} />
                </div>

                {user?.isAuth && (
                  <div className="d-flex" style={{ marginLeft: '10px' }}>
                    <OverlayTrigger
                      placement="bottom"
                      delay={{ show: 250, hide: 400 }}
                      overlay={<Tooltip>Змінити</Tooltip>}
                    >
                      <button
                        onClick={() => {
                          setShowReplyInput(false);
                          handleEditClick('comment', comment?.text);
                        }}
                        style={{
                          marginRight: '15px',
                          display:
                            userId === comment?.userId ? 'block' : 'none',
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
                        <Image src={replyImg} width={20} height={20} />
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
                            userId === comment?.userId ? 'block' : 'none',
                        }}
                        type="button"
                        className={`${css.messageBtn}`}
                        onClick={() => {
                          setShowReplyInput(false);
                          handleDeleteClick('comment', comment?.id);
                        }}
                      >
                        <Image width={20} height={20} src={deleteImg} />
                      </button>
                    </OverlayTrigger>
                  </div>
                )}
              </div>
            </div>
            {showReplies && comment?.reply?.length ? (
              <>
                <RepliesList
                  userId={userId}
                  repliesList={comment?.reply}
                  handleEditClick={handleEditClick}
                  handleDeleteClick={handleDeleteClick}
                />
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
                {comment?.reply?.length ? (
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
                ) : null}
              </div>
            )}
            {showReplyInput && (
              <div className="mt-2">
                {loading ? (
                  <MessagesLoading />
                ) : (
                  <Form.Group>
                    <Form.Control
                      ref={replyInput}
                      placeholder="Дотримуйтесь культури спілкування будь-ласка"
                      name="reply"
                      as="textarea"
                      value={formik.values.reply}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.reply && !!formik.errors.reply}
                      rows={2}
                    />

                    {formik.touched.reply && formik.errors.reply && (
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.reply}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                )}
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
          <Card.Footer className="text-end">
            {new Date(comment?.updatedAt).toLocaleString()}
          </Card.Footer>
        </Card>
      ))}
    </ul>
  );
};
CommentsList.propTypes = {
  list: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  isValid: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  formik: PropTypes.object.isRequired,
  showReplyInput: PropTypes.bool.isRequired,
  setIsEdditing: PropTypes.func.isRequired,
  setShowReplyInput: PropTypes.func.isRequired,
  handleSendMessageClick: PropTypes.func.isRequired,
};
export default CommentsList;
