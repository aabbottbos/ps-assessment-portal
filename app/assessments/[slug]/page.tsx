import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { verifyAssessmentSession, getAssessmentCookieName } from "@/lib/session";
import { PasswordEntry } from "@/components/customer/PasswordEntry";
import { AssessmentIframe } from "@/components/customer/AssessmentIframe";

export default async function AssessmentPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  // Look up the assessment
  const assessment = await db.assessment.findUnique({
    where: { slug },
  });

  // If not found or not active, show 404
  if (!assessment || assessment.status !== "active") {
    notFound();
  }

  // Check for session cookie
  const cookieStore = await cookies();
  const cookieName = getAssessmentCookieName(slug);
  const sessionToken = cookieStore.get(cookieName)?.value;

  let hasValidSession = false;

  if (sessionToken) {
    const session = await verifyAssessmentSession(sessionToken);
    if (session && session.assessmentId === assessment.id) {
      hasValidSession = true;

      // Log access
      await db.accessLog.create({
        data: {
          assessmentId: assessment.id,
        },
      });
    }
  }

  // If has valid session, show iframe
  if (hasValidSession) {
    return <AssessmentIframe slug={slug} />;
  }

  // Otherwise, show password entry (will auto-submit if passwordRequired=false)
  return (
    <PasswordEntry
      slug={slug}
      clientName={assessment.clientName}
      passwordRequired={assessment.passwordRequired}
    />
  );
}
