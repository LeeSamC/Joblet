import {pgTable, pgEnum, uuid, varchar, timestamp} from 'drizzle-orm/pg-core'

export const userRoleEnum = pgEnum('user_role', [
    'JOBSEEKER',
    'JOBPROVIDER'
])

export const users = pgTable('users', {
    userId: uuid('user_id').defaultRandom().primaryKey(),
    firstName: varchar('first_name', {length: 30}).notNull(),
    lastName: varchar('last_name', {length: 30}).notNull(),
    username: varchar('username', {length: 50}).notNull().unique(),
    passwordHash: varchar('password_hash', {length: 255}).notNull(),
    role: userRoleEnum('role').notNull().default('JOBSEEKER'),
    createdAt: timestamp('created_at').defaultNow().notNull()
})