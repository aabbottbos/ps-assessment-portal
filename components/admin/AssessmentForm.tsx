"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  createAssessment,
  updateAssessment,
  checkSlugAvailability,
  type AssessmentFormData,
} from "@/lib/actions/assessments";

interface AssessmentFormProps {
  assessment?: {
    id: string;
    clientName: string;
    clientDescription: string | null;
    assessmentType: string;
    assessmentUrl: string;
    slug: string;
    passwordRequired: boolean;
    password: string | null;
    status: string;
  };
}

const SUGGESTED_TYPES = ["Initial Audit", "Follow-up", "Deep Dive"];

export function AssessmentForm({ assessment }: AssessmentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [formData, setFormData] = useState<AssessmentFormData>({
    clientName: assessment?.clientName || "",
    clientDescription: assessment?.clientDescription || "",
    assessmentType: assessment?.assessmentType || "",
    assessmentUrl: assessment?.assessmentUrl || "",
    slug: assessment?.slug || "",
    passwordRequired: assessment?.passwordRequired ?? true,
    password: assessment?.password || "",
    status: assessment?.status || "active",
  });

  // Auto-generate slug from client name
  useEffect(() => {
    if (!slugManuallyEdited && formData.clientName && !assessment) {
      const generatedSlug = formData.clientName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.clientName, slugManuallyEdited, assessment]);

  const handleSlugBlur = async () => {
    if (!formData.slug) return;

    const { available } = await checkSlugAvailability(
      formData.slug,
      assessment?.id
    );
    if (!available) {
      toast.error("This slug is already in use");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation
      if (!formData.clientName.trim()) {
        toast.error("Client name is required");
        setLoading(false);
        return;
      }

      if (!formData.assessmentType.trim()) {
        toast.error("Assessment type is required");
        setLoading(false);
        return;
      }

      if (!formData.assessmentUrl.trim()) {
        toast.error("Assessment URL is required");
        setLoading(false);
        return;
      }

      if (!formData.slug.trim()) {
        toast.error("Slug is required");
        setLoading(false);
        return;
      }

      if (formData.passwordRequired && !formData.password?.trim()) {
        toast.error("Password is required when password protection is enabled");
        setLoading(false);
        return;
      }

      // Save
      const result = assessment
        ? await updateAssessment(assessment.id, formData)
        : await createAssessment(formData);

      if (result.success) {
        toast.success(
          assessment
            ? "Assessment updated successfully"
            : "Assessment created successfully"
        );
        router.push("/assessments/admin");
        router.refresh();
      } else {
        toast.error(result.error || "An error occurred");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Client Name */}
      <div>
        <label
          htmlFor="clientName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Client Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="clientName"
          value={formData.clientName}
          onChange={(e) =>
            setFormData({ ...formData, clientName: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          required
        />
      </div>

      {/* Assessment Type */}
      <div>
        <label
          htmlFor="assessmentType"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Assessment Type <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="assessmentType"
          list="assessment-types"
          value={formData.assessmentType}
          onChange={(e) =>
            setFormData({ ...formData, assessmentType: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          placeholder="e.g., Initial Audit, Follow-up, Deep Dive"
          required
        />
        <datalist id="assessment-types">
          {SUGGESTED_TYPES.map((type) => (
            <option key={type} value={type} />
          ))}
        </datalist>
      </div>

      {/* Client Description */}
      <div>
        <label
          htmlFor="clientDescription"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Client Description <span className="text-gray-400">(Optional)</span>
        </label>
        <textarea
          id="clientDescription"
          value={formData.clientDescription}
          onChange={(e) =>
            setFormData({ ...formData, clientDescription: e.target.value })
          }
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          placeholder="Internal notes about this client or assessment"
        />
      </div>

      {/* Assessment URL */}
      <div>
        <label
          htmlFor="assessmentUrl"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Assessment URL <span className="text-red-500">*</span>
        </label>
        <input
          type="url"
          id="assessmentUrl"
          value={formData.assessmentUrl}
          onChange={(e) =>
            setFormData({ ...formData, assessmentUrl: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
          placeholder="https://your-assessment.vercel.app"
          required
        />
        <p className="mt-1 text-xs text-gray-500">
          The real Vercel URL — never exposed to clients
        </p>
      </div>

      {/* Slug */}
      <div>
        <label
          htmlFor="slug"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Slug <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center">
          <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
            productschool.net/assessments/
          </span>
          <input
            type="text"
            id="slug"
            value={formData.slug}
            onChange={(e) => {
              setSlugManuallyEdited(true);
              setFormData({ ...formData, slug: e.target.value });
            }}
            onBlur={handleSlugBlur}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
            pattern="[a-z0-9-]+"
            title="Only lowercase letters, numbers, and hyphens"
            required
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Auto-generated from client name, but you can edit it. Must be unique.
        </p>
      </div>

      {/* Password Required Toggle */}
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            id="passwordRequired"
            checked={formData.passwordRequired}
            onChange={(e) =>
              setFormData({ ...formData, passwordRequired: e.target.checked })
            }
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
        </div>
        <div className="ml-3">
          <label
            htmlFor="passwordRequired"
            className="text-sm font-medium text-gray-700"
          >
            Password Required
          </label>
          <p className="text-xs text-gray-500">
            Require a password to access this assessment
          </p>
        </div>
      </div>

      {/* Password */}
      {formData.passwordRequired && (
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required={formData.passwordRequired}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Status */}
      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Status <span className="text-red-500">*</span>
        </label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          required
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {assessment ? "Update Assessment" : "Create Assessment"}
        </button>
      </div>
    </form>
  );
}
