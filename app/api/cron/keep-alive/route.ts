import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: Request) {
  // Verify authorization header from Vercel Cron
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    // Perform a lightweight query to touch Supabase DB and keep it active
    const result = await prisma.$queryRaw`SELECT 1 as ping`;

    return NextResponse.json({
      success: true,
      message: "Supabase keep-alive ping successful",
      timestamp: new Date().toISOString(),
      result,
    });
  } catch (error) {
    console.error("[CRON KEEP-ALIVE ERROR]:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
