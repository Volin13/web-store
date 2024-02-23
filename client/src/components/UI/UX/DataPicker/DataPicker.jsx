import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';

const DataPicker = observer(({ user }) => {
  const handleDateChange = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    user.setCommentDate(formattedDate);
  };

  return (
    <div
      style={{ gap: '30px' }}
      className="d-flex flex-column flex-sm-row align-items-center justify-content-center pt-3"
    >
      <h4>Виберіть дату</h4>
      <DatePicker
        selected={user.commentDate}
        onChange={handleDateChange}
        dateFormat="yyyy-MM-dd"
        placeholderText=" "
      />
    </div>
  );
});
DataPicker.propTypes = {
  user: PropTypes.object,
};
export default DataPicker;
