import React, { forwardRef, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { fetchNovaPoshtaOffice } from '../../../../http/npAPI';
import CheckoutDropdown from '../CheckoutDropdown/CheckoutDropdown';

const NPterminalFilter = forwardRef(function NPterminalFilter({ formik }, ref) {
  const [npData, setNpData] = useState([]);
  const [officeInput, setOfficeInput] = useState('№');
  useEffect(() => {
    fetchNovaPoshtaOffice('').then(data => setNpData(data));
  }, []);
  const hendlePostDataChange = async value => {
    if (value.trim()) {
      const number = value.substring(1);
      const data = await fetchNovaPoshtaOffice(formik.values.city, number);
      setNpData(data);
    } else {
      setNpData([]);
    }
  };
  const hendleInputChange = value => {
    if (!officeInput) {
      setOfficeInput('№');
    } else {
      setOfficeInput(value);
    }
  };

  return (
    <>
      <CheckoutDropdown list={npData} setInput={setOfficeInput} formik={formik}>
        <Form.Control
          type="text"
          name="terminal"
          value={officeInput}
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
      {formik.touched.terminal && formik.errors.terminal && (
        <Form.Control.Feedback type="invalid">
          {formik.errors.terminal}
        </Form.Control.Feedback>
      )}
    </>
  );
});

export default NPterminalFilter;
