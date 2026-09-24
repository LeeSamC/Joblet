import { useState } from "react";

import { useAuthStore } from "../stores/auth.store";

import { useListings } from "../modules/listings/hooks/useListing";
import ListingCard from "../modules/listings/cards/listings.card";

export default function DashboardPage(){

    const user = useAuthStore(state => state.user)

    const {data, isLoading, isError} = useListings()



    return(
        <main>
            <section
                className="relative flex min-h-180 items-center bg-cover bg-center"
                style={{backgroundImage: "url('/images/job.jpg')"}} 
            >
                <div className="absolute inset-0 bg-black/50"></div>

                <div className="relative z-10 mx-auto w-full max-w-7xl px-6 text-white">
                    <h1 className="max-w-2xl text-5xl font-bold leading-tight">
                        Find your next opportunity
                    </h1>

                    <p className="mt-4 max-w-xl text-lg text-gray-200">
                        Discover jobs, connect with companies, and take the
                        next step into your career
                    </p>

                    <button className="mt-6 rounded-lg bg-white px-6 py-3 font-semibold text-black hover:bg-gray-100">
                        Find Jobs
                    </button>

                </div>
            </section>

            <section className="bg-white px-6 py-16">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8 flex items-center justify-center">
                        <div className="h-px w-16 bg-black"></div>
                    </div>

                    <div className="mb-10 text-center">
                        <h2 className="text-3xl font-bold">
                            Explore Opportunities
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Discover the latest jobs available
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="py-10 text-center">
                            <p className="text-gray-500">
                                Loading listings...
                            </p>
                        </div>
                    ): isError ? (
                        <div className="py-10 text-center">
                            <p className="text-red-500">
                                Failed to load listings
                            </p>
                        </div>
                    ): data?.listings.length === 0 ? (
                        <div className=" py-10 text-center">
                            <p className="text-gray-500">
                                No listings available right now
                            </p>
                        </div>
                    ): (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {data?.listings.map((listing) => (
                                <ListingCard
                                    key={listing.listingId}
                                    listing={listing}
                                />
                            ))}
                        </div>
                    )}

                </div>
            </section>
        </main>
    )
}