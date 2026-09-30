import {Check, X, Clock} from 'lucide-react'

import { useApproveRequest, useDeclineRequest, useGetUserCompany, useGetRequest } from '../hooks/useCompanies'

export default function JoinRequestPage() {
    
    const {data: userCompany, isLoading: companyLoading} = useGetUserCompany()

    const company = userCompany?.company

    const {data, isLoading} = useGetRequest()

    const approve = useApproveRequest()

    const decline = useDeclineRequest()

    if(companyLoading || isLoading){
        return (
            <main className='p-6'>
                Loading request...
            </main>
        )
    }

    if(!company) {
        return (
            <main className='p-6'>
                Company not found
            </main>
        )
    }

    const requests = data?.requests ?? []

    return (
        <main className='min-h-screen bg-gray-50 p-6'>
            <div className='mx-auto max-w-4xl'>
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold'>
                        Join Request
                    </h1>

                    <p className='mt-2 text-gray-500'>
                        People requesting to join {company.name}
                    </p>
                </div>

                {requests.length === 0 && (
                    <div className='rounded-xl flex flex-col items-center justify-center border bg-white p-10 text-gray-400'>
                        <Clock
                            className=' text-gray-400'
                            size={32}
                        />

                        <p className='mt-4 text-gray-500'>
                            There is no pending join request
                        </p>
                    </div>
                )}

                <div className='space-y-4'>
                    {requests.map(request => (
                        <div
                            key={request.requestId}
                            className='rounded-xl border bg-white p-6 shadow-sm'
                        >  
                            <div className='flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between'>
                                <div>
                                    <h2 className='font-semibold'>
                                        {request.firstName}{" "}
                                        {request.lastName}
                                    </h2>
                                    
                                    <p className='text-sm text-gray-500'>
                                        @{request.username}
                                    </p>

                                    <p className='mt-2 text-xs text-gray-400'>
                                        Requested{" "}
                                        {new Date(
                                            request.createdAt
                                        ).toLocaleDateString()}

                                    </p>
                                </div>

                                <div className='flex gap-3'>
                                    <button
                                        disabled={decline.isPending || approve.isPending}
                                        onClick={() => 
                                            decline.mutate({
                                                companyId:company.companyId,
                                                requestId: request.requestId
                                            })
                                        }
                                        className='flex items-center gap-2 rounded-lg border px-4 py-2 font-medium hover:bg-gray-50 disabled:opacity-50'
                                    >
                                        <X size={18} />
                                        Decline

                                    </button>

                                    <button
                                        disabled={approve.isPending || decline.isPending}
                                        onClick={() => 
                                            approve.mutate({
                                                companyId: company.companyId,
                                                requestId: request.requestId
                                            })
                                        }
                                        className='flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 font-medium text-white disabled:opacity-50'
                                    >
                                        <Check size={18}/>
                                        Approve

                                    </button>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}