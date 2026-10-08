import { useMemo, useState } from "react";
import { Search, Users, Clock3, CheckCircle2, XCircle, FileText } from "lucide-react";

import { useGetCompanyApplications } from "../hooks/useCompanies";

import StatCard from "../cards/StatCard";
import ApplicationCard from "../cards/ApplicationCard";

export default function CompanyApplicationsPage() {
    const {data, isLoading, isError} = useGetCompanyApplications()

    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('ALL')

    const applications = data?.companyApplications ?? []

    const filterApplications = useMemo(() => {
        return applications.filter((application) => {
            const searchTerm = search.toLowerCase()

            const matchesSearch = 
                application.firstName.toLowerCase().includes(searchTerm) ||
                application.lastName.toLowerCase().includes(searchTerm) ||
                application.username.toLowerCase().includes(searchTerm) ||
                application.listingName.toLowerCase().includes(searchTerm)

            const matchesStatus = 
                statusFilter === 'ALL' ||
                application.status === statusFilter

            return matchesSearch && matchesStatus
        })
    }, [applications, search, statusFilter])

    const pendingCount = applications.filter(
        (application) => application.status === 'PENDING'
    ).length

    const approvedCount = applications.filter(
        (application) => application.status === 'APPROVED'
    ).length

    const rejectedCount = applications.filter(
        (application) => application.status === "REJECTED"
    ).length

    if(isLoading){

        return(
            <main className="min-h-screen bg-gray-50 px-6 py-5">
            <div className="mx-auto max-w-7xl">
                <div className="animate-pulse">
                    <div className="h-8 w-64 rounded bg-gray-200"/>
                    <div className="mt-3 h-4 w-96 rounded bg-gray-200" />

                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {Array.from({length:4}).map((_, index) => (
                            <div
                                key={index}
                                className="h-28 rounded-xl border bg-white"
                            />
                        ))}
                    </div>

                    <div className="mt-8 h-16 rounded-xl border bg-white"/>

                    <div className="mt-4 space-y-3">
                        {Array.from({length:5}).map((_, index) => (
                            <div
                                key={index}
                                className="h-32 rounded-xl border bg-white"
                            />

                            
                        ))}
                    </div>

               
                </div>  
            </div>

        </main>
        )
        
    }

    if(isError){
        return (
            <main className="min-h-screen bg-gray-50 px-6 py-8">
                <div className="mx-auto max-w-7xl">
                    <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                        <h2 className="font-semibold text-red-900">
                            Failed to load applications
                        </h2>

                        <p className="mt-1 text-sm text-red-700">
                            Something went wrong while fetching your company applications
                        </p>
                    </div>
                </div>
            </main>
        )
    }
    

    return(
        <main className="min-h-screen bg-green-50 px-6 py-8">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <p className="text-sm font-medium text-gray-500">
                            Company
                        </p>
                        <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
                            Applications
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-gray-500">
                            Review and manage candidates who have applied to your job listing
                        </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
                        <Users className="h-4 w-4" />
                        {applications.length}{" "}
                        {applications.length === 1
                            ? "application"
                            : "applications"}
                    </div>

                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        label = 'Total Applications'
                        value = {applications.length}
                        icon = {Users}
                    />

                    <StatCard
                        label = 'Pending Review'
                        value = {pendingCount}
                        icon = {Clock3}
                    />

                    <StatCard
                        label = 'Approved'
                        value = {approvedCount}
                        icon = {CheckCircle2}
                    />

                    <StatCard
                        label = 'Declined'
                        value = {rejectedCount}
                        icon = {XCircle}
                    />


                </div>

                <div className="mt-8 rounded-xl border bg-white p-4 shadow">
                    <div className="flex flex-col gap-3 md:flex-row">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search applicants or listings..."
                                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-100" 
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-gray-400"
                        >   
                            <option value="ALL">
                                All statuses
                            </option>

                            <option value="PENDING">
                                Pending
                            </option>

                            <option value="APPROVED">
                                Approved
                            </option>

                            <option value="REJECTED">
                                Rejected
                            </option>
                        </select>
                    </div>

                </div>

                <div className="mt-5">
                    {filterApplications.length === 0 ? (
                        <div className="rounded-xl border bg-white px-6 py-16 text-center shadow-sm">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                                <FileText className="h-5 w-5 text-gray-500" />
                            </div>

                            <h3 className="mt-4 text-sm font-semibold text-gray-900">
                                No applications found
                            </h3>

                            <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
                                {applications.length === 0
                                    ? "Applications submitted to your job listings will appear here"
                                    : "Try changing your search or status filter"
                                }
                            </p>
                        </div>
                    ): (
                        <div className="space-y-3">
                            {filterApplications.map((application) => (
                                <ApplicationCard
                                    key={application.applicantId}
                                    application={application}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}