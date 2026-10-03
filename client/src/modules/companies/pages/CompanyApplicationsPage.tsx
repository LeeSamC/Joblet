import { useMemo, useState } from "react";
import { Search, Users, Clock3, CheckCircle2, XCircle, FileText, ExternalLink, ChevronRight } from "lucide-react";

import { useGetApplications } from "../../applications/hooks/useApplications";

export default function CompanyApplicationsPage() {
    const {data, isLoading, isError} = useGetApplications()

    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('ALL')

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

    const applications = data?.applications ?? []

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

    return(
        <main className="min-h-screen bg-green-50 px-6 py-8">
            <div className="mx-auto max-w-7xl">
                
            </div>
        </main>
    )
}