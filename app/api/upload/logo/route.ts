import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type (common web image formats)
    const validTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/svg+xml",
      "image/webp",
    ];

    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload PNG, JPG, SVG, or WebP." },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob with public access for customer-facing logos
    // Note: Requires Blob store to be configured as "public" in Vercel dashboard
    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true, // Prevent filename collisions
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Error uploading file:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error details:", errorMessage);
    console.error("BLOB_READ_WRITE_TOKEN exists:", !!process.env.BLOB_READ_WRITE_TOKEN);
    return NextResponse.json(
      { error: `Failed to upload file: ${errorMessage}` },
      { status: 500 }
    );
  }
}
