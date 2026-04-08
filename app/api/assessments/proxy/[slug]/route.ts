import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAssessmentSession, getAssessmentCookieName } from "@/lib/session";
import { cookies } from "next/headers";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Get the session cookie
    const cookieStore = await cookies();
    const cookieName = getAssessmentCookieName(slug);
    const sessionToken = cookieStore.get(cookieName)?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Unauthorized - No session" },
        { status: 401 }
      );
    }

    // Verify the session
    const session = await verifyAssessmentSession(sessionToken);

    if (!session || session.slug !== slug) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid session" },
        { status: 401 }
      );
    }

    // Get the assessment
    const assessment = await db.assessment.findUnique({
      where: { id: session.assessmentId },
    });

    if (!assessment || assessment.status !== "active") {
      return NextResponse.json(
        { error: "Assessment not found or inactive" },
        { status: 404 }
      );
    }

    // Redirect to the real assessment URL
    return NextResponse.redirect(assessment.assessmentUrl, 302);
  } catch (error) {
    console.error("Error in assessment proxy:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
