import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { ExportLogsButton } from "@/components/admin/ExportLogsButton";

export default async function AccessLogsPage({
  params,
}: {
  params: { id: string };
}) {
  const assessment = await db.assessment.findUnique({
    where: { id: params.id },
    include: {
      accessLogs: {
        orderBy: {
          accessedAt: "desc",
        },
      },
    },
  });

  if (!assessment) {
    notFound();
  }

  const totalAccesses = assessment.accessLogs.length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          href="/assessments/admin"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Access Logs</h2>
            <p className="mt-1 text-sm text-gray-600">
              {assessment.clientName} — {totalAccesses}{" "}
              {totalAccesses === 1 ? "access" : "accesses"}
            </p>
          </div>
          <ExportLogsButton
            logs={assessment.accessLogs}
            clientName={assessment.clientName}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {totalAccesses === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Download className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No access logs yet
            </h3>
            <p className="text-gray-600">
              Access events will appear here when customers view this assessment.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Access Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assessment.accessLogs.map((log: any, index: number) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {totalAccesses - index}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(log.accessedAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {totalAccesses > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm font-medium text-gray-500">Total Accesses</div>
            <div className="mt-1 text-2xl font-semibold text-gray-900">
              {totalAccesses}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm font-medium text-gray-500">First Access</div>
            <div className="mt-1 text-sm text-gray-900">
              {new Date(
                assessment.accessLogs[assessment.accessLogs.length - 1].accessedAt
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm font-medium text-gray-500">Last Access</div>
            <div className="mt-1 text-sm text-gray-900">
              {new Date(assessment.accessLogs[0].accessedAt).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
