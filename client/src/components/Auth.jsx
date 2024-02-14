import React, { useCallback, useContext, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useFormik } from 'formik';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Image, InputGroup, Card, Form, Button } from 'react-bootstrap';
import {
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
  SHOP_ROUTE,
} from '../utils/constants';
import { checkUsedLogin, logIn, registration } from '../http/userAPI';
import { Context } from '../index';
import { toast } from 'react-toastify';
import _debounce from 'lodash/debounce';
import * as yup from 'yup';
import emailIcon from '../assets/authIcons/emailIcon.svg';
import loginIcon from '../assets/authIcons/login.svg';
import passwordIcon from '../assets/authIcons/passwordIcon.svg';
import { ReactComponent as VisibleIcon } from '../assets/authIcons/visible-svgrepo-com.svg';
import { ReactComponent as NotVisible } from '../assets/authIcons/not-visible-svgrepo-com.svg';

const Auth = observer(() => {
  const passwordInput = useRef(null);
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alreadyUsedName, setAlreadyUsedName] = useState(false);

  const { user } = useContext(Context);
  const location = useLocation();
  const isLogin = location.pathname === LOGIN_ROUTE;
  const navigate = useNavigate();

  const myEmailRegex =
    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

  const authSchema = yup.object().shape({
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
    login: yup
      .string()
      .matches(/^[a-zA-Zа-яА-ЯА-ЩЬьЮюЯяЇїІіЄєҐґ1-9']+$/, {
        message: 'Логін не має містити спец символи',
      })
      .trim()
      .max(25, 'Ваш логін занадто довгий')
      .lowercase()
      .notRequired()
      .nullable()
      .test('checkLogin', 'Такий логін вже існує', () => {
        return !alreadyUsedName;
      }),
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

  const formik = useFormik({
    initialValues: {
      email: '',
      login: '',
      password: '',
    },
    validationSchema: authSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const { email, password, login } = values;
      try {
        setSubmitting(true);
        setLoading(true);
        let userData;
        if (isLogin) {
          userData = await logIn(email, password);
          if (userData) {
            user.setUser(userData);
            user.setIsAuth(true);
            navigate(SHOP_ROUTE);
          }
        } else {
          userData = await registration(email, password, login);
          toast.info('Увійдіть у свій аккаунт');
          navigate(LOGIN_ROUTE);
        }
      } catch (e) {
        toast.error('Сталась помилка, спробуйте пізніше');
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });
  const isValid = authSchema.isValidSync(formik.values);

  const togglePasswordVisibility = () => {
    if (passwordInput.current.type === 'password') {
      passwordInput.current.type = 'text';
    } else {
      passwordInput.current.type = 'password';
    }
  };
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
          formik.setFieldError('login', '');
          return;
        }
        authSchema.validateSyncAt('login'); // Викликаємо валідацію
      });
    } catch (error) {
      formik.setFieldError('login', error.message); // Встановлюємо помилку
    }
  };
  const debounceFn = useCallback(_debounce(handleLoginChange, 300), []);

  return (
    <>
      <Card style={{ width: 600 }} className="p-5">
        <h2 className="m-auto">{isLogin ? 'Авторизація' : 'Реєстрація'}</h2>
        <Form
          className="d-flex flex-column"
          onSubmit={e => {
            e.preventDefault();
            formik.handleSubmit(e);
          }}
        >
          <InputGroup
            hasValidation
            className="mt-3"
            style={{ minHeight: '67px' }}
          >
            <InputGroup.Text style={{ height: '38px' }}>
              <Image width={18} height={18} src={emailIcon} />
            </InputGroup.Text>
            <Form.Control
              style={{ height: '38px' }}
              type="email"
              name="email"
              value={formik.values.email}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              isInvalid={formik.values.email && formik.errors.email}
              placeholder="Введіть ваш email"
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.email}
            </Form.Control.Feedback>
          </InputGroup>
          {!isLogin && (
            <InputGroup
              hasValidation
              className="mt-3"
              style={{ minHeight: '67px' }}
            >
              <InputGroup.Text style={{ height: '38px' }}>
                <Image width={18} height={18} src={loginIcon} />
              </InputGroup.Text>
              <Form.Control
                style={{ height: '38px' }}
                type="text"
                name="login"
                value={formik.values.login}
                onChange={e => {
                  formik.handleChange(e);
                  debounceFn(e.target.value);
                }}
                onBlur={formik.handleBlur}
                isInvalid={formik.errors.login}
                placeholder="Введіть ваш логін"
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.login}
              </Form.Control.Feedback>
            </InputGroup>
          )}

          <InputGroup
            hasValidation
            className="mt-1"
            style={{ minHeight: '67px' }}
          >
            <InputGroup.Text style={{ height: '38px' }}>
              <Image width={18} height={18} src={passwordIcon} />
            </InputGroup.Text>
            <Form.Control
              ref={passwordInput}
              style={{ height: '38px' }}
              type="password"
              name="password"
              value={formik.values.password}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              isInvalid={formik.values.password && formik.errors.password}
              placeholder="Введіть ваш пароль"
            />

            {formik.values.password && (
              <button
                type="button"
                className="d-flex align-items-center justify-content-center"
                style={{
                  height: '38px',
                  border: 'none',
                  marginLeft: '5px',
                  backgroundColor: 'transparent',
                }}
                onClick={() => {
                  togglePasswordVisibility();
                  setVisiblePassword(!visiblePassword);
                }}
              >
                {visiblePassword ? <VisibleIcon /> : <NotVisible />}
              </button>
            )}

            <Form.Control.Feedback type="invalid">
              {formik.errors.password}
            </Form.Control.Feedback>
          </InputGroup>

          <div
            className="d-flex flex-column-reverse flex-sm-row text-center text-sm-start  align-items-center justify-content-between  px-3"
            style={{ gap: '20px' }}
          >
            {isLogin ? (
              <div>
                Немає акаунта?{' '}
                <NavLink to={REGISTRATION_ROUTE}>Зареєструйся</NavLink>{' '}
              </div>
            ) : (
              <div>
                Є акаунт? <NavLink to={LOGIN_ROUTE}>Увійди</NavLink>{' '}
              </div>
            )}

            <Button
              variant={`outline-${
                !isValid || loading ? 'secondary' : 'success'
              }`}
              disabled={!isValid || loading}
              type="submit"
              style={{ minWidth: '30%' }}
            >
              {isLogin ? 'Увійти' : 'Реєстрація'}
            </Button>
          </div>
        </Form>
      </Card>
    </>
  );
});

export default Auth;
