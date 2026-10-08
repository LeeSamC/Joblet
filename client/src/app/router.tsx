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
import CompanyListingsPage from "../modules/companies/pages/CompanyListingsPage";
import CreateListingsPage from "../modules/companies/pages/CreateListingsPage";
import CompanyApplicationPage from "../modules/companies/pages/CompanyApplicationPage";
import CompanyApplicationsPage from "../modules/companies/pages/CompanyApplicationsPage";

import ListingsPage from "../modules/listings/pages/ListingsPage";
import ListingPage from "../modules/listings/pages/ListingPage";
import ProtectedRoute from "../components/ProtectedRoute";

import SendApplicationPage from "../modules/applications/pages/SendApplicationPage";

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
            element: <PublicRoute/>,
            children: [
                {
                    element: <AppLayout />,
                    children: [
                        {
                            path: '/',
                            element: <DashboardPage />
                        },
                        {
                            path: '/listings',
                            element: <ListingsPage />
                        },
                        {
                            path: '/listing/:listingId',
                            element: <ListingPage />
                        }
                    ]
                }
            ]
        },

        {
            element: <ProtectedRoute/>,
            children: [
               {
                element: <AppLayout/>,
                children: [
                     {
                        path: '/sendApplication/:listingId',
                        element: <SendApplicationPage />
                    }
                ]
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
                            path: '/company/listings',
                            element: <CompanyListingsPage />
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
                        },
                        {
                            path: '/company/listings/create',
                            element: <CreateListingsPage/>
                        },
                        {
                            path: '/company/applications',
                            element: <CompanyApplicationsPage/>
                        },
                        {
                            path: '/application/:applicationId',
                            element: <CompanyApplicationPage/>
                        }
                    ]
                }
            ]
        }

        
    ])