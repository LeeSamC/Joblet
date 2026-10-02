import { expireListings } from "../modules/listings/listings.expiry";

export function startListingExpiryJob() {
    expireListings()

    setInterval(
        async () => {
            await expireListings()
        },
        60 * 1000
    )

    console.log('Listing expiry job started')
}