import { NextRequest } from "next/server";
import db from "../../../db";
import { advocates, SelectAdvocate } from "../../../db/schema";
import { ilike, or, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const searchTerm = request.nextUrl.searchParams.get("searchTerm");

  const query = db
    .select()
    .from(advocates)
    .where(
      searchTerm
        ? or(
            ilike(advocates.firstName, `%${searchTerm}%`),
            ilike(advocates.lastName, `%${searchTerm}%`),
            ilike(advocates.city, `%${searchTerm}%`),
            ilike(advocates.degree, `%${searchTerm}%`),
            sql`EXISTS (
                  SELECT 1
                  FROM jsonb_array_elements_text(${advocates.specialties}) AS elem
                  WHERE elem ILIKE ${`%${searchTerm}%`})`,
            sql`${advocates.yearsOfExperience}::varchar ILIKE ${`%${searchTerm}%`}`
          )
        : undefined
    );
  const data = await query.execute();

  return Response.json(data);
}

export type GetAdvocatesResponseType = SelectAdvocate[];
