import {Link} from "react-router-dom"

import { BriefcaseBusiness, Plus, ArrowRight } from "lucide-react"

import { useListings } from "../../listings/hooks/useListing"

export default function CompanyListingsPage() {

    const {data, isLoading, isError} = useListings()

    return (
        <main className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-black text-white">
                            <BriefcaseBusiness size={24} />
                        </div>

                        <h1 className="text-3xl font-bold">
                            Job listing
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Manage your company's job opportunities
                        </p>
                    </div>

                    <Link
                        to="/company/listings/create"
                        className="flex items-center gap-2 rounded-lg bg-black px-4 py-3 font-semibold text-white hover:bg-gray-800"
                    >
                        <Plus size={18}/>
                        Create Listing
                    </Link>
                </div>

                {isLoading && (
                    <div className="rounded-2xl border bg-white p-10 text-center">
                        <p className="text-gray-500">
                            Loading listings...
                        </p>
                    </div>
                )}

                {isError && (
                    <div className="rounded-2xl border bg-white p-10 text-center">
                        <p className="text-red-600">
                            Failed to load listings
                        </p>
                    </div>
                )}

                {!isLoading && !isError && data?.listings.length === 0 && (
                    <div className="rounded-2xl border bg-white p-12 text-center">
                        <BriefcaseBusiness size={48} className="mx-auto text-gray-400" />

                        <h2 className="mt-4 text-xl font-semibold">
                            No listings yet
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Create your first job listing
                        </p>

                        <Link
                            to="/company/listings/create"
                            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-black px-5 py-3 font-semibold text-white"
                        >
                            Create Listing
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                )}

                {!isLoading && !isError && data?.listings && data.listings.length > 0 && (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {data.listings.map((listing) => (
                            <div
                                key={listing.listingId}
                                className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md" 
                            >   
                                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100">
                                    <BriefcaseBusiness size={22} />
                                </div>

                                <h2 className="text-xl font-bold">
                                    {listing.name}
                                </h2>

                                <p className="mt-3 line-clamp-4 text-sm leading-6 text-gray-500">
                                    {listing.description}
                                </p>

                                <div className="mt-6 flex items-center justify-between">
                                    <span className="text-xs text-gray-400">
                                        Job Listing
                                    </span>

                                    <Link
                                        to={`/listing/${listing.listingId}`}
                                        className="flex items-center gap-1 text-sm font-semibold hover:underline"
                                    >
                                        View

                                        <ArrowRight size={16} />
                                    </Link>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>

        </main>
    )
}