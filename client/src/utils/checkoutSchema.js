import * as yup from 'yup';

const myEmailRegex =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
const ukrainianRegex = /^[а-щА-ЩЬьЮюЯяЇїІіЄєҐґЁё\d\s'’-]+$/;
const phoneRegex = /^\+?[\d-]{9,15}$/;

export const checkoutSchema = yup.object().shape({
  firstName: yup
    .string()
    .matches(ukrainianRegex, {
      message: 'Введіть ім&#39;я українською, без спец символів',
      excludeEmptyString: true,
    })
    .max(50, 'Максимальна довжина імені 50 символів')
    .required('Введіть своє ім&#39;я'),
  lastName: yup
    .string()
    .matches(ukrainianRegex, {
      message: 'Введіть прізвище українською, без спец символів',
      excludeEmptyString: true,
    })
    .max(80, 'Максимальна довжина прізвища 80 символів')
    .required('Введіть своє прізвище'),
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
  region: yup
    .string()
    .matches(ukrainianRegex, {
      message: 'Введіть назву українською, без спец символів',
      excludeEmptyString: true,
    })
    .max(100, 'Максимальна довжина назви регіону 100 символів')
    .required('Оберіть область з випадаючого списку'),
  city: yup
    .string()
    .matches(ukrainianRegex, {
      message: 'Введіть назву українською, без спец символів',
      excludeEmptyString: true,
    })
    .max(100, 'Максимальна довжина назви міста 100 символів')

    .required('Оберіть місто з випадаючого списку'),
  phone: yup
    .string()
    .min(10, 'Ваш номер телефону занадто короткий')
    .max(13, 'Максимальна довжина номеру телефону 13 символів')
    .matches(phoneRegex, {
      message: 'Номер не має включати спец. символи та літери',
      excludeEmptyString: true,
    })
    .test('startsWith+380', 'Номер телефону має починатися з +380', value => {
      return value && value.startsWith('+380');
    })
    .required('Введіть ваш номер телефону'),
  terminal: yup
    .string()
    .max(250, 'Максимальна довжина назви міста 250 символів')
    .required('Оберіть термінал з випадаючого списку'),
});
