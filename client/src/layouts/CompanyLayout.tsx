import {Outlet} from 'react-router-dom'
import CompanyNavigation from '../components/CompanyNavigation'

export default function CompanyLayout() {
    return (
        <div className='min-h-screen bg-gray-100'>
            <CompanyNavigation />
            <Outlet/>
        </div>
    )
}