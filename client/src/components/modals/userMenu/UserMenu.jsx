import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Modal, Button, Form, InputGroup, Image } from 'react-bootstrap';
import css from './UserMenu.module.css';
import * as yup from 'yup';
import PropTypes from 'prop-types';
import passwordIcon from '../../../assets/defultIcons/edit-message.svg';
import plusIcon from '../../../assets/authIcons/userMenu/plus.svg';
import closeIcon from '../../../assets/authIcons/userMenu/close-circle-svgrepo-com.svg';
import { useFormik } from 'formik';
import { changeUserData, checkUsedLogin } from '../../../http/userAPI';
import _debounce from 'lodash/debounce';
import { observer } from 'mobx-react-lite';
import { Context } from '../../..';

const UserMenu = observer(({ show, onHide }) => {
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alreadyUsedName, setAlreadyUsedName] = useState(false);
  const { user } = useContext(Context);

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
      .matches(/^[a-zA-Zа-яА-ЯА-ЩЬьЮюЯяЇїІіЄєҐґ1-9'\s]+$/, {
        message: 'Логін не має містити спец символи',
      })
      .test('checkLogin', 'Такий логін вже існує', value => {
        if (value === user?.userLogin) {
          return true;
        }
        return !alreadyUsedName;
      })
      .min(3, 'Your name must be 1 character at least')
      .max(34, '34 characters max'),
  });

  const formik = useFormik({
    initialValues: {
      image: '',
      userName: user.login || '',
    },
    validationSchema: userDataSchema,

    onSubmit: (values, { setSubmitting }) => {
      const { image, userName } = values;
      changeUserData(user?.id, userName.trim(), image).then(data => {
        if (data) {
          user.setAvatar(data.avatar);
          user.setUserLogin(data.login);
        }
      });
      setLoading(false);
      setSubmitting(true);
    },
  });
  console.log(formik.values);
  console.log(user.login);

  useEffect(() => {
    formik.setFieldValue('userName', user.userLogin);
  }, []);

  useEffect(() => {
    if (user.userLogin !== formik.userName) {
      formik.setFieldValue('userName', user.userLogin);
    }
    if (user.avatar !== imageFile) {
      setImageFile(user.avatar);
    }
  }, [user.userLogin, user.avatar]);
  const isValid = userDataSchema.isValidSync(formik.values);
  const checkName = async name => {
    return await checkUsedLogin(name);
  };
  const debounceFn = useCallback(
    value => {
      const handleLoginChange = async value => {
        try {
          setLoading(true);
          await checkName(value).then(data => {
            setAlreadyUsedName(data);
            setLoading(false);
            if (!data) {
              formik.setFieldError('login', '');
              return;
            }
            userDataSchema.validateSyncAt('login');
          });
        } catch (error) {
          formik.setFieldError('login', error.message);
        }
      };
      _debounce(handleLoginChange, 300)(value);
    },
    [formik, setLoading, setAlreadyUsedName, userDataSchema]
  );

  const handleImageChange = e => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      formik.values.image = selectedFile;
      setImageFile(selectedFile);
    } else if (user.avatar) {
      setImageFile(user.avatar);
    } else {
      setImageFile('');
    }
  };
  const onClearImgClick = () => {
    if (user.avatar) {
      setImageFile(user.avatar);
    } else {
      setImageFile('');
    }
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={() => {
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
                  backgroundImage: imageFile ? `url(${user?.avatar})` : 'none',
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
                {imageFile instanceof File ? (
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
                      src={
                        imageFile instanceof File
                          ? URL.createObjectURL(imageFile)
                          : imageFile
                      }
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
              type="text"
              name="userName"
              value={formik.values.userName}
              onChange={e => {
                formik.handleChange(e);
                debounceFn(e.target.value);
              }}
              onBlur={formik.handleBlur}
              isInvalid={!!formik.errors.userName}
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
