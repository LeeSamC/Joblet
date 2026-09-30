import {Navigate, Outlet, useLocation} from 'react-router-dom'
import { useAuthStore } from '../stores/auth.store'

export default function CompanyRoute(){
    const user = useAuthStore(state => state.user)
    const isInitialized = useAuthStore(state => state.isInitialized)

    const location = useLocation()

    if(!isInitialized){
        return(
            <main className='flex min-h-screen items-center justify-center'>
                <p className='text-gray-500'>
                    Loading...
                </p>
            </main>
        )
    }

    if(!user){
        console.log("REDIRECTING: no user")
        return (
            <Navigate
                to='/login'
                replace
                state={{from: location}}
            />
        )
    }

    if(user.role !== 'JOBPROVIDER'){
        console.log('REDIRECTING: wrong role', user.role)
        return <Navigate to="/" replace />
    }

    return <Outlet/>
}