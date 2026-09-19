import { createBrowserRouter } from "react-router-dom";

import AppLayout from '../layouts/AppLayout'

import PublicRoute from "../components/PublicRoute";

import DashboardPage from "../pages/DashboardPage";



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
                    element: <AppLayout/>,
                    
                    children: [
                        {
                            path: '/',
                            element: <DashboardPage/>

                        }
                    ]
                }

            ],

            
            
        },

        
    ])