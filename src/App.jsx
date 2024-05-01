import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from './view/Home';
import Agregar from './view/Agregar';
import Login from './view/Login';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/gastos',
    element: <Agregar />
  },
  {
    path: '/login',
    element: <Login />
  }
]);

const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App;