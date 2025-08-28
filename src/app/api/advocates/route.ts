import db from "@/db";
import { advocates } from "@/db/schema";
import { sql, and, SQL } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

type Advocate = typeof advocates.$inferSelect;

type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

const QuerySchema = z.object({
  term: z.string().trim().max(200).optional().default(""),
  page: z.coerce.number().int().gte(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
});

function buildWhere(term: string): SQL | undefined {
  if (!term) return undefined;
  // Tokenize to make short multi-word searches feel better:
  const tokens = term
    .split(/\s+/)
    .map(t => t.trim())
    .filter(Boolean);

  // For each token require it to appear in at least one of the columns (AND across tokens).
  const tokenClauses = tokens.map((t) => sql`
    (${advocates.firstName} ILIKE '%' || ${t} || '%'
     OR ${advocates.lastName}  ILIKE '%' || ${t} || '%'
     OR ${advocates.city}      ILIKE '%' || ${t} || '%'
     OR ${advocates.degree}    ILIKE '%' || ${t} || '%'
     OR (${advocates.specialties})::text ILIKE '%' || ${t} || '%')
  `);

  // AND all token clauses together
  return and(...tokenClauses);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const parsed = QuerySchema.parse({
      term: searchParams.get("term") ?? undefined,
      page: searchParams.get("page") ?? undefined,
      pageSize: searchParams.get("pageSize") ?? undefined,
    });

    const { term, page, pageSize } = parsed;
    const offset = (page - 1) * pageSize;
    const where = buildWhere(term);

    // Single round-trip: select rows + total via window function
    const rows = await db
      .select({
        id: advocates.id,
        firstName: advocates.firstName,
        lastName: advocates.lastName,
        city: advocates.city,
        degree: advocates.degree,
        specialties: advocates.specialties,
        yearsOfExperience: advocates.yearsOfExperience,
        phoneNumber: advocates.phoneNumber,
        total: sql<number>`count(*) over()`,
      })
      .from(advocates)
      .where(where)
      .orderBy(advocates.lastName, advocates.firstName)
      .limit(pageSize)
      .offset(offset);

    const total = rows[0]?.total ?? 0;
    const items: Advocate[] = rows.map(({ total: _ignore, ...r }) => r as Advocate);

    const payload: Paginated<Advocate> = {
      items,
      total,
      page,
      pageSize,
    };

    return NextResponse.json(payload, {
      headers: {
        // CDN/Edge can cache for 30s; still returns fresh on search changes
        "Cache-Control": "public, max-age=30, stale-while-revalidate=60",
      },
    });
  } catch (err) {
    // Give a clean 400 on bad query params; 500 otherwise
    const message =
      err instanceof z.ZodError ? "Invalid query parameters." : "Unexpected server error.";
    const status = err instanceof z.ZodError ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
