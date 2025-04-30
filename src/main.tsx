import * as React from 'react';
import axios from 'axios';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';

import { routes } from '@/routes';
import { Root } from '@/root';
import { ScrollRestoration } from '@/components/core/scroll-restoration';

// 1. Configuración del interceptor de Axios (Agregar aquí)
axios.interceptors.request.use((config) => {
  console.log('[AXIOS REQUEST]', {
    url: config.url,
    method: config.method?.toUpperCase(),
    params: config.params,
    data: config.data
  });
  return config;
});

axios.interceptors.response.use(
  (response) => {
    console.log('[AXIOS SUCCESS]', {
      url: response.config.url,
      status: response.status
    });
    return response;
  },
  (error) => {
    console.log('[AXIOS ERROR]', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// 2. Resto del código existente
const root = createRoot(document.getElementById('root')!);

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Root>
        <ScrollRestoration />
        <Outlet />
      </Root>
    ),
    children: [...routes],
  },
]);

root.render(<RouterProvider router={router} />);
