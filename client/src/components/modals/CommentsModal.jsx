import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import { Context } from '../..';
import * as yup from 'yup';
import {
  Image,
  Form,
  Modal,
  Placeholder,
  ListGroup,
  Button,
  OverlayTrigger,
  Tooltip,
  NavLink,
} from 'react-bootstrap';
import RepliesList from '../UI/UX/CommentSection/RepliesList';
import CommentPagination from '../UI/UX/CommentSection/CommentPagination';
import MessagesLoading from '../UI/UX/Spinner/MessagesLoading';
import DeleteMessageModal from './DeleteMessageModal';
import {
  deleteComment,
  deleteReply,
  editComment,
  editReply,
  fetchAllComments,
} from '../../http/commentsApi';
import css from '../UI/UX/CommentSection/CommentSection.module.css';
import editIcon from '../../assets/defultIcons/edit-message.svg';
import deleteIcon from '../../assets/defultIcons/delete-message.svg';
import DataPicker from '../UI/UX/DataPicker/DataPicker';
import { observer } from 'mobx-react-lite';
import { toast } from 'react-toastify';
import { DEVICE_ROUTE } from '../../utils/constants';

const CommentsModal = observer(({ show, onHide }) => {
  const [loading, setLoading] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState({
    type: '',
    commentId: 0,
  });
  const { user } = useContext(Context);
  useEffect(() => {
    setLoading(true);
    fetchAllComments().then(data => {
      user.setTotalCommentCount(data?.count);
      user.setAdminComments(data?.rows);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchAllComments(
      user.commentDate,
      user.commentPage,
      user.commentsLimit
    ).then(data => {
      user.setAdminComments(data?.rows);
      setLoading(false);
    });
  }, [user, user.commentPage, user.commentDate]);

  let typeSchema = yup.object().shape({
    comment: yup
      .string()
      .trim()
      .min(3, 'Назва занадто коротка')
      .max(30, 'Назва занадто довга')
      .lowercase()
      .required('Введіть тип'),
  });
  const formik = useFormik({
    initialValues: {
      comment: '',
      reply: '',
      messageId: '',
      type: '',
    },
    validationSchema: typeSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const { comment, reply, messageId, type } = values;
      try {
        if (type === 'comment') {
          setSubmitting(true);
          await editComment(messageId, user, comment);
        }
        if (type === 'reply') {
          setSubmitting(true);
          await editReply(messageId, reply);
        }
        setShowReplyInput(false);
      } catch (error) {
        toast.error('При відправці сталась помилка, спробуйте пізніше');
        console.log(error);
      } finally {
        fetchAllComments(
          user.commentDate,
          user.commentPage,
          user.commentsLimit
        ).then(data => {
          user.setAdminComments(data?.rows);
          setLoading(false);
        });
      }
      setSubmitting(false);
      resetForm(true);
    },
  });

  const handleDeleteClick = async deleteMessage => {
    const { type, commentId } = deleteMessage;
    try {
      if (type === 'comment') {
        setLoading(true);
        await deleteComment(commentId, user.isAuth, formik.values.comment).then(
          setShowDeleteModal(false)
        );
      }
      if (type === 'reply') {
        setLoading(true);
        await deleteReply(commentId, formik.values.reply).then(
          setShowDeleteModal(false)
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      fetchAllComments(
        user.commentDate,
        user.commentPage,
        user.commentsLimit
      ).then(data => {
        user.setAdminComments(data?.rows);
        setLoading(false);
      });
    }
  };

  const isValid = typeSchema.isValidSync(formik.values);
  return (
    <>
      <Modal
        size="lg"
        show={show}
        onHide={() => {
          user.setCommentDate('');
          onHide();
        }}
        centered
      >
        <Modal.Header closeButton>
          <h2>Коментарі користувачів</h2>
        </Modal.Header>
        <Modal.Title className="text-center" id="contained-modal-title-vcenter">
          <DataPicker user={user} />
        </Modal.Title>
        <Modal.Body>
          <ListGroup style={{ height: '350px', overflowY: 'auto' }}>
            {loading ? (
              <>
                {Array.from({ length: 8 }, (_, index) => (
                  <ListGroup.Item
                    key={index}
                    className="text-center text-sm-start "
                  >
                    <Placeholder as="p" animation="glow">
                      <Placeholder xs={12} />
                    </Placeholder>
                  </ListGroup.Item>
                ))}
              </>
            ) : (
              <>
                {user.adminComments?.map(comment => (
                  <ListGroup.Item
                    className="text-center text-sm-start"
                    key={comment.id}
                  >
                    <div className="d-flex" style={{ gap: '15px' }}>
                      <span className="flex-grow-1">{comment?.login}</span>
                      <OverlayTrigger
                        placement="bottom"
                        delay={{ show: 250, hide: 400 }}
                        overlay={<Tooltip>Змінити</Tooltip>}
                      >
                        <button
                          onClick={() => {
                            setShowReplyInput(comment?.id);
                            formik.setFieldValue('comment', comment?.text);
                            formik.setFieldValue('messageId', comment?.id);
                            formik.setFieldValue('type', 'comment');
                          }}
                          style={{
                            marginRight: '15px',
                          }}
                          className={`${css.messageBtn}`}
                          type="button"
                        >
                          <Image width={20} height={20} src={editIcon} />
                        </button>
                      </OverlayTrigger>

                      <OverlayTrigger
                        placement="bottom"
                        delay={{ show: 250, hide: 400 }}
                        overlay={<Tooltip>Видалити</Tooltip>}
                      >
                        <button
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
                          <Image width={20} height={20} src={deleteIcon} />
                        </button>
                      </OverlayTrigger>
                    </div>
                    <NavLink to={DEVICE_ROUTE + `/${comment.deviceId}`}>
                      <p
                        className="p-1"
                        style={{
                          backgroundColor: '#e6e9ec',
                          borderRadius: '8px',
                        }}
                      >
                        {comment.text}
                      </p>
                    </NavLink>

                    {showReplies === comment?.id ? (
                      <>
                        <RepliesList
                          user={user}
                          formik={formik}
                          isGravatar={() => {}}
                          commentId={comment?.id}
                          repliesList={comment?.reply}
                          handleDeleteClick={handleDeleteClick}
                          setShowReplyInput={setShowReplyInput}
                          setShowDeleteModal={setShowDeleteModal}
                          setMessageToDelete={setMessageToDelete}
                        />
                        <div className="text-end">
                          <button
                            style={{ color: '#0c6efc' }}
                            onClick={() => setShowReplies(false)}
                            type="button"
                          >
                            Приховати
                          </button>
                        </div>
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
                    {loading ? (
                      <MessagesLoading />
                    ) : (
                      <>
                        {showReplyInput === comment?.id && (
                          <Form onSubmit={formik.handleSubmit}>
                            <Form.Group>
                              <Form.Control
                                placeholder="Дотримуйтесь культури спілкування будь-ласка"
                                name="comment"
                                as="textarea"
                                value={formik.values.comment}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={
                                  formik.touched.comment &&
                                  !!formik.errors.comment
                                }
                                rows={2}
                              />
                              {formik.touched.comment &&
                                formik.errors.comment && (
                                  <Form.Control.Feedback type="invalid">
                                    {formik.errors.comment}
                                  </Form.Control.Feedback>
                                )}
                              <div className="d-flex justify-content-end mt-3">
                                <Button
                                  variant="outline-primary"
                                  type="submit"
                                  disabled={!isValid}
                                  className="p-2"
                                  style={{ marginRight: '10px' }}
                                  onClick={() => formik.submitForm()}
                                >
                                  Відправити
                                </Button>
                                <Button
                                  className="p-2"
                                  type="button"
                                  variant="outline-danger"
                                  onClick={() => {
                                    formik.setFieldValue('reply', '');
                                    setShowReplyInput(false);
                                  }}
                                >
                                  Закрити
                                </Button>
                              </div>
                            </Form.Group>
                          </Form>
                        )}
                      </>
                    )}
                  </ListGroup.Item>
                ))}
              </>
            )}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <CommentPagination state={user} />
        </Modal.Footer>
      </Modal>
      <DeleteMessageModal
        handleDeleteClick={handleDeleteClick}
        messageToDelete={messageToDelete}
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
      />
    </>
  );
});

CommentsModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
};

export default CommentsModal;
