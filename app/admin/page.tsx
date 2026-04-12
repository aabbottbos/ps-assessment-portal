import { db } from "@/lib/db";
import { CopyButton } from "@/components/admin/CopyButton";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DeleteAssessmentButton } from "@/components/admin/DeleteAssessmentButton";
import { Plus, Edit, FileText } from "lucide-react";
import Link from "next/link";

// Admin Dashboard - Updated 2026-04-12
export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const currentTab = searchParams.tab || "assessments";
  const type = currentTab === "proposals" ? "proposal" : "assessment";

  const items = await db.assessment.findMany({
    where: { type },
    orderBy: [{ status: "asc" }, { clientName: "asc" }],
  });

  const activeItems = items.filter((a: any) => a.status === "active");
  const inactiveItems = items.filter((a: any) => a.status === "inactive");
  const archivedItems = items.filter((a: any) => a.status === "archived");

  const isProposal = type === "proposal";
  const itemTypeName = isProposal ? "Proposal" : "Assessment";
  const itemTypePlural = isProposal ? "Proposals" : "Assessments";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex gap-8">
          <Link
            href="/admin?tab=assessments"
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              currentTab === "assessments"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Assessments
          </Link>
          <Link
            href="/admin?tab=proposals"
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              currentTab === "proposals"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Proposals
          </Link>
        </nav>
      </div>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{itemTypePlural}</h1>
          <p className="mt-2 text-base text-gray-600">
            Manage client {itemTypePlural.toLowerCase()} access and configurations
          </p>
        </div>
        <Link
          href={`/admin/new?type=${type}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-ps-blue text-white text-sm font-semibold rounded-md hover:bg-ps-navy transition-colors shadow-sm flex-shrink-0"
        >
          <Plus className="h-5 w-5" />
          New {itemTypeName}
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <div className="mx-auto h-16 w-16 bg-primary-50 rounded-full flex items-center justify-center mb-6">
            <FileText className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No {itemTypePlural.toLowerCase()} yet</h3>
          <p className="text-gray-600 mb-8 max-w-sm mx-auto">
            Get started by creating your first client {itemTypeName.toLowerCase()}.
          </p>
          <Link
            href={`/admin/new?type=${type}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-ps-blue text-white text-sm font-semibold rounded-md hover:bg-ps-navy transition-colors shadow-sm"
          >
            <Plus className="h-5 w-5" />
            Create {itemTypeName}
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Active Items */}
          {activeItems.length > 0 && (
            <AssessmentSection
              title="Active"
              assessments={activeItems}
              type={type}
            />
          )}

          {/* Inactive Items */}
          {inactiveItems.length > 0 && (
            <AssessmentSection
              title="Inactive"
              assessments={inactiveItems}
              type={type}
            />
          )}

          {/* Archived Items */}
          {archivedItems.length > 0 && (
            <details className="group">
              <summary className="cursor-pointer list-none">
                <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  Archived ({archivedItems.length})
                  <span className="text-gray-400 group-open:rotate-90 transition-transform">
                    ▶
                  </span>
                </h3>
              </summary>
              <AssessmentSection
                title=""
                assessments={archivedItems}
                type={type}
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
  type,
}: {
  title: string;
  assessments: any[];
  type: "assessment" | "proposal";
}) {
  const pathPrefix = type === "proposal" ? "proposal" : "assessment";
  return (
    <div>
      {title && (
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          {title} <span className="text-gray-500 font-normal">({assessments.length})</span>
        </h2>
      )}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Client Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Assessment URL
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Password
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Share
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {assessments.map((assessment) => (
              <tr key={assessment.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-gray-900">
                    {assessment.clientName}
                  </div>
                  {assessment.clientDescription && (
                    <div className="text-xs text-gray-600 mt-0.5 max-w-xs truncate">
                      {assessment.clientDescription}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-700">
                    {assessment.assessmentType}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded inline-block">
                    productschool.net/{pathPrefix}/{assessment.slug}
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
                    text={`https://productschool.net/${pathPrefix}/${assessment.slug}`}
                    label="URL"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/${assessment.id}`}
                      className="text-primary-600 hover:text-primary-700 p-1"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/admin/${assessment.id}/logs`}
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
