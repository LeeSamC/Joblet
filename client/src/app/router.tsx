import { createBrowserRouter } from "react-router-dom";

import AppLayout from '../layouts/AppLayout'
import CompanyLayout from "../layouts/CompanyLayout";

import PublicRoute from "../components/PublicRoute";
import CompanyRoute from "../components/CompanyRoute";

import DashboardPage from "../pages/DashboardPage";
import CompanyDashboardPage from "../pages/CompanyDashboardPage";

import LoginPage from '../modules/auth/pages/LoginPage'
import RegistrationPage from "../modules/auth/pages/RegistrationPage";

import CreateCompanyPage from "../modules/companies/pages/CreateCompanyPage";
import CompanyMembersPage from "../modules/companies/pages/CompanyMembersPage";
import JoinRequestPage from "../modules/companies/pages/JoinRequestPage";
import CompaniesPage from "../modules/companies/pages/CompaniesPage";



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
            element: <CompanyRoute />,
            children: [
                {
                    element: <CompanyLayout />,
                    children: [
                        {
                            path: '/companyDash',
                            element: <CompanyDashboardPage/>
                        },
                        {
                            path: '/company/create',
                            element: <CreateCompanyPage/>
                        },
                        {
                            path: '/company/browse',
                            element: <CompaniesPage/>
                        },
                        {
                            path: '/company/requests',
                            element: <JoinRequestPage />
                        },
                        {
                            path: '/company/members',
                            element: <CompanyMembersPage/>
                        }
                    ]
                }
            ]
        }

        
    ])