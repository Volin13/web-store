import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Suspense } from 'react';
import { useContext } from 'react';

import { BrowserRouter } from 'react-router-dom';
import { Context } from '.';
import AppRouter from './components/AppRouter';
import NavBar from './components/Bars/NawBar';
import Spiner from './components/UI/UX/Spinner/Spinner';
import { setupInterceptors } from './http';
import { refreshTokens } from './http/userAPI';

const App = observer(() => {
  const { user } = useContext(Context);

  const token = localStorage.getItem('refreshToken');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (token) {
      refreshTokens(token)
        .then(data => {
          if (data) {
            user.setIsAuth(true);
          }
        })
        .finally(() => setLoading(false));
    } else {
      user.setIsAuth(false);
      setLoading(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  setupInterceptors(user);

  if (loading) {
    return <Spiner />;
  }
  return (
    <div className="App">
      <BrowserRouter>
        <Suspense fallback={<Spiner />}>
          <NavBar />
          <AppRouter />
        </Suspense>
      </BrowserRouter>
    </div>
  );
});

export default App;
