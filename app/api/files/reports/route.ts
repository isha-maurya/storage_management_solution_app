import { NextResponse } from "next/server";
import { Query } from "appwrite";
import { createAdminClient } from "@/lib/appwrite"; // Correct import

const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;
const fileCollectionId = process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION!;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDateParam = searchParams.get("startDate");
  const endDateParam = searchParams.get("endDate");

  if (!startDateParam || !endDateParam) {
    return NextResponse.json(
      { error: "Missing start or end date" },
      { status: 400 },
    );
  }

  try {
    const { databases } = await createAdminClient(); // Correct way to get databases object

    const { documents } = await databases.listDocuments(
      databaseId,
      fileCollectionId,
      [
        Query.greaterThanEqual("$createdAt", startDateParam),
        Query.lessThanEqual("$createdAt", endDateParam),
        Query.limit(100),
      ],
    );

    return NextResponse.json({ files: documents });
  } catch (error) {
    console.error("API error fetching reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 },
    );
  }
}
