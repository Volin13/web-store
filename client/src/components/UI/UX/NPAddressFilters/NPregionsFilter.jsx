import React, { forwardRef, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { fetchNovaPoshtaRegions } from '../../../../http/npAPI';
import updateDataOnceAMonth from '../../../../utils/updateDataOnceAMonth ';
import CheckoutDropdown from '../CheckoutDropdown/CheckoutDropdown';

const NPregionsFilter = forwardRef(function NPregionsFilter({ formik }, ref) {
  const [npData, setNpData] = useState([]);
  const [regionInput, setRegionInput] = useState('');
  const [onShow, setOnShow] = useState(false);

  useEffect(() => {
    const storageList = updateDataOnceAMonth();
    setNpData(storageList);
    // fetchNovaPoshtaRegions('').then(data => setNpData(data));
  }, []);

  const hendleInputChange = value => {
    if (!value.trim()) {
      setRegionInput('');
    } else {
      setRegionInput(`${value} обл.`);
    }
  };

  return (
    <>
      <CheckoutDropdown
        list={npData}
        setInput={setRegionInput}
        setOnShow={setOnShow}
        onShow={onShow}
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
          isInvalid={formik.touched.region && !formik.errors.region}
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
