import { useFormik } from 'formik';
import React, { useContext } from 'react';
import { Card, Form } from 'react-bootstrap';
import MessagesLoading from '../UI/UX/Spinner/MessagesLoading';
import PropTypes from 'prop-types';
import { Context } from '../..';

const FilterBar = ({ loading }) => {
  const { device } = useContext(Context);

  const formik = useFormik({
    initialValues: {
      filterByPrice: false,
      filterByRating: false,
    },
    // validationSchema: editDeviceSchema,
    onSubmit: values => {
      const { filterByPrice, filterByRating } = values;
      let filter1 = filterByPrice ? 'priceDesc' : '';
      let filter2 = filterByRating ? 'ratingDesc' : '';
      device.setDevicesOrder([filter1, filter2]);
    },
  });
  return (
    <>
      {loading ? (
        <div
          className="d-flex aling-items-center justify-content-center"
          style={{ minHeight: '115px' }}
        >
          <MessagesLoading />
        </div>
      ) : (
        <Card className="text-center" style={{ marginTop: '27px' }}>
          <Card.Title
            className="p-1"
            style={{ borderBottom: '1px solid #e6e9ec' }}
          >
            Сортувати
          </Card.Title>
          <Card.Body className="p-1">
            <Form
              onSubmit={formik.handleSubmit}
              className=" d-flex flex-column align-items-center flex-sm-row justify-content-sm-around d-md-block "
              style={{ textAlign: 'start' }}
            >
              <Form.Check
                label={`За ціною ${
                  formik.values.filterByPrice
                    ? String.fromCharCode(65514)
                    : String.fromCharCode(65516)
                }`}
                type="switch"
                name="filterByPrice"
                checked={formik.values.filterByPrice}
                value={formik.values.filterByPrice}
                onChange={() => {
                  formik.setFieldValue(
                    'filterByPrice',
                    !formik.values.filterByPrice
                  );
                  formik.handleSubmit();
                }}
              />
              <Form.Check
                label="За рейтингом"
                name="filterByRating"
                type="switch"
                checked={formik.values.filterByRating}
                value={formik.values.filterByRating}
                onChange={() => {
                  formik.setFieldValue(
                    'filterByRating',
                    !formik.values.filterByRating
                  );
                  formik.handleSubmit();
                }}
              />
            </Form>
          </Card.Body>
        </Card>
      )}
    </>
  );
};
FilterBar.propTypes = {
  loading: PropTypes.bool,
};
export default FilterBar;
