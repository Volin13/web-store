import * as yup from 'yup';

export let editDeviceSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .min(3, 'Назва девайсу занадто коротка')
    .max(80, 'Назва девайсу занадто довга')
    .lowercase()
    .required('Введіть назву девайсу'),
  price: yup
    .number('Ціна повинна бути числом')
    .positive('Ціна повинна бути додатнім числом')
    .integer('Ціна повинна бути цілим числом')
    .required('Введіть ціну'),
  newPrice: yup
    .number('Ціна повинна бути числом')
    .positive('Ціна повинна бути додатнім числом')
    .integer('Ціна повинна бути цілим числом'),
  mainImg: yup
    .mixed()
    .test('type', 'Only image files are allowed', value => {
      return (
        !value || (value && ['image/jpeg', 'image/png'].includes(value.type))
      );
    })
    .test('size', 'Розмір зображення має бути менше 5 MB', value => {
      return !value || (value && value.size <= 5000000);
    })
    .required('Додайте зображення'),
  rating: yup
    .number('Рейтинг повинна бути числом')
    .min(1, 'Мінімальний рейтинг 1')
    .max(10, 'Максимальний рейтинг 10')
    .required('Введіть рейтинг'),
});
