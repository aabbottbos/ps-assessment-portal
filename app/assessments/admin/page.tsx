import { db } from "@/lib/db";
import { CopyButton } from "@/components/admin/CopyButton";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DeleteAssessmentButton } from "@/components/admin/DeleteAssessmentButton";
import { Plus, Edit, FileText } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const assessments = await db.assessment.findMany({
    orderBy: [{ status: "asc" }, { clientName: "asc" }],
  });

  const activeAssessments = assessments.filter((a: any) => a.status === "active");
  const inactiveAssessments = assessments.filter((a: any) => a.status === "inactive");
  const archivedAssessments = assessments.filter((a: any) => a.status === "archived");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Assessments</h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage client assessment access and configurations
          </p>
        </div>
        <Link
          href="/assessments/admin/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Assessment
        </Link>
      </div>

      {assessments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assessments yet</h3>
          <p className="text-gray-600 mb-6">
            Get started by creating your first assessment.
          </p>
          <Link
            href="/assessments/admin/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Assessment
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Active Assessments */}
          {activeAssessments.length > 0 && (
            <AssessmentSection
              title="Active"
              assessments={activeAssessments}
            />
          )}

          {/* Inactive Assessments */}
          {inactiveAssessments.length > 0 && (
            <AssessmentSection
              title="Inactive"
              assessments={inactiveAssessments}
            />
          )}

          {/* Archived Assessments */}
          {archivedAssessments.length > 0 && (
            <details className="group">
              <summary className="cursor-pointer list-none">
                <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  Archived ({archivedAssessments.length})
                  <span className="text-gray-400 group-open:rotate-90 transition-transform">
                    ▶
                  </span>
                </h3>
              </summary>
              <AssessmentSection
                title=""
                assessments={archivedAssessments}
              />
            </details>
          )}
        </div>
      )}
    </div>
  );
}

function AssessmentSection({
  title,
  assessments,
}: {
  title: string;
  assessments: any[];
}) {
  return (
    <div>
      {title && (
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          {title} ({assessments.length})
        </h3>
      )}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assessment Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug (URL)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Password
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                URL
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assessments.map((assessment) => (
              <tr key={assessment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {assessment.clientName}
                  </div>
                  {assessment.clientDescription && (
                    <div className="text-xs text-gray-500 max-w-xs truncate">
                      {assessment.clientDescription}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {assessment.assessmentType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-xs font-mono text-gray-600">
                    productschool.net/assessments/{assessment.slug}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={assessment.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {assessment.passwordRequired && assessment.password ? (
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-600">••••••••</span>
                      <CopyButton
                        text={assessment.password}
                        label="Password"
                      />
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">No password</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <CopyButton
                    text={`https://productschool.net/assessments/${assessment.slug}`}
                    label="URL"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/assessments/admin/${assessment.id}`}
                      className="text-primary-600 hover:text-primary-900 p-1"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/assessments/admin/${assessment.id}/logs`}
                      className="text-gray-600 hover:text-gray-900 p-1"
                      title="View Logs"
                    >
                      <FileText className="h-4 w-4" />
                    </Link>
                    <DeleteAssessmentButton
                      assessmentId={assessment.id}
                      clientName={assessment.clientName}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
