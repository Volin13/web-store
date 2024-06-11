import React, { useEffect, useContext, Suspense } from 'react';
import { observer } from 'mobx-react-lite';
import { BrowserRouter } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { Context } from '.';
import AppRouter from './components/AppRouter';
import NavBar from './components/Bars/NawBar';
import FooterBar from './components/Bars/FooterBar';
import Spiner from './components/UI/UX/Spinner/Spinner';
import { setupInterceptors } from './http';
import { getUserData, refreshTokens } from './http/userAPI';

const App = observer(() => {
  const { user } = useContext(Context);

  const token = localStorage.getItem('refreshToken');
  useEffect(() => {
    if (token) {
      refreshTokens(token).then(data => {
        if (data) {
          user.setIsAuth(true);
        }
      });
      if (!user.id) {
        const decodedToken = jwtDecode(token);
        const userIdFromToken = decodedToken.id;
        getUserData(userIdFromToken).then(data => {
          user.setUserLogin(data?.login);
          user.setAvatar(data?.avatar);
          user.setEmail(data?.email);
          user.setRole(data?.role);
          user.setId(data?.id);
        });
      }
    } else {
      user.setIsAuth(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  setupInterceptors(user);
  return (
    <div className="App">
      <BrowserRouter>
        <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
          <NavBar />
          <div style={{ flex: 1 }}>
            <Suspense fallback={<Spiner />}>
              <AppRouter />
            </Suspense>
          </div>
          <FooterBar />
        </div>
      </BrowserRouter>
    </div>
  );
});

export default App;
