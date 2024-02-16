import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Button, Form, InputGroup, Image } from 'react-bootstrap';
import css from './UserMenu.module.css';
import * as yup from 'yup';
import PropTypes from 'prop-types';
import passwordIcon from '../../../assets/defultIcons/edit-message.svg';
import plusIcon from '../../../assets/authIcons/userMenu/plus.svg';
// import erorrIcon from '../../../assets/authIcons/userMenu/error-16-svgrepo-com.svg';
import closeIcon from '../../../assets/authIcons/userMenu/close-circle-svgrepo-com.svg';
import { useFormik } from 'formik';
import { changeUserData, checkUsedLogin } from '../../../http/userAPI';
import _debounce from 'lodash/debounce';
import { observer } from 'mobx-react-lite';

const UserMenu = observer(({ show, onHide, user }) => {
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alreadyUsedName, setAlreadyUsedName] = useState(false);

  let userDataSchema = yup.object().shape({
    image: yup
      .mixed()
      .nullable()
      .test('type', 'Невірний формат зображення', value => {
        return (
          !value || (value && ['image/jpeg', 'image/png'].includes(value.type))
        );
      })
      .test('size', 'Розмір зображення має бути меншу 2mb', value => {
        return !value || (value && value.size <= 2000000);
      }),
    userName: yup
      .string()
      .trim()
      .matches(/^[a-zA-Zа-яА-ЯА-ЩЬьЮюЯяЇїІіЄєҐґ1-9']+$/, {
        message: 'Логін не має містити спец символи',
      })
      .test('checkLogin', 'Такий логін вже існує', value => {
        if (value === user?.userLogin) {
          return true;
        }
        return !alreadyUsedName;
      })
      .min(3, 'Your name must be 1 character at least')
      .max(16, '16 characters max'),
  });

  const formik = useFormik({
    initialValues: {
      image: null,
      userName: '',
    },
    validationSchema: userDataSchema,

    onSubmit: (values, { setSubmitting }) => {
      const { image, userName } = values;
      changeUserData(user?.id, userName.trim(), image).then(data => {
        user.setAvatar(data?.avatar);
        user.setUserLogin(data?.login);
      });
      setLoading(false);
      setSubmitting(true);
    },
  });

  useEffect(() => {
    if (user.userLogin) {
      formik.setFieldValue('userName', user.userLogin);
    }
  }, [user.userLogin]);
  const isValid = userDataSchema.isValidSync(formik.values);
  const checkName = async name => {
    return await checkUsedLogin(name);
  };
  const handleLoginChange = async value => {
    try {
      setLoading(true);
      await checkName(value).then(data => {
        setAlreadyUsedName(data);
        setLoading(false);
        if (!data) {
          formik.setFieldError('userName', '');
          return;
        }
        userDataSchema.validateSyncAt('userName'); // Викликаємо валідацію
      });
    } catch (error) {
      formik.setFieldError('userName', error.message); // Встановлюємо помилку
    }
  };
  const debounceFn = useCallback(_debounce(handleLoginChange, 300), [
    formik.userName,
  ]);

  const handleImageChange = e => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      formik.values.image = selectedFile;
      setImageFile(selectedFile);
    } else {
      setImageFile('');
    }
  };
  const onClearImgClick = () => {
    setImageFile('');
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={() => {
        formik.resetForm();
        onHide();
      }}
      centered
    >
      <Modal.Header closeButton>Профіль</Modal.Header>
      <Modal.Body className="text-center pb-3">
        <Form noValidate onSubmit={formik.handleSubmit}>
          <div className={css.avatarChanger}>
            <label htmlFor="newAvatartURL" className={css.avatarChangerLebel}>
              <div
                style={{
                  backgroundImage: imageFile
                    ? 'none'
                    : `url(${process.env.REACT_APP_API_URL + user?.avatar})`,
                }}
                className={css.avatarPrevew}
              >
                <input
                  type="file"
                  name="newAvatartURL"
                  onChange={e => {
                    handleImageChange(e);
                    formik.handleChange(e);
                  }}
                  className={css.inputTypeFile}
                  id="newAvatartURL"
                  accept="image/*"
                />
                {imageFile ? (
                  <button
                    type="button"
                    onClick={onClearImgClick}
                    className={css.btnIcon}
                  >
                    <Image height={40} width={40} src={closeIcon} />
                  </button>
                ) : (
                  <Image
                    height={40}
                    width={40}
                    src={plusIcon}
                    className={css.btnIcon}
                  />
                )}

                {formik.errors.image ? (
                  <span className={css.fileWarning}>{formik.errors.image}</span>
                ) : (
                  <span className={css.fileWarning}> </span>
                )}
                {imageFile && (
                  <div className={css.userAvatar}>
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="selected"
                      className={css.defaultImg}
                    />
                  </div>
                )}
              </div>
            </label>
          </div>
          <InputGroup
            hasValidation
            className="mt-4"
            style={{ minHeight: '67px', maxWidth: '80%', margin: '0 auto' }}
          >
            <InputGroup.Text style={{ height: '38px' }}>
              <Image width={18} height={18} src={passwordIcon} />
            </InputGroup.Text>
            <Form.Control
              style={{ height: '38px' }}
              type="userName"
              name="userName"
              value={formik.values.userName}
              onChange={e => {
                formik.handleChange(e);
                debounceFn(e.target.value);
              }}
              onBlur={formik.handleBlur}
              isInvalid={formik.values.userName && formik.errors.userName}
              placeholder="Введіть ваш логін"
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.userName}
            </Form.Control.Feedback>
          </InputGroup>
          <Button
            variant={`outline-${!isValid || loading ? 'secondary' : 'success'}`}
            disabled={!isValid || loading}
            type="submit"
            style={{ minWidth: '30%' }}
          >
            Змінити
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
});
UserMenu.propTypes = {
  user: PropTypes.object,
  show: PropTypes.bool,
  onHide: PropTypes.func,
};
export default UserMenu;
