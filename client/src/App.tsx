import {RouterProvider} from 'react-router-dom'

import {router} from './app/router'
import {AppProviders} from './app/providers';
import AuthInitializer from './app/AuthInitializer';

export default function App(){
  return (
    <AppProviders>
      <AuthInitializer />
      <RouterProvider router={router} />
    </AppProviders>
  )
}