import {pgTable, uuid, varchar, timestamp} from 'drizzle-orm/pg-core'

import { users } from './users'

export const companies = pgTable('companies', {
    companyId: uuid('company_id').defaultRandom().primaryKey(),
    ownerId: uuid('owner_id').notNull().references(() => users.userId, {onDelete: 'cascade'}),
    name: varchar('name', {length: 50}).notNull(),
    description: varchar('description', {length: 100}),
    createdAt: timestamp('created_at').defaultNow().notNull()
})