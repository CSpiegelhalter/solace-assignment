import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";
import { and, ilike, or, sql } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server";

export type AdvocatesResponse = {
  items: any, 
  total: number, 
  page: number, 
  pageSize: number
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("term") ?? "").trim();
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") ?? 10)));
  const offset = (page - 1) * pageSize;

  // Simple fuzzy filter across key columns
  const whereClause = q
    ? sql`
        (
          ${advocates.firstName} ILIKE '%' || ${q} || '%'
          OR ${advocates.lastName}  ILIKE '%' || ${q} || '%'
          OR ${advocates.city}      ILIKE '%' || ${q} || '%'
          OR ${advocates.degree}    ILIKE '%' || ${q} || '%'
          OR (${advocates.specialties})::text ILIKE '%' || ${q} || '%'
          OR (${advocates.yearsOfExperience})::text ILIKE '%' || ${q} || '%'
          OR (${advocates.phoneNumber})::text     ILIKE '%' || ${q} || '%'
        )
      `
    : undefined; // no filter when q is empty

  const [{ count: total }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(advocates)
    .where(whereClause);

  const items = await db
    .select()
    .from(advocates)
    .where(whereClause)
    .orderBy(advocates.lastName, advocates.firstName) // stable ordering
    .limit(pageSize)
    .offset(offset);

  return NextResponse.json({ items, total, page, pageSize });
}
