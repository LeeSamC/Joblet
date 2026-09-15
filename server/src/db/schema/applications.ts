import {pgTable, pgEnum, uuid, varchar, timestamp, unique} from 'drizzle-orm/pg-core'

import { users } from './users'
import {listings} from './listings'

export const applicationStatusEnum = pgEnum('application_status_enum', [
    'PENDING',
    'REVIEWING',
    'APPROVED',
    'REJECTED',

])

export const applications = pgTable('applications', {
    applicationId: uuid('application_id').defaultRandom().primaryKey(),
    applicantId: uuid('applicant_id').notNull().references(() => users.userId, {onDelete: 'cascade'}),
    listingId: uuid('listing_id').notNull().references(() => listings.listingId, {onDelete: 'cascade'}),
    coverLetter: varchar('cover_letter', {length: 1000}).notNull(),
    resume: varchar('resume', {length: 1000}).notNull(),
    status: applicationStatusEnum('status').notNull().default('PENDING'),
    createdAt: timestamp('created_at').defaultNow().notNull()
},
    (table) => [
        unique('applicaton_listing_unique').on(table.applicantId, table.listingId)
    ]
)