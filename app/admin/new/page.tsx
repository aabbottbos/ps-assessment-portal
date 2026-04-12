import { AssessmentForm } from "@/components/admin/AssessmentForm";

export default function NewAssessmentPage({
  searchParams,
}: {
  searchParams: { type?: string };
}) {
  const type = (searchParams.type === "proposal" ? "proposal" : "assessment") as "assessment" | "proposal";
  const itemTypeName = type === "proposal" ? "Proposal" : "Assessment";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Add New {itemTypeName}</h2>
        <p className="mt-1 text-sm text-gray-600">
          Create a new client {itemTypeName.toLowerCase()} with secure access
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <AssessmentForm type={type} />
      </div>
    </div>
  );
}
