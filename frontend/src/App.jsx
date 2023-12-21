import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation.jsx';
import * as sessionActions from './store/session';
import ListOfSpots from './components/ListOfSpots/ListOfSpots.jsx';
import SpotPage from './components/SpotPage/SpotPage.jsx';
import SpotForm from './components/SpotForm/SpotForm.jsx';
function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <ListOfSpots />

      },
      {
        path: '/spots/:spotId',
        element: <SpotPage />
      },
      {
        path: '/spots/new',
        element: <SpotForm />
      }
    ]
  }
]);


function App() {
  return <RouterProvider router={router} />;
}

export default App;
