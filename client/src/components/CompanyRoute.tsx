import {Navigate, Outlet, useLocation} from 'react-router-dom'
import { useAuthStore } from '../stores/auth.store'

export default function CompanyRoute(){
    const user = useAuthStore(state => state.user)
    const location = useLocation()

    if(!user){
        return (
            <Navigate
                to='/login'
                replace
                state={{from: location}}
            />
        )
    }

    if(user.role !== 'JOBPROVIDER'){
        return <Navigate to="/" replace />
    }

    return <Outlet/>
}