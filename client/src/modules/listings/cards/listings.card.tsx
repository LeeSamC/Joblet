import { useNavigate } from "react-router-dom";
import type { listingType } from "../listings.api";

type ListingCardProps = {
    listing: listingType
}

export default function ListingCard({listing}: ListingCardProps){
    const navigate = useNavigate()

    return (
        <article className=" flex flex-col rounded-xl border bg-white p-6 shadow-sm transition hover:translate-y-1 hover:shadow-md">
            <div>
                <h3 className="text-xl font-semibold text-gray-900">
                    {listing.name}
                </h3>

                <p className="mt-2 text-sm text-gray-900">
                    Company ID: {listing.companyId}
                </p>
            </div>
            
            <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">
                {listing.description}
            </p>

            <div className="mt-auto pt-6">
                <button
                    type="button"
                    onClick={() => navigate(`/listing/${listing.listingId}`)}
                    className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-700"
                >
                    View Listing
                </button>
            </div>
        </article>
    )
}