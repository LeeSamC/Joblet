import {pgTable, pgEnum, uuid, varchar, timestamp} from 'drizzle-orm/pg-core'

import { users } from './users'
import { companies } from './companies'

export const requestStatus = pgEnum(
    "request_status",
    [
        'PENDING',
        'APPROVED',
        'DECLINED'
    ]
)

export const companyJoinRequest = pgTable('company_join_request', {
    requestId: uuid('request_id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.userId, {onDelete: 'cascade'}),
    companyId: uuid('company_id').notNull().references(() => companies.companyId, {onDelete: 'cascade'}),
    status: requestStatus('status').notNull().default('PENDING'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
})