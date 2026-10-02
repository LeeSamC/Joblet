import {and, eq, isNotNull, lte} from 'drizzle-orm'
import { db } from '../../db'
import { listings } from '../../db/schema'

export async function expireListings() {
    try{
        const now = new Date()

        const expiredListings = await db.update(listings).set({
            status: 'EXPIRED',
            updatedAt: now
        })
        .where(
            and(
                eq(listings.status, 'ACTIVE'),
                isNotNull(listings.expiresAt),
                lte(listings.expiresAt, now)
            )
        )
        .returning({listingId: listings.listingId})

        if(expiredListings.length > 0){
            console.log(`Expired ${expiredListings.length} listing(s)`)
        }

        return expiredListings
    }catch (error){
        console.error('Failed to expire listings:', error)
        throw error
    }
}