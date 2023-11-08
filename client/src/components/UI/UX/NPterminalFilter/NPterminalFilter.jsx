import React, { forwardRef, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { fetchNovaPoshtaData } from '../../../../http/npAPI';
import CheckoutDropdown from '../CheckoutDropdown/CheckoutDropdown';

const NPterminalFilter = forwardRef(function NPterminalFilter({ formik }, ref) {
  const [npData, setNpData] = useState([]);
  const [officeInput, setOfficeInput] = useState('№');
  // useEffect(() => {
  //   fetchNovaPoshtaData('київ').then(data => setNpData(data));
  // }, []);
  const hendlePostDataChange = async value => {
    if (value.trim()) {
      console.log(value);
      const number = officeInput
        .split('')
        .slice(1, officeInput.length)
        .join('');
      console.log(number);
      const data = await fetchNovaPoshtaData(formik.values.city, number);
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
  // console.log(npData);

  return (
    <CheckoutDropdown
      list={npData}
      setOfficeInput={setOfficeInput}
      formik={formik}
    >
      <Form.Control
        type="text"
        name="terminal"
        value={officeInput}
        onChange={e => {
          const inputValue = e.target.value;
          hendleInputChange(inputValue);

          hendlePostDataChange(officeInput);
          formik.setFieldValue('terminal', inputValue);
        }}
        onBlur={e => {
          hendleInputChange(e.target.value);
        }}
        isInvalid={formik.touched.terminal && !formik.errors.terminal}
      />
    </CheckoutDropdown>
  );
});

export default NPterminalFilter;
