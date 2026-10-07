import { useParams, useNavigate, Link } from "react-router-dom";
import { useListing } from "../hooks/useListing";
import { BriefcaseBusiness, ArrowLeft, Building2, ArrowRight } from "lucide-react";
import { useAuthStore } from "../../../stores/auth.store";



export default function ListingPage() {
    const {listingId} = useParams()
    const navigate = useNavigate()

    const {data, isLoading, isError} = useListing(listingId!)
    const user = useAuthStore(state => state.user)

    if(isLoading){
        return(
            <main className="min-h-screen bg-gray-50 px-6 py-10">
                <div className="mx-auto max-w-5xl animate-pulse">
                    <div className="h-4 w-32 rounded bg-gray-200"/>
                    <div className="mt-10 rounded-2xl border bg-white p-8">
                        <div className="h-12 w-12 rounded-xl bg-gray-200"/>
                        <div className="mt-6 h-8 w-2/3 rounded bg-gray-200" />
                        <div className="mt-3 h-4 w-1/3 rounded bg-gray-200" />

                        <div className="mt-10 space-y-3">
                            <div className="h-4 rounded bg-gray-200" />
                            <div className="h-4 rounded bg-gray-200" />
                            <div className="h-4 w-5/6 rounded bg-gray-200" />
                        </div>

                        
                    </div>
                </div>
            </main>
        )
    }

    if(isError || !data?.listing) {
        return(
            <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
                <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
                    <BriefcaseBusiness className="mx-auto h-10 w-10 text-gray-300" />

                    <h1 className="mt-4 text-xl font-bold text-gray-900">
                        Listing not found
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        This listing may have been removedor its no longer available
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/listings")}
                        className="mt-6 rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
                    >
                        Back to listings

                    </button>
                </div>
            </main>
        )
    }

    const listing = data.listing

    return (
        <main className="min-h-screen bg-gray-50 px-6 py-10">
            <div className="mx-auto max-w-5xl">
                <Link
                    to="/listings"
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to listings
                </Link>

                <section className="mt-8 rounded-2xl border bg-white p-8 shadow-sm sm:p-10">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                                <Building2 className="h-6 w-6 text-gray-600" />
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    {listing.companyName}
                                </p>

                                <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
                                    {listing.name}
                                </h1>

                                <p className="mt-1 text-xs text-gray-400">
                                    Expires At: {listing.expiresAt ?? 'No expiration date'}
                                </p>
                            </div>
                        </div>
                        <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                            Job Opportunity
                        </span>
                    </div>

                    <div className="my-8 border-t" />

                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            About the position
                        </h2>

                        <p className="mt-4 whitespace-pre-line text-base leading-7 text-gray-600">
                            {listing.description}
                        </p>
                    </div>
                </section>

                {user && (
                    <section className="mt-6 rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    Interested in this opportunity
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Submit your application to {listing.companyName}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => navigate(`/sendApplication/${listingId}`)}
                                className="inline-flex items-center justify-centergap-2 rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                            >
                                Apply Now
                                <ArrowRight className="h-4 w-4" />
                            </button>

                        </div>
                    </section>
                )}
            </div>
        </main>
    )
}