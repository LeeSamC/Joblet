import { createBrowserRouter } from "react-router-dom";

import AppLayout from '../layouts/AppLayout'
import CompanyLayout from "../layouts/CompanyLayout";

import PublicRoute from "../components/PublicRoute";
import ProtectedRoute from "../components/ProtectedRoute";

import DashboardPage from "../pages/DashboardPage";
import CompanyDashboardPage from "../pages/CompanyDashboardPage";

import LoginPage from '../modules/auth/pages/LoginPage'
import RegistrationPage from "../modules/auth/pages/RegistrationPage";
import RoleRoute from "../components/RoleRoute";


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

        {
            element: <RoleRoute allowedRoles={['JOBPROVIDER']} />,
            children: [
                {
                    element: <CompanyLayout />,
                    children: [
                        {
                            path: '/companyDash',
                            element: <CompanyDashboardPage/>
                        }
                    ]
                }
            ]
        }

        
    ])