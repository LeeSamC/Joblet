import {pgTable, varchar, uuid, timestamp, boolean} from 'drizzle-orm/pg-core'
import { users } from './users'
import { applications } from './applications'
import { companyJoinRequest } from './company-join-request'

export const notifications = pgTable('notification', {
    notificationId: uuid('notification_id').defaultRandom().notNull(),
    recipientId: uuid('recipient_id').notNull().references(() => users.userId, {onDelete: 'cascade'}),
    actorId: uuid('actor_id').notNull().references(() => users.userId, {onDelete: 'cascade'}),
    type: varchar('type', {length: 50}).notNull(),
    applicationId: uuid('application_id').references(() => applications.applicationId, {onDelete: 'cascade'}),
    requestId: uuid('request_id').references(() => companyJoinRequest.requestId, {onDelete: 'cascade'}),
    isRead: boolean('is_read').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow()
})