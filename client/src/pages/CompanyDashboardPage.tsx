import {Link} from 'react-router-dom'

import { Building2, Users, ArrowRight, BriefcaseBusiness} from 'lucide-react'

import { useAuthStore } from '../stores/auth.store'

import {useGetUserCompany } from '../modules/companies/hooks/useCompanies'

import { useGetCompanyListings } from '../modules/companies/hooks/useCompanies'

import { useGetCompanyMembers, useGetRequest  } from '../modules/companies/hooks/useCompanies'

import { useGetApplications } from '../modules/applications/hooks/useApplications'


export default function CompanyDashboardPage(){

    const user = useAuthStore(state => state.user)

    const {data: userCompany, isLoading, isError} = useGetUserCompany()

    const {data: listings} = useGetCompanyListings()

    const {data: members} = useGetCompanyMembers()

    const {data:request} = useGetRequest()

    const {data: applications} = useGetApplications()

    const isOwner = userCompany?.company?.ownerId === user?.userId

    if(isLoading){
        return (
            <main className='flex min-h-[80vh] items-center justify-center'>
                <p className='text-gray-500'>
                    Loading...
                </p>

            </main>
        )
    }

    if(isError) {
        return(
            <main className='flex min-h-[80vh] items-center justify-center'>
                <p className='text-red-500'>
                    Failed to load company information
                </p>
            </main>
        )
    }

    if(!userCompany?.company){
        return (
            <main className='min-h-screen bg-gray-50 p-6'>
                <div className='mx-auto max-w-5xl'>
                    <div className='mb-10 text-center'>
                        <h1 className='text-3xl font-bold'>
                            Company Dashboard
                        </h1>

                        <p className='mt-2 text-gray-500'>
                            You're not part of a company yet
                        </p>
                    </div>

                    <div className='grid gap-6 md:grid-cols-2'>
                        <Link
                            to="/company/create"
                            className='group rounded-2xl border bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg'
                        >
                            <div className='mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gray-900 text-white'>
                                <Building2 size={28} />
                            </div>

                            <h2 className='text-xl font-bold'>
                                Create Company
                            </h2>

                            <p className='mt-2 text-gray-500'>
                                Start your own company and begin posting opportunities
                            </p>

                            <div className='mt-6 flex items-center gap-2 font-semibold'>
                                Create Company
                                <ArrowRight size={18} className='transition group-hover:translate-x-1' />
                            </div>    
                        </Link>

                        <Link
                            to="/company/browse"
                            className='group rounded-2xl border bg-white p-8 shadow-sm transition hover:translate-y-1 hover:shadow-lg'
                        >
                            <div className='mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gray-900 text-white'>
                                <Users size={28} />
                            </div>

                            <h2 className='text-xl font-bold'>
                                Join a Company
                            </h2>

                            <p className='mt-2 text-gray-500'>
                                Browse companies and request to become a member
                            </p>

                            <div className='mt-6 flex items-center gap-2 font-semibold'>
                                Browse Companies
                                <ArrowRight size={18} className='transition group-hover:translate-x-1' />
                            </div>
                        </Link>
                    </div>

                </div>
            </main>
        )
    }
    const company = userCompany.company

    return(
            <main className='min-h-screen bg-gray-50 p-6'>
                <div className='mx-auto max-w-7xl'>
                    <div className='mb-8'>
                        <div className='flex items-center gap-3'>
                            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-black text-white'>
                                <Building2 size={24}/>
                            </div>

                            <div>
                                <h1 className='text-3xl font-bold'>
                                    {company.name}
                                </h1>

                                <p className='text-gray-500'>
                                    Company Dashboard
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className='grid gap-6 md:grid-cols-4'>
                        <DashboardCard
                            title = 'Listings'
                            value = {listings?.companyListings.length ?? 0}
                            description = 'Active job listings'
                        />

                        <DashboardCard
                            title = 'Members'
                            value = {members?.companyMembers.length ?? 0}
                            description = 'Company members' 
                        />

                        <DashboardCard
                            title = 'Join Request'
                            value = {request?.requests.length ?? 0}
                            description = 'Company join requests' 
                        />

                        <DashboardCard
                            title='Job Applications'
                            value= {applications?.applications.length ?? 0}
                            description='Job Applications'
                        />
                    </div>

                    <div className='mt-8 grid gap-6 md:grid-cols-2'>
                        <Link
                            to="/company/listings"
                            className='rounded-xl border bg-white p-6 transition hover:translate-y-1 hover:shadow-md'
                        >
                            <div className='flex items-center justify-between'>

                                <div>
                                    <h2 className='font-semibold'>
                                        Manage Listings
                                    </h2>

                                    <p className='mt-2 text-sm text-gray-500'>
                                        Create and manage your job listings
                                    </p>
                                </div>

                                <ArrowRight size={20} />

                            </div>
                        </Link>
                        
                        <Link
                            to="/company/members"
                            className='rounded-xl border bg-white p-6 transition hover:-translate-y-1 hover:shadow-md'
                        >
                            <div className='flex items-center justify-between'>
                                <div>
                                    <h1 className='font-semibold'>
                                        Company Members
                                    </h1>

                                    <p className='mt-1 text-sm text-gray-500'>
                                        Manage people in your company
                                    </p>
                                </div>
                                <Users size={20}/>
                            </div>
                        </Link>

                        <Link
                            to="/company/applications"
                            className='rounded-xl border bg-white p-6 transition hover:-translate-y-1 hover:shadow-md'
                        >
                            <div className='flex items-center justify-between'>
                                <div>
                                    <h1 className='font-semibold'>
                                        Job Applications
                                    </h1>

                                    <p className='mt-1 text-sm text-gray-500'>
                                        Manage job applications
                                    </p>
                                </div>

                                <BriefcaseBusiness size={20} />
                            </div>
                        </Link>

                    

                        {isOwner && (
                            <Link
                                to="/company/requests"
                                className='rounded-xl border bg-white p-6 transition hover:-translate-y-1 hover:shadow-md'
                            >
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <h1 className='font-semibold'>
                                            Join Request
                                        </h1>

                                        <p className='mt-1 text-sm text-gray-500'>
                                            Manage company join request
                                        </p>

                                    </div>
                                    <Users size={20}/>
                                </div>
                                
                            </Link>
                        )}
                    </div>
                </div>
            </main>
        )



}

function DashboardCard({
    title,
    value,
    description
}: {
    title: string
    value: number
    description: string
}) {
    return (
        <div className='rounded-xl border bg-white p-6'>
            <p className='text-sm text-gray-500'>
                {title}
            </p>

            <p className='mt-2 text-3xl font-bold'>
                {value}
            </p>

            <p className='mt-1 text-sm text-gray-400'>
                {description}
            </p>
        </div>
    )
}