import { observer } from 'mobx-react-lite';
import { useContext, useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { BrowserRouter } from 'react-router-dom';
import { Context } from '.';
import AppRouter from './components/AppRouter';
import NavBar from './components/NawBar';
import { check } from './http/userAPI';

const App = observer(() => {
  const { user } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  useEffect(() => {
    if (token) {
      check()
        .then(data => {
          user.setUser(true);
          user.setIsAuth(true);
        })
        .finally(() => setLoading(false));
    } else {
      user.setUser(false);
      user.setIsAuth(false);
      setLoading(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <Spinner animation={'grow'} />;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <AppRouter />
      </BrowserRouter>
    </div>
  );
});

export default App;
