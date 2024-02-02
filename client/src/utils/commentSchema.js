import * as yup from 'yup';

export let commentSchema = yup.object().shape({
  comment: yup
    .string()
    .trim()
    .test('word-length', 'Слова(о) у вашому відгуці занадто довгі', value => {
      if (value) {
        const words = value.split(' ');
        const wordLength = 31;
        return words.every(word => word.length <= wordLength);
      }
      return true;
    })
    .min(2, 'Ваш коментар занадто короткий')
    .max(254, 'Максимальна довжина відповіді коментаря 254 символа'),
  reply: yup
    .string()
    .trim()
    .test('word-length', 'Слова(о) у вашому відгуці занадто довгі', value => {
      if (value) {
        const words = value.split(' ');
        const wordLength = 31;
        return words.every(word => word.length <= wordLength);
      }
      return true;
    })
    .min(2, 'Ваш коментар занадто короткий')
    .max(254, 'Максимальна довжина відповіді 254 символа'),
});
