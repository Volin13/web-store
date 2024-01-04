import * as yup from 'yup';

export let commentSchema = yup.object().shape({
  comment: yup
    .string()
    .trim()
    .max(254, 'Максимальна довжина відповіді коментаря 254 символа')
    .lowercase(),
  reply: yup
    .string()
    .trim()
    .max(254, 'Максимальна довжина відповіді 254 символа'),
});
