import React from 'react';
import { observer } from 'mobx-react-lite';
import { Suspense } from 'react';
import { useContext } from 'react';

import { BrowserRouter } from 'react-router-dom';
import { Context } from '.';
import AppRouter from './components/AppRouter';
import NavBar from './components/Bars/NawBar';
import Spiner from './components/UI/UX/Spinner/Spinner';
import { setupInterceptors } from './http';

const App = observer(() => {
  const { user } = useContext(Context);
  // const [loading, setLoading] = useState(true);
  // setLoading(false);
  setupInterceptors(user);
  // .then(() => setLoading(false));
  // if (loading) {
  //   return <Spiner />;
  // }

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
