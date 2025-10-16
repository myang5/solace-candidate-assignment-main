import { NextRequest } from "next/server";
import db from "../../../db";
import { advocates, SelectAdvocate } from "../../../db/schema";
import { count, gt, gte, ilike, or, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const searchTerm = request.nextUrl.searchParams.get("searchTerm");
  const nextId = validateNextId(request.nextUrl.searchParams.get("next"));
  const pageSize = validatePageSize(request.nextUrl.searchParams.get("pageSize"));
  // Fetch extra row to determine if there are more pages
  // after the current one
  const limit = pageSize + 1;

  const subQuery = db.$with("subQuery").as(
    db
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
      )
  );

  const countQuery = db.with(subQuery).select({ count: count() }).from(subQuery);
  const [{ count: rowCount }] = await countQuery.execute();

  const dataQuery = db
    .with(subQuery)
    .select()
    .from(subQuery)
    .where(nextId ? gte(subQuery.id, nextId) : undefined)
    // Arbitrary column used to preserve the order of paginated results.
    // In a production setting there would probably be some
    // product discussion about the default order of advocates.
    .orderBy(subQuery.id)
    .limit(limit);
  const data = await dataQuery.execute();
  const next = data.length > pageSize ? data[pageSize].id : null;

  return Response.json({ count: rowCount, next, data: data.slice(0, pageSize) });
}

export interface GetAdvocatesResponseType {
  count: number;
  next: SelectAdvocate["id"] | null;
  data: SelectAdvocate[];
}

const validatePageSize = (pageSizeRaw: string | null) => {
  // undefined | null -> default value
  // invalid number string -> throw error
  // valid number string < 1 -> throw error
  // valid number string >= 1 -> use value
  if (pageSizeRaw && (isNaN(Number(pageSizeRaw)) || Number(pageSizeRaw) < 1)) {
    throw new Error("`pageSize` must be a number greater than or equal to 1");
  }
  const pageSize = Number(pageSizeRaw) || 20;
  return pageSize;
};

const validateNextId = (nextIdRaw: string | null) => {
  // undefined | null -> return null
  // invalid number string -> throw error
  // valid number string -> return value
  if (nextIdRaw && isNaN(Number(nextIdRaw))) {
    throw new Error("`next` must be a number");
  }
  const nextId = nextIdRaw ? Number(nextIdRaw) : null;
  return nextId;
};
