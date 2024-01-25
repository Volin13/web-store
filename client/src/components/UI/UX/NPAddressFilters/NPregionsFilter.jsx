import React, { forwardRef, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import updateDataOnceAMonth from '../../../../utils/updateDataOnceAMonth ';
import CheckoutDropdown from '../CheckoutDropdown/CheckoutDropdown';
import PropTypes from 'prop-types';

const NPregionsFilter = forwardRef(function NPregionsFilter({ formik }, ref) {
  const [npData, setNpData] = useState([]);
  const [regionInput, setRegionInput] = useState('');
  const [onShow, setOnShow] = useState(false);

  // При першому завантаженюю сторінки виконується перевірка
  // на оновлення списку міст НП, який зберігається в локал стореджі

  useEffect(() => {
    const fetchData = async () => {
      const storageList = await updateDataOnceAMonth();
      return setNpData(storageList);
    };
    fetchData();
  }, []);

  const hendleInputChange = value => {
    if (!value.trim()) {
      setRegionInput('');
    } else {
      setRegionInput(value.trim());
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
          onInput={e => {
            const inputValue = e.target.value;
            hendleInputChange(inputValue);
            formik.setFieldValue('region', inputValue);
          }}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isInvalid={formik.touched.region && !!formik.errors.region}
        />
      </CheckoutDropdown>
      {formik.touched.region && formik.errors.region && (
        <Form.Control.Feedback className="d-block" type="invalid">
          {formik.errors.region}
        </Form.Control.Feedback>
      )}
    </>
  );
});
NPregionsFilter.propTypes = {
  formik: PropTypes.object.isRequired,
};
export default NPregionsFilter;
