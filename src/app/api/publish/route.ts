import { NextRequest, NextResponse } from "next/server";
import { PublishInputValidationError } from "@/core/publish/errors";
import { buildPublishSiteUseCase } from "@/context/publish/buildPublishSiteUseCase";
import type { PublishSiteInputDto } from "@/contract/publish/dtos";

const publishSiteUseCase = buildPublishSiteUseCase();

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as PublishSiteInputDto;
    const result = await publishSiteUseCase.execute(payload);
    return NextResponse.json(result);
  } catch (error: any) {
    if (error instanceof PublishInputValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("[Publish API] Error:", error);
    return NextResponse.json(
      { error: "Error interno al procesar la publicaci\u00F3n: " + error.message },
      { status: 500 },
    );
  }
}
