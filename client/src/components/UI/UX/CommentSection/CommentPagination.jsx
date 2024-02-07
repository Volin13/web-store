import React from 'react';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Pagination } from 'react-bootstrap';
import { Context } from '../../../..';

const CommentPagination = observer(() => {
  const { device } = useContext(Context);
  const pageCount = Math.ceil(device.totalCommentCount / device.commentsLimit);

  const pages = [];
  for (let i = 0; i < pageCount.length; i++) {
    pages.push(i + 1);
  }
  return (
    <Pagination className="mt-5">
      {pages.map(page => (
        <Pagination.Item
          active={device.commentPage === page}
          key={page}
          onClick={() => device.setCommentPage(page)}
        >
          {page}
        </Pagination.Item>
      ))}
    </Pagination>
  );
});

export default CommentPagination;
