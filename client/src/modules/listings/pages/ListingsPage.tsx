import { useNavigate } from "react-router-dom";

import { useListings } from "../hooks/useListing";
import { ArrowRight, BriefcaseBusiness, Building2 } from "lucide-react";

export default function ListingsPage() {
    const navigate = useNavigate()

    const {data, isLoading, isError} = useListings()

    if(isLoading){
        return(
            <main className="min-h-screen bg-gray-50 px-6 py-12">
                <div className="mx-auto max-w-6xl">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 w-48 rounded bg-gray-200"/>
                        <div className="h-4 w-72 rounded bg-gray-200"/>
                        
                        <div className="grid gap-5 md:grid-cols-2">
                            {[1,2,3,4].map((item) => (
                                <div
                                    key={item}
                                    className="h-56 rounded-2xl border bg-white"
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
            <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
                <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Unable to load listings
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        Something went wrong while fetching available opportunities
                    </p>

                    <button
                        type="button"
                        onClick={() => window.location.reload}
                        className="mt-5 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                    >
                        Try Again

                    </button>
                </div>
            </main>
        )
    }

    const listings = data?.listings ?? []

    return (
        <main className="min-h-screen bg-gray-50 px-6 py-10">
            <div className="mx-auto max-w-6xl">
                <div className="mb-10">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                        <BriefcaseBusiness className="h-4 w-4" />
                        <span>Job Opportunites</span>
                    </div>

                    <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Find your next opportunity
                    </h1>

                    <p className="mt-3 max-w-2xl text-gray-500">
                        Explore available postions from companies looking for talented people like you
                    </p>
                    
                </div>

                <div className="mb-5 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        <span className="font-semibold text-gray-900">
                            {listings.length}
                        </span>{" "}
                        {listings.length === 1 ? "opportunity" : "opportunities"} available
                    </p>
                </div>
                

                {listings.length === 0 ? (
                    <div className="rounded-2xl border bg-white px-6 py-16 text-center shadow-sm">
                        <BriefcaseBusiness className="mx-auto h-10 w-10 text-gray-300" />
                        <h2 className="mt-4 text-lg font-semibold text-gray-900">
                            No listings available
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Check back later for new opportunities
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-5 md: grid-cols-2">
                        {listings.map((listing) => (
                            <article
                                key={listing.listingId}
                                className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                                        <Building2 className=" h-5 w-5 text-gray-100"/>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Company
                                        </p>

                                        <p className="font-semibold text-gray-900">
                                            {listing.companyName}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 flex-1">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {listing.name}
                                    </h2>
                                    
                                    <p className="mt-1 text-xs text-gray-400">
                                        Expires At: {listing.expiresAt ?? 'No expiration date'}
                                    </p>

                                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-500">
                                        {listing.description}
                                    </p>

                                    

                                </div>

                                <div className="mt-6 flex items-center justify-between border-t pt-5">
                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                                        Job Opportunity
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() => navigate(`/listing/${listing.listingId}`)}
                                        className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
                                    >
                                        View Listing
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />

                                    </button>
                                </div>

                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}