import React, { forwardRef, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import updateDataOnceAMonth from '../../../../utils/updateDataOnceAMonth ';
import CheckoutDropdown from '../CheckoutDropdown/CheckoutDropdown';

const NPregionsFilter = forwardRef(function NPregionsFilter({ formik }, ref) {
  const [npData, setNpData] = useState([]);
  const [regionInput, setRegionInput] = useState('');
  const [onShow, setOnShow] = useState(false);

  useEffect(() => {
    const storageList = updateDataOnceAMonth();
    setNpData(storageList);
  }, []);

  const hendleInputChange = value => {
    if (!value.trim()) {
      setRegionInput('');
    } else {
      setRegionInput(`${value}`);
    }
  };
  return (
    <>
      <CheckoutDropdown
        value={regionInput}
        list={npData}
        setInput={setRegionInput}
        setOnShow={setOnShow}
        onShow={onShow}
        inputName="region"
        formik={formik}
      >
        <Form.Control
          ref={ref}
          type="text"
          name="region"
          value={regionInput}
          onChange={e => {
            const inputValue = e.target.value;
            hendleInputChange(inputValue);
            formik.setFieldValue('region', inputValue);
          }}
          onBlur={formik.handleBlur}
          isInvalid={formik.touched.region && !!formik.errors.region}
        />
      </CheckoutDropdown>
      {formik.touched.region && formik.errors.region && (
        <Form.Control.Feedback type="invalid">
          {formik.errors.region}
        </Form.Control.Feedback>
      )}
    </>
  );
});

export default NPregionsFilter;
