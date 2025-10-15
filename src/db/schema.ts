import { sql } from "drizzle-orm";
import { pgTable, integer, text, serial, timestamp, customType, index } from "drizzle-orm/pg-core";

/**
 * Need to use custom type for drizzle to properly insert jsonb values.
 * Solution from here:
 * https://github.com/drizzle-team/drizzle-orm/issues/724
 */
const customJsonb = <TData>(name: string) =>
  customType<{ data: TData; driverData: TData }>({
    dataType() {
      return "jsonb";
    },
    toDriver(val: TData): TData {
      return val;
    },
    fromDriver(value): TData {
      if (typeof value === "string") {
        try {
          return JSON.parse(value) as TData;
        } catch {}
      }
      return value as TData;
    },
  })(name);

const advocates = pgTable(
  "advocates",
  {
    id: serial("id").primaryKey(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    city: text("city").notNull(),
    degree: text("degree").notNull(),
    specialties: customJsonb("specialties").$type<string[]>().default([]).notNull(),
    yearsOfExperience: integer("years_of_experience").notNull(),
    phoneNumber: text("phone_number").notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  },
  // TODO: How to add index to specialtes?
  (table) => [index("city_idx").on(table.city)]
);

export type SelectAdvocate = typeof advocates.$inferSelect;

export { advocates };
