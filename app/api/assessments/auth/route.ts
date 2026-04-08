import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  signAssessmentSession,
  getAssessmentCookieName,
} from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, password } = body;

    if (!slug || !password) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Look up the assessment
    const assessment = await db.assessment.findUnique({
      where: { slug },
    });

    if (!assessment || assessment.status !== "active") {
      return NextResponse.json(
        { success: false, error: "Assessment not found" },
        { status: 404 }
      );
    }

    // Check password
    if (!assessment.passwordRequired) {
      // Password not required, allow access
    } else if (assessment.password !== password) {
      return NextResponse.json(
        { success: false, error: "Incorrect password" },
        { status: 401 }
      );
    }

    // Generate session token
    const token = await signAssessmentSession({
      assessmentId: assessment.id,
      slug: assessment.slug,
    });

    // Set HTTP-only cookie
    const cookieName = getAssessmentCookieName(slug);
    const response = NextResponse.json({ success: true });

    response.cookies.set(cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error in assessment auth:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
