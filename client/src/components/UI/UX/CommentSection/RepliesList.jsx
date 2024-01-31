import React from 'react';
import { Card, Image, OverlayTrigger, Tooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';
import editImg from '../../../../assets/defultIcons/edit-message.svg';
import deleteImg from '../../../../assets/defultIcons/delete-message.svg';
import css from './CommentSection.module.css';

const RepliesList = ({
  repliesList,
  handleEditClick,
  handleDeleteClick,
  userId,
}) => {
  return (
    <ul className="p-1">
      {repliesList.map(item => (
        <Card as="li" key={item?.id} className="mb-2">
          <Card.Body className="d-flex justify-content-between align-items-start overflow-auto">
            <div
              className="d-flex flex-column align-items-center"
              style={{ marginRight: '10px' }}
            >
              <Image width={40} height={40} src={item?.avatar} />
              <span>{item?.login}</span>
            </div>
            <p className="flex-grow-1 p-1">{item?.text}</p>
            <OverlayTrigger
              placement="bottom"
              delay={{ show: 250, hide: 400 }}
              overlay={<Tooltip>Змінити</Tooltip>}
            >
              <button
                style={{
                  marginRight: '15px',
                  display: userId === item?.userId ? 'block' : 'none',
                }}
                className={`${css.messageBtn}`}
                type="button"
                onClick={() => {
                  handleEditClick('reply', item?.text);
                }}
              >
                <Image width={18} height={18} src={editImg} />
              </button>
            </OverlayTrigger>
            <OverlayTrigger
              placement="bottom"
              delay={{ show: 250, hide: 400 }}
              overlay={<Tooltip>Видалити</Tooltip>}
            >
              <button
                style={{
                  display: userId === item?.userId ? 'block' : 'none',
                }}
                className={`${css.messageBtn}`}
                type="button"
                onClick={() => handleDeleteClick('reply', item.id)}
              >
                <Image width={18} height={18} src={deleteImg} />
              </button>
            </OverlayTrigger>
          </Card.Body>
          <Card.Footer className="text-end">
            {new Date(item?.updatedAt).toLocaleString()}
          </Card.Footer>
        </Card>
      ))}
    </ul>
  );
};

RepliesList.propTypes = {
  repliesList: PropTypes.array.isRequired,
  userId: PropTypes.number.isRequired,
  handleEditClick: PropTypes.func.isRequired,
  handleDeleteClick: PropTypes.func.isRequired,
};
export default RepliesList;
