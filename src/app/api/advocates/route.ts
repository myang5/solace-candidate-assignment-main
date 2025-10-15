import db from "../../../db";
import { advocates, SelectAdvocate } from "../../../db/schema";

export async function GET() {
  const data = await db.select().from(advocates);

  return Response.json(data);
}

export type GetAdvocatesResponseType = SelectAdvocate[];
