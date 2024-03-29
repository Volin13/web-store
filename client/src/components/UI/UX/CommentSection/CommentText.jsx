import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import css from './CommentSection.module.css';

const CommentText = ({ text = '' }) => {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    const formatText = () => {
      if (textRef.current) {
        const { scrollHeight, clientHeight } = textRef.current;
        setIsOverflowing(scrollHeight > clientHeight);
      }
    };
    formatText();
  }, [text]);

  return (
    <>
      <p
        className={css.commentText}
        ref={textRef}
        style={{
          width: '100%',
          maxHeight: expanded ? 'none' : '5em',
          overflowY: expanded ? 'unset' : 'hidden',
        }}
        dangerouslySetInnerHTML={{ __html: text }}
      />

      {isOverflowing && !expanded && (
        <div className="text-end mt-2">
          <button
            style={{ color: '#0c6efc' }}
            onClick={() => setExpanded(!expanded)}
          >
            Розгорнути
          </button>
        </div>
      )}
    </>
  );
};

CommentText.propTypes = {
  text: PropTypes.string,
  type: PropTypes.string,
};

export default CommentText;
