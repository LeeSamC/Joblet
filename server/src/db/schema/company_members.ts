import {pgTable, uuid, timestamp} from 'drizzle-orm/pg-core'

import { companies } from './companies'
import { users } from './users'

export const companyMembers = pgTable('company_members', {
    companyMemberId: uuid('company_member_id').defaultRandom().primaryKey(),
    companyId: uuid('company_id').notNull().references(() => companies.companyId, {onDelete: 'cascade'}),
    userId: uuid('user_id').notNull().references(() => users.userId, {onDelete: 'cascade'}),
    createdAt: timestamp('created_at').defaultNow().notNull()
})