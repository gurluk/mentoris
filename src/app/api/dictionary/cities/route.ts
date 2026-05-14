import { dictionaryService } from "@/server/services/dictionary.service";

export async function GET() {
  try {
    const cities = await dictionaryService.getCities();

    return Response.json({ data: cities });
  } catch (err) {
    return Response.json(
      {
        message: err instanceof Error ? err.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
