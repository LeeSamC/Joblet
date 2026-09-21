import { createBrowserRouter } from "react-router-dom";

import AppLayout from '../layouts/AppLayout'

import PublicRoute from "../components/PublicRoute";

import DashboardPage from "../pages/DashboardPage";

import LoginPage from '../modules/auth/pages/LoginPage'
import RegistrationPage from "../modules/auth/pages/RegistrationPage";


export const router = 
    createBrowserRouter([
        {
            element: <PublicRoute />,
            children: [
                {
                    path: '/login',
                    element: <LoginPage />
                },
                {
                    path: '/register',
                    element: <RegistrationPage />
                }

            ]
            
        },

        {
            element: <AppLayout/>,
            children: [
                {
                    path: '/',
                    element: <DashboardPage />
                }
            ]
        },

        
    ])