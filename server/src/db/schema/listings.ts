import {pgTable, uuid, varchar, timestamp, text} from 'drizzle-orm/pg-core'
import {users} from './users'
import {companies} from './companies'
import { pgEnum } from 'drizzle-orm/pg-core'

const listingStatusEnum = pgEnum('listing_status', [
    'ACTIVE',
    'EXPIRED',
    'DISABLED'
])

export const listings = pgTable('listings', {
    listingId: uuid('listing_id').defaultRandom().primaryKey(),
    companyId: uuid('company_id').notNull().references(() => companies.companyId, {onDelete: 'cascade'}),
    name: varchar('name', {length: 50}).notNull(),
    description: text('description').notNull(),
    status: listingStatusEnum('status').notNull().default('ACTIVE'),
    expiresAt: timestamp('expires_at', {withTimezone: true}),
    createdAt: timestamp('created_at', {withTimezone: true}).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', {withTimezone: true}).defaultNow().notNull()
})