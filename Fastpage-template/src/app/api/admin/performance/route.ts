
import { NextResponse } from "next/server";
import { PerformanceTester } from "@/lib/performanceTester";

export async function GET() {
  try {
    const tester = new PerformanceTester();
    const results = await tester.runTests();
    
    const summary = {
      totalTests: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      averageTimeMs: Math.round(results.reduce((acc, r) => acc + r.timeMs, 0) / results.length),
      results
    };

    return NextResponse.json(summary);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
