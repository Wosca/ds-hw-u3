import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

export const userDetails = pgTable("userdetails", {
  email: text("email").notNull().primaryKey(),
  firstName: text("firstname").notNull(),
  surname: text("surname").notNull(),
  password: text("password").notNull(),
  accessLevel: integer("accesslevel").default(0).notNull(),
});

export const sharkDetails = pgTable("sharkdetails", {
  sharkID: integer("sharkid").notNull().primaryKey(),
  name: text("name").notNull().unique(),
  species: text("species").notNull().unique(),
  risk: text("risk").$type<"Unknown" | "Low" | "Medium" | "High">().notNull(),
});

export const beachDetails = pgTable("beachdetails", {
  beachID: integer("beachid").notNull().primaryKey(),
  beach: text("beach").notNull().unique(),
  area: text("area").notNull().unique(),
});

export const catchDetails = pgTable("catchdetails", {
  catchID: serial("catchid").primaryKey(),
  sharkID: integer("sharkid")
    .notNull()
    .references(() => sharkDetails.sharkID),
  beachID: integer("beachid")
    .notNull()
    .references(() => beachDetails.beachID),
  date: text("date").notNull(),
  fate: text("fate").notNull(),
});

export const warning = pgTable("warning", {
  email: text("email")
    .notNull()
    .references(() => userDetails.email)
    .primaryKey(),
  beachID: integer("beachid")
    .notNull()
    .references(() => beachDetails.beachID)
    .primaryKey(),
});
