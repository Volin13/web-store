import React from 'react';
import { observer } from 'mobx-react-lite';
import { Pagination } from 'react-bootstrap';

const CommentPagination = observer(({ state }) => {
  const pageCount = Math.ceil(state?.totalCommentCount / state?.commentsLimit);

  const pages = [];
  for (let i = 0; i < pageCount; i++) {
    pages.push(i + 1);
  }
  return (
    <>
      {pages.length > 1 && (
        <Pagination className="mt-1 justify-content-center text-center">
          {pages.map(page => (
            <Pagination.Item
              active={state?.commentPage === page}
              key={page}
              onClick={() => state?.setCommentPage(page)}
            >
              {page}
            </Pagination.Item>
          ))}
        </Pagination>
      )}
    </>
  );
});

export default CommentPagination;
