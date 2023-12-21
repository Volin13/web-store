import { useFormik } from 'formik';
import React, { useState } from 'react';
import { Image, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import * as yup from 'yup';
import searchIcon from '../../../../assets/defultIcons/search-svgrepo-com.svg';
import css from './MainFilter.module.css';

const myEmailRegex =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

export let searchSchema = yup.object().shape({
  search: yup
    .string()
    .matches(myEmailRegex, {
      message: 'Ваш імеіл має бути валідним',
      name: 'email',
      excludeEmptyString: true,
    })
    .min(5, 'Запит короткий')
    .max(254, 'Запит занадто довгий')
    .lowercase()
    .required('Введіть ваш імеіл'),
});

const MainFilter = () => {
  const [isHovered, setIsHovered] = useState(false);

  const formik = useFormik({
    initialValues: {
      search: '',
    },
    validationSchema: searchSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setSubmitting(false);
      resetForm(false);
    },
  });

  console.log(isHovered);
  return (
    <div className="d-flex justify-content-end">
      <InputGroup
        hasValidation
        className={css.searchInput}
        style={{
          width: isHovered ? '' : '45px',
        }}
      >
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip id="tooltip-bottom">Знайти</Tooltip>}
        >
          <button type="button" className="d-flex align-items-center">
            <InputGroup.Text
              className={css.searchLable}
              style={{
                borderRadius: isHovered ? 'initial' : ' 50px',
                padding: '12px',
              }}
              onMouseEnter={() => {
                setIsHovered(true);
              }}
            >
              <Image width={18} height={18} src={searchIcon} />
            </InputGroup.Text>
          </button>
        </OverlayTrigger>

        <Form.Control
          className={css.searchInput}
          style={{
            flex: isHovered ? '1 1 auto' : ' unset',
            opacity: isHovered ? '1' : '0',
            width: isHovered ? '' : '0px',
            padding: isHovered ? '' : '0px',
          }}
          type="text"
          name="search"
          value={formik.values.search}
          onBlur={() => {
            setIsHovered(false);
          }}
          onChange={formik.handleChange}
          isInvalid={formik.values.search && formik.errors.search}
          placeholder="Пошук по девайсам"
        />
      </InputGroup>
    </div>
  );
};

export default MainFilter;
