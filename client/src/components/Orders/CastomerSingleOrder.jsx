import React from 'react';
import PropTypes from 'prop-types';
import css from './Orders.module.css';
import { Card, Col } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { DEVICE_ROUTE } from '../../utils/constants';

const CastomerSingleOrder = ({ list, visible, index }) => {
  return (
    <>
      {index == visible && (
        <Card className="mx-auto my-3">
          <Card.Body>
            <ul className={css.orderDataList}>
              {list.map(item => (
                <li key={item.id} className="d-flex justify-content-between">
                  <Col
                    md="3"
                    className={css.orderData}
                    style={{ minWidth: '150px' }}
                  >
                    <NavLink to={DEVICE_ROUTE + '/' + item.id}>
                      <Card.Img
                        className={css.orderDataImg}
                        height="130px"
                        variant="top"
                        src={item.mainImg}
                      />
                    </NavLink>
                  </Col>
                  <Col
                    md="7"
                    className={css.orderData}
                    style={{ minWidth: '150px' }}
                  >
                    {item.title}{' '}
                  </Col>

                  <Col
                    md="2"
                    className={css.orderData}
                    style={{ minWidth: '150px' }}
                  >
                    <div>{item.count} шт.</div>
                    <div>{item.price} грн.</div>
                  </Col>
                </li>
              ))}
            </ul>
          </Card.Body>
        </Card>
      )}
    </>
  );
};

CastomerSingleOrder.propTypes = {
  visible: PropTypes.number,
  index: PropTypes.number,
  list: PropTypes.array,
};

export default CastomerSingleOrder;
