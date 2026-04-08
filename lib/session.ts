import { SignJWT, jwtVerify } from "jose";

export interface AssessmentSessionPayload {
  assessmentId: string;
  slug: string;
}

/**
 * Gets the session secret and encodes it
 * Throws error if not set (lazy evaluation for runtime only)
 */
function getSecret(): Uint8Array {
  const SESSION_SECRET = process.env.ASSESSMENT_SESSION_SECRET;

  if (!SESSION_SECRET) {
    throw new Error("ASSESSMENT_SESSION_SECRET environment variable is not set");
  }

  return new TextEncoder().encode(SESSION_SECRET);
}

/**
 * Signs a JWT token for an assessment session
 * Token expires in 24 hours
 */
export async function signAssessmentSession(
  payload: AssessmentSessionPayload
): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getSecret());
}

/**
 * Verifies and decodes an assessment session JWT token
 * Returns null if token is invalid or expired
 */
export async function verifyAssessmentSession(
  token: string
): Promise<AssessmentSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (
      payload &&
      typeof payload.assessmentId === "string" &&
      typeof payload.slug === "string"
    ) {
      return {
        assessmentId: payload.assessmentId,
        slug: payload.slug,
      };
    }
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Generates the cookie name for a specific assessment slug
 */
export function getAssessmentCookieName(slug: string): string {
  return `ps_assessment_${slug}`;
}
