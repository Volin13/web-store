import React, { forwardRef, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { fetchNovaPoshtaOffice } from '../../../../http/npAPI';
import CheckoutDropdown from '../CheckoutDropdown/CheckoutDropdown';
import _debounce from 'lodash/debounce';

const NPterminalFilter = forwardRef(function NPterminalFilter({ formik }, ref) {
  const [npData, setNpData] = useState([]);
  const [officeInput, setOfficeInput] = useState('');
  const [onShow, setOnShow] = useState(false);

  useEffect(() => {
    fetchNovaPoshtaOffice('').then(data => setNpData(data));
  }, []);
  const hendlePostDataChange = _debounce(async value => {
    const number = value.trim();
    if (number) {
      const data = await fetchNovaPoshtaOffice(formik.values.city, number);
      setNpData(data);
    } else {
      setNpData([]);
    }
  }, 300);
  const hendleInputChange = value => {
    if (!value) {
      setOfficeInput('');
    } else {
      setOfficeInput(value);
    }
  };
  return (
    <>
      <CheckoutDropdown
        list={npData}
        setInput={setOfficeInput}
        setOnShow={setOnShow}
        onShow={onShow}
        inputName="terminal"
        formik={formik}
      >
        <Form.Control
          ref={ref}
          type="text"
          name="terminal"
          value={officeInput}
          onChange={e => {
            const inputValue = e.target.value;
            hendleInputChange(inputValue);
            hendlePostDataChange(inputValue);

            formik.setFieldValue('terminal', inputValue);
          }}
          onBlur={formik.handleBlur}
          isInvalid={formik.touched.terminal && !!formik.errors.terminal}
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
