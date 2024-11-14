import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { router } from './App';
import { RouterProvider } from 'react-router-dom';
import AuthProvider from './contexts/AuthContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  </React.StrictMode>
);