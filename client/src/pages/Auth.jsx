import React, { useContext } from 'react';
import Card from 'react-bootstrap/Card';
import { observer } from 'mobx-react-lite';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import * as yup from 'yup';
import { useFormik } from 'formik';
import {
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
  SHOP_ROUTE,
} from '../utils/constants';
import { Row } from 'react-bootstrap';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { login, registration } from '../http/userAPI';
import { Context } from '..';
let initialValues = {
  email: '',
  password: '',
};
const Auth = observer(() => {
  const { user } = useContext(Context);
  const location = useLocation();
  const isLogin = location.pathname === LOGIN_ROUTE;
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const click = async () => {
    try {
      let userData;
      if (isLogin) {
        userData = await login(formik.email, formik.password);
      } else {
        userData = await registration(formik.email, formik.password);
      }
      user.setUser(userData);
      user.setIsAuth(true);
      navigate(SHOP_ROUTE);
    } catch (e) {
      alert(e.response?.data?.message) ||
        console.error('An error occurred:', e);
    }
  };

  const myEmailRegex =
    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
  let registrationSchema = yup.object().shape({
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

  const formik = useFormik({
    initialValues,
    validationSchema: registrationSchema,

    onSubmit: (values, { setSubmitting, resetForm }) => {
      click();
      setSubmitting(false);
    },
  });

  return (
    <Container
      className="d-flex justify-content-center
  align-items-center"
      style={{ height: window.innerHeight - 54 }}
    >
      <Card style={{ width: 600 }} className="p-5">
        <h2 className="m-auto">{isLogin ? 'Авторизація' : 'Регістрація'}</h2>
        <Form className="d-flex flex-column">
          <Form.Control
            className="mt-3"
            type="email"
            placeholder="Введіть ваш email"
            erorr={formik.errors.email}
            value={formik.values.email}
            onChange={formik.handleChange}
          />
          <Form.Control
            className="mt-3"
            type="password"
            placeholder="Введіть ваш пароль"
            erorr={formik.errors.password}
            value={formik.values.password}
            onChange={formik.handleChange}
          />
          <Row className="d-flex align-items-center justify-content-between mt-3 px-3">
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
              type="button"
              className="ml-auto"
              style={{ maxWidth: '30%' }}
              onClick={click}
            >
              {isLogin ? 'Увійти' : 'Регістрація'}
            </Button>
          </Row>
        </Form>
      </Card>
    </Container>
  );
});

export default Auth;
