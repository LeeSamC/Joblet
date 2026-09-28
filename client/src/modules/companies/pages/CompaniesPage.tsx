import { Building2, Clock } from "lucide-react";

import { useAddRequest, useGetCompanies } from "../hooks/useCompanies";

import { useState } from "react";

export default function CompaniesPage() {
    const {data, isLoading, isError} = useGetCompanies()

    const request = useAddRequest();

    const [requestedCompany, setRequestedCompany] = useState<string | null>(null)

    async function handleRequest(companyId: string){
        try{
            await request.mutateAsync(companyId)
            setRequestedCompany(companyId)
        }catch (error){
            console.error(error)
        }
    }

    if (isLoading){
        return (
            <main className="p-6">
                Loading companies...
            </main>
        )
    }

    if (isError) {
        return (
            <main className="p-6">
                Failed to load companies
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">
                        Find a Company
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Find a company and request to join 
                    </p>
                </div>

                {data?.companies.length === 0 && (
                    <div className="rounded-xl border bg-white p-10 text-center">
                        <p className="text-gray-500">
                            No Companies have been created yet
                        </p>
                    </div>
                )}

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {data?.companies.map(company => {
                        const requested = requestedCompany === company.companyId

                        return(
                            <div
                                key={company.companyId}
                                className="flex flex-col rounded-2xl border bg-white p-6 shadow-sm"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-white">
                                        <Building2 size={24} />
                                    </div>
                                </div>

                                <h2 className="mt-5 text-xl font-bold">
                                    {company.name}
                                </h2>

                                <p className="mt-2 line-clamp-4 text-sm leading-6 text-gray-500">
                                    {company.description}
                                </p>

                                <div className="mt-6">
                                    <button
                                        disabled={requested || request.isPending}
                                        onClick={() => handleRequest(company.companyId)}
                                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
                                    >
                                        {requested ? (
                                            <>
                                                <Clock size={18} />
                                                Request pending
                                            </>
                                        ): (
                                            'Request to join'
                                        )}

                                    </button>
                                </div>

                            </div>
                        )
                    })}

                </div>
            </div>
        </main>
    )
}