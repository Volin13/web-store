import * as yup from 'yup';

const myEmailRegex =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

export let authSchema = yup.object().shape({
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
  password: yup
    .string()
    .trim()
    .matches(
      /^[a-zA-Zа-яА-ЯА-ЩЬьЮюЯяЇїІіЄєҐґ0-9]+(([' -][a-zA-Zа-яА-Я0-9 ])?[a-zA-Zа-яА-Я0-9]*)*$/,
      'Спеціальні символи не підходять'
    )
    .min(6, 'Ваш пароль занадто короткий')
    .max(254, 'Максимальна довжина паролю 254 символа')
    .required('Введіть ваш пароль'),
});
