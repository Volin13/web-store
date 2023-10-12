import * as yup from 'yup';

const myEmailRegex =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

export let authSchema = yup.object().shape({
  email: yup
    .string()
    .matches(myEmailRegex, {
      message: 'Your email must be valid',
      name: 'email',
      excludeEmptyString: true,
    })
    .min(5, 'Your email is too short')
    .max(254, 'Your email is too long')
    .lowercase()
    .required('Type your email please'),
  password: yup
    .string()
    .trim()
    .matches(
      /^[a-zA-Zа-яА-ЯА-ЩЬьЮюЯяЇїІіЄєҐґ0-9]+(([' -][a-zA-Zа-яА-Я0-9 ])?[a-zA-Zа-яА-Я0-9]*)*$/,
      'Special symbols are not allowed'
    )
    .min(6, 'Your password is too short')
    .max(16, 'Your password must be 16 characters max')
    .required('Type your password please'),
});
