import React, { forwardRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import { fetchNovaPoshtaCities } from '../../../../http/npAPI';
import CheckoutDropdown from '../CheckoutDropdown/CheckoutDropdown';
import _debounce from 'lodash/debounce';

const NPcityFilter = forwardRef(function NPcityFilter({ formik }, ref) {
  const [npData, setNpData] = useState([]);
  const [cityInput, setCityInput] = useState('');
  const [onShow, setOnShow] = useState(false);

  const hendlePostDataChange = _debounce(async value => {
    const city = value.trim();
    if (city) {
      const data = await fetchNovaPoshtaCities(city);
      setNpData(data);
    } else {
      setNpData([]);
    }
  }, 300);
  const hendleInputChange = value => {
    if (!value.trim()) {
      setCityInput('');
    } else {
      setCityInput(value);
    }
  };

  return (
    <>
      <CheckoutDropdown
        value={cityInput}
        list={npData}
        setInput={setCityInput}
        setOnShow={setOnShow}
        onShow={onShow}
        inputName="city"
        formik={formik}
      >
        <Form.Control
          ref={ref}
          type="text"
          name="city"
          value={cityInput}
          onChange={e => {
            const inputValue = e.target.value;
            hendleInputChange(inputValue);
            hendlePostDataChange(inputValue);
            setOnShow(true);
            formik.setFieldValue('city', inputValue);
          }}
          onBlur={formik.handleBlur}
          isInvalid={formik.touched.city && !!formik.errors.city}
        />
      </CheckoutDropdown>
      {formik.touched.city && formik.errors.city && (
        <Form.Control.Feedback className="d-block" type="invalid">
          {formik.errors.city}
        </Form.Control.Feedback>
      )}
    </>
  );
});

export default NPcityFilter;
