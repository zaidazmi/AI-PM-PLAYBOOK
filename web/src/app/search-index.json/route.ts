import { loadSearchIndex } from "@/lib/content";

// Built once at build time; the client fetches it on first search.
export const dynamic = "force-static";

export function GET() {
  return Response.json(loadSearchIndex());
}
