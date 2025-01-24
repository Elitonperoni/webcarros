import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { router } from './App';
import { RouterProvider } from 'react-router-dom';
import AuthProvider from './contexts/AuthContext';

import { register } from 'swiper/element/bundle';
import { Toaster } from 'react-hot-toast'; 

import 'swiper/css';
import 'swiper/css/navigation'; 
import 'swiper/css/pagination'; 
import 'swiper/css/scrollbar'; 

register();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Toaster
      position="top-right"
      reverseOrder={false}
    />
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  </React.StrictMode>
);
