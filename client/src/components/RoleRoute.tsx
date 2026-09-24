import {Navigate, Outlet} from 'react-router-dom'
import { useAuthStore } from '../stores/auth.store'

type RoleRouteProps = {
    allowedRoles: Array<"JOBSEEKER" | "JOBPROVIDER">
}

export default function RoleRoute({allowedRoles}: RoleRouteProps) {
    const user = useAuthStore(state => state.user)

    if(!user) {
        return <Navigate to="/login" replace/>
    }

    if(!allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace/>
    }

    return <Outlet/>
}