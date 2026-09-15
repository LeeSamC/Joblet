import {pgTable, uuid, varchar, timestamp, text} from 'drizzle-orm/pg-core'
import {users} from './users'
import {companies} from './companies'

export const listings = pgTable('listings', {
    listingId: uuid('listing_id').defaultRandom().primaryKey(),
    companyId: uuid('company_id').notNull().references(() => companies.companyId, {onDelete: 'cascade'}),
    name: varchar('name', {length: 50}).notNull(),
    description: text('description').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull()
})