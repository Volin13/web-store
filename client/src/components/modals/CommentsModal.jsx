import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
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
} from 'react-bootstrap';
import RepliesList from '../UI/UX/CommentSection/RepliesList';
import MessagesLoading from '../UI/UX/Spinner/MessagesLoading';
import DeleteMessageModal from './DeleteMessageModal';
import { fetchAllComments } from '../../http/commentsApi';
import css from '../UI/UX/CommentSection/CommentSection.module.css';
import editIcon from '../../assets/defultIcons/edit-message.svg';
import deleteIcon from '../../assets/defultIcons/delete-message.svg';

const CommentsModal = ({ show, onHide }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState({
    type: '',
    commentId: 0,
  });

  useEffect(() => {
    setLoading(true);
    fetchAllComments('', 1, 10).then(data => {
      setComments(data?.rows);
      setLoading(false);
    });
  }, []);

  let typeSchema = yup.object().shape({
    commentText: yup
      .string()
      .trim()
      .min(3, 'Назва занадто коротка')
      .max(30, 'Назва занадто довга')
      .lowercase()
      .required('Введіть тип'),
  });
  const formik = useFormik({
    initialValues: {
      commentText: '',
    },
    validationSchema: typeSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setSubmitting(false);
      resetForm(true);
    },
  });

  const handleDeleteClick = () => {};
  const handleEditClick = () => {};

  const isValid = typeSchema.isValidSync(formik.values);
  return (
    <>
      <Modal size="lg" show={show} onHide={onHide} centered>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Title className="text-center" id="contained-modal-title-vcenter">
          Останні коментарі
        </Modal.Title>
        <Modal.Body>
          <ListGroup style={{ overflowУ: 'auto', height: '450px' }}>
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
                {comments?.map(comment => (
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
                            handleEditClick('comment', comment?.text);
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
                    <p>{comment.text}</p>
                    {showReplies ? (
                      <>
                        <RepliesList
                          formik={formik}
                          isGravatar={''}
                          commentId={comment?.id}
                          repliesList={comment?.reply}
                          handleDeleteClick={handleDeleteClick}
                          setShowReplyInput={setShowReplyInput}
                          setShowDeleteModal={setShowDeleteModal}
                          handleEditClick={handleEditClick}
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
                    {loading ? (
                      <MessagesLoading />
                    ) : (
                      <>
                        {showReplies === comment?.id &&
                          comment?.reply?.length && (
                            <Form onSubmit={formik.handleSubmit}>
                              <Form.Group>
                                <Form.Control
                                  placeholder="Дотримуйтесь культури спілкування будь-ласка"
                                  name="commentText"
                                  as="textarea"
                                  value={formik.values.commentText}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  isInvalid={
                                    formik.touched.commentText &&
                                    !!formik.errors.commentText
                                  }
                                  rows={2}
                                />
                                {formik.touched.commentText &&
                                  formik.errors.commentText && (
                                    <Form.Control.Feedback type="invalid">
                                      {formik.errors.commentText}
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
        <Modal.Footer></Modal.Footer>
      </Modal>
      <DeleteMessageModal
        handleDeleteClick={handleDeleteClick}
        messageToDelete={messageToDelete}
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
      />
    </>
  );
};

CommentsModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
};

export default CommentsModal;
