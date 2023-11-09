import React, { forwardRef, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { fetchNovaPoshtaCities } from '../../../../http/npAPI';
import CheckoutDropdown from '../CheckoutDropdown/CheckoutDropdown';

const NPcityFilter = forwardRef(function NPcityFilter({ formik }, ref) {
  const [npData, setNpData] = useState([]);
  const [cityInput, setCityInput] = useState('');
  useEffect(() => {
    fetchNovaPoshtaCities('').then(data => setNpData(data));
  }, []);
  const hendlePostDataChange = async value => {
    if (value.trim()) {
      const data = await fetchNovaPoshtaCities(formik.values.regionRef, value);
      setNpData(data);
    } else {
      setNpData([]);
    }
  };
  const hendleInputChange = value => {
    if (!value.trim()) {
      setCityInput('');
    } else {
      setCityInput(value);
    }
  };

  return (
    <>
      <CheckoutDropdown list={npData} setInput={setCityInput} formik={formik}>
        <Form.Control
          type="text"
          name="city"
          value={cityInput}
          onChange={e => {
            const inputValue = e.target.value;
            hendleInputChange(inputValue);
            hendlePostDataChange(inputValue);

            formik.setFieldValue('terminal', inputValue);
          }}
          onBlur={e => {
            hendleInputChange(e.target.value);
          }}
          isInvalid={formik.touched.terminal && !formik.errors.terminal}
        />
      </CheckoutDropdown>
      {formik.touched.city && formik.errors.city && (
        <Form.Control.Feedback type="invalid">
          {formik.errors.city}
        </Form.Control.Feedback>
      )}
    </>
  );
});

export default NPcityFilter;
