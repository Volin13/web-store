import React, { useContext, useRef, useState } from 'react';
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
  fetchDeviceComments,
  userId,
} from '../../../../http/commentsApi';

import MessagesLoading from '../Spinner/MessagesLoading';
import RepliesList from './RepliesList';
import CommentText from './CommentText';
import DeleteMessageModal from '../../../modals/DeleteMessageModal';
import { Context } from '../../../..';
const CommentsList = ({
  id,
  list,
  user,
  formik,
  isValid,
  loading,
  setIsEdditing,
  showReplyInput,
  setCommentsList,
  handleEditClick,
  handleReplyClick,
  setShowReplyInput,
}) => {
  const [showReplies, setShowReplies] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState({
    type: '',
    commentId: 0,
  });
  const { device } = useContext(Context);
  const replyInput = useRef(null);
  // по кліку на едіт встановлюю текст у відповідне поле для валідації і відправки
  // вмикаю режим редагування + відкриваю інпут для редагування і скролю до нього для зручності

  // обробка видалення повідомлення/відповіді
  const handleDeleteClick = async deleteMessage => {
    const { type, commentId } = deleteMessage;
    try {
      if (type === 'comment') {
        await deleteComment(commentId, user, formik.values.comment).then(
          setShowDeleteModal(false)
        );
      }
      if (type === 'reply') {
        await deleteReply(commentId, formik.values.reply).then(
          setShowDeleteModal(false)
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      await fetchDeviceComments(
        id,
        device.commentPage,
        device.commentsLimit
      ).then(data => {
        setCommentsList(data.rows);
        setIsEdditing(false);
        setShowReplyInput(false);
      });
    }
  };

  return (
    <>
      <ul className="my-3">
        {list?.map(comment => (
          <Card as="li" key={comment?.id} className="my-2">
            <Card.Body>
              <div className="d-flex align-items-start">
                <div
                  className="d-flex flex-column align-items-center justify-content-start"
                  style={{ marginRight: '15px' }}
                >
                  <Image
                    width={50}
                    height={50}
                    className={css.commentAvatar}
                    src={comment?.avatar}
                  />
                  <span>{comment?.login}</span>
                </div>
                <div
                  className={`d-flex flex-column-reverse flex-sm-row align-items-end justify-content-sm-end justify-content-md-between align-items-sm-start flex-grow-1 ${css.commentThumb}`}
                >
                  <div className="d-flex flex-column align-items-end flex-grow-1 text-start">
                    <CommentText text={comment?.text} />
                  </div>

                  {user?.isAuth && (
                    <div className="d-flex" style={{ marginLeft: '15px' }}>
                      <OverlayTrigger
                        placement="bottom"
                        delay={{ show: 250, hide: 400 }}
                        overlay={<Tooltip>Змінити</Tooltip>}
                      >
                        <button
                          onClick={() => {
                            setShowReplyInput(comment?.id);
                            handleEditClick(
                              'comment',
                              comment?.text,
                              replyInput
                            );
                            formik.setFieldValue('messageId', comment?.id);
                            formik.setFieldValue('type', 'comment');
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
                            handleReplyClick('reply', comment?.id, replyInput);
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
                            setShowDeleteModal(true);
                            setMessageToDelete({
                              type: 'comment',
                              commentId: comment?.id,
                            });
                          }}
                        >
                          <Image width={20} height={20} src={deleteImg} />
                        </button>
                      </OverlayTrigger>
                    </div>
                  )}
                </div>
              </div>
              {showReplies === comment?.id && comment?.reply?.length ? (
                <>
                  <RepliesList
                    formik={formik}
                    userId={userId}
                    ref={replyInput}
                    commentId={comment?.id}
                    repliesList={comment?.reply}
                    handleEditClick={handleEditClick}
                    handleReplyClick={handleReplyClick}
                    handleDeleteClick={handleDeleteClick}
                    setShowReplyInput={setShowReplyInput}
                    setMessageToDelete={setMessageToDelete}
                    setShowDeleteModal={setShowDeleteModal}
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
                        onClick={() => {
                          setShowReplies(comment?.id);
                          formik.setFieldValue('messageId', comment?.id);
                        }}
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
              {formik.values.type === 'reply' &&
                showReplyInput === comment?.id && (
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
                    )}
                    <div className="d-flex justify-content-end mt-3">
                      <Button
                        variant="outline-primary"
                        type="submit"
                        disabled={!user?.isAuth || !isValid}
                        className="p-2"
                        style={{ marginRight: '10px' }}
                      >
                        Відправити
                      </Button>
                      <Button
                        className="p-2"
                        variant="outline-danger"
                        onClick={() => {
                          formik.setFieldValue('reply', '');
                          setIsEdditing(false);
                          setShowReplyInput(false);
                        }}
                      >
                        Закрити
                      </Button>
                    </div>
                  </div>
                )}
            </Card.Body>
            <Card.Footer className="text-end">
              {new Date(comment?.createdAt).toLocaleString()}
            </Card.Footer>
          </Card>
        ))}
      </ul>
      <DeleteMessageModal
        handleDeleteClick={handleDeleteClick}
        messageToDelete={messageToDelete}
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
      />
    </>
  );
};
CommentsList.propTypes = {
  id: PropTypes.string,
  list: PropTypes.array,
  user: PropTypes.object,
  isValid: PropTypes.bool,
  loading: PropTypes.bool,
  formik: PropTypes.object,
  showReplyInput: PropTypes.any,
  setIsEdditing: PropTypes.func,
  handleEditClick: PropTypes.func,
  setCommentsList: PropTypes.func,
  handleReplyClick: PropTypes.func,
  setShowReplyInput: PropTypes.func,
};
export default CommentsList;
