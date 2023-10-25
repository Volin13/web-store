import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Context } from '..';
import { authRoutes, publicRoutes } from '../routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const AppRouter = () => {
  const { user } = useContext(Context);
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      <Routes>
        {user.isAuth &&
          authRoutes.map(({ path, Component }) => (
            <Route
              key={path}
              path={path}
              element={<Component />}
              match="full"
            />
          ))}
        {!user.isAuth &&
          publicRoutes.map(({ path, Component }) => (
            <Route
              key={path}
              path={path}
              element={<Component />}
              match="full"
            />
          ))}
      </Routes>
    </>
  );
};

export default AppRouter;
