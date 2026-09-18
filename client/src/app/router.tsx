import { createBrowserRouter } from "react-router-dom";

import AppLayout from '../layouts/AppLayout'

import PublicRoute from "../components/PublicRoute";



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