import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const Users = sqliteTable('users', {
    id: int('id').primaryKey({autoIncrement: true}),
    name: text('name').notNull(),
    email: text('email').unique().notNull(),
})