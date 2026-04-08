import { db } from "@/lib/db";
import { AssessmentForm } from "@/components/admin/AssessmentForm";
import { notFound } from "next/navigation";

export default async function EditAssessmentPage({
  params,
}: {
  params: { id: string };
}) {
  const assessment = await db.assessment.findUnique({
    where: { id: params.id },
  });

  if (!assessment) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Edit Assessment</h2>
        <p className="mt-1 text-sm text-gray-600">
          Update {assessment.clientName} assessment details
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <AssessmentForm assessment={assessment} />
      </div>
    </div>
  );
}
