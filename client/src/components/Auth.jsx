import React, { useContext, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useFormik } from 'formik';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Image, InputGroup, Row, Card, Form, Button } from 'react-bootstrap';
import {
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
  SHOP_ROUTE,
} from '../utils/constants';
import { login, registration } from '../http/userAPI';
import { Context } from '../index';
import { authSchema } from '../utils/authSchema';
import { toast } from 'react-toastify';

import emailIcon from '../assets/authIcons/emailIcon.svg';
import passwordIcon from '../assets/authIcons/passwordIcon.svg';
import { ReactComponent as VisibleIcon } from '../assets/authIcons/visible-svgrepo-com.svg';
import { ReactComponent as NotVisible } from '../assets/authIcons/not-visible-svgrepo-com.svg';

const Auth = observer(() => {
  const passwordInput = useRef(null);
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user } = useContext(Context);
  const location = useLocation();
  const isLogin = location.pathname === LOGIN_ROUTE;
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: authSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const { email, password } = values;
      try {
        setSubmitting(true);
        setLoading(true);
        let userData;
        if (isLogin) {
          userData = await login(email, password);
          if (userData) {
            console.log('poof');
            user.setUser(userData);
            user.setIsAuth(true);
            navigate(SHOP_ROUTE);
          }
        } else {
          userData = await registration(email, password);
          if (userData) {
            toast.info('Увійдіть у свій аккаунт');
            navigate(LOGIN_ROUTE);
          }
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

  return (
    <>
      <Card style={{ width: 600 }} className="p-5">
        <h2 className="m-auto">{isLogin ? 'Авторизація' : 'Регістрація'}</h2>
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

          <Row className="d-flex align-items-center justify-content-between  px-3">
            {isLogin ? (
              <div style={{ display: 'inline', width: '70%' }}>
                Немає акаунта?{' '}
                <NavLink to={REGISTRATION_ROUTE}>Зареєструйся</NavLink>{' '}
              </div>
            ) : (
              <div style={{ display: 'inline', width: '70%' }}>
                Є акаунт? <NavLink to={LOGIN_ROUTE}>Увійди</NavLink>{' '}
              </div>
            )}
            <Button
              variant={'outline-success'}
              disabled={!isValid || loading}
              type="submit"
              className="ml-auto"
              style={{ maxWidth: '30%' }}
            >
              {isLogin ? 'Увійти' : 'Регістрація'}
            </Button>
          </Row>
        </Form>
      </Card>
    </>
  );
});

export default Auth;
