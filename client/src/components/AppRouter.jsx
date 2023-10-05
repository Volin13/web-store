import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Context } from '..';
import { authRoutes, publicRoutes } from '../routes';

const AppRouter = () => {
  const { user } = useContext(Context);
  console.log(user.isAuth);
  return (
    <Routes>
      {user.isAuth &&
        authRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} match="full" />
        ))}
      {publicRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} match="full" />
      ))}
    </Routes>
  );
};

export default AppRouter;
