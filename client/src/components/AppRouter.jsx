import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Context } from '..';
import { authRoutes, publicRoutes } from '../routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotFoundPage from '../pages/NotFoundPage/NotFound';

const AppRouter = () => {
  const { user } = useContext(Context);
  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (!user.isAuth) {
  //     navigate('/login');
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [user.isAuth]);

  return (
    <>
      <ToastContainer
        style={{ marginTop: '60px' }}
        position="top-right"
        newestOnTop={false}
        autoClose={5000}
        closeOnClick
        theme="dark"
      />
      <Routes>
        {user.isAuth &&
          authRoutes.map(({ path, Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
        {!user.isAuth &&
          publicRoutes.map(({ path, Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};
export default AppRouter;
