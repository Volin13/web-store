import * as yup from 'yup';

const myEmailRegex =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

export const checkoutSchema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup
    .string()
    .matches(myEmailRegex, {
      message: 'Ваш імеіл має бути валідним',
      name: 'email',
      excludeEmptyString: true,
    })
    .min(5, 'Ваш імейл занадто короткий')
    .max(254, 'Ваш імейл занадто довгий')
    .lowercase()
    .required('Введіть ваш імеіл'),
  city: yup.string().required(),
  state: yup.string().required(),
  terminal: yup.string().required(),
  terms: yup.bool().required().oneOf([true], 'Terms must be accepted'),
});
