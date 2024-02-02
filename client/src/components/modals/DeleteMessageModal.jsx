import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';

const DeleteMessageModal = ({
  show,
  onHide,
  messageToDelete,
  handleDeleteClick,
}) => {
  return (
    <Modal size="sm" show={show} onHide={onHide} centered>
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body className="text-center">
        <h4 className="mb-3"> Видалити коментар?</h4>
        <div className="d-flex justify-content-around align-items-center">
          <Button
            onClick={() => {
              handleDeleteClick(messageToDelete);
            }}
            className="p-2"
            variant="outline-primary"
          >
            Видалити
          </Button>
          <Button onClick={onHide} className="p-2" variant="outline-danger">
            Відміна
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

DeleteMessageModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  messageToDelete: PropTypes.object,
  handleDeleteClick: PropTypes.func,
};

export default DeleteMessageModal;
