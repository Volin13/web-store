import React from 'react';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Context } from '../../../index';
import { Pagination } from 'react-bootstrap';

const Pages = observer(() => {
  const { device } = useContext(Context);
  const pageCount = Math.ceil(device?.totalCount / device?.limit);

  const pages = [];
  for (let i = 0; i < pageCount; i++) {
    pages.push(i + 1);
  }
  return (
    <>
      {pages.length > 1 && (
        <Pagination
          className="mt-3 justify-content-center"
          style={{ paddingBottom: '30px' }}
        >
          {pages.map(page => (
            <Pagination.Item
              active={device?.page === page}
              key={page}
              onClick={() => device?.setPage(page)}
            >
              {page}
            </Pagination.Item>
          ))}
        </Pagination>
      )}
    </>
  );
});

export default Pages;
