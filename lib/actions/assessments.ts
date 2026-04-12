"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface AssessmentFormData {
  type: "assessment" | "proposal";
  clientName: string;
  clientDescription?: string;
  assessmentType: string;
  assessmentUrl: string;
  slug: string;
  passwordRequired: boolean;
  password?: string;
  logoUrl?: string;
  status: string;
}

export async function createAssessment(data: AssessmentFormData) {
  try {
    // Check if slug already exists
    const existing = await db.assessment.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      return { success: false, error: "A slug with this name already exists" };
    }

    await db.assessment.create({
      data: {
        type: data.type,
        clientName: data.clientName,
        clientDescription: data.clientDescription || null,
        assessmentType: data.assessmentType,
        assessmentUrl: data.assessmentUrl,
        slug: data.slug,
        passwordRequired: data.passwordRequired,
        password: data.passwordRequired ? data.password : null,
        logoUrl: data.logoUrl || null,
        status: data.status,
      },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error creating assessment:", error);
    return { success: false, error: "Failed to create assessment" };
  }
}

export async function updateAssessment(id: string, data: AssessmentFormData) {
  try {
    // Check if slug is taken by another assessment
    const existing = await db.assessment.findFirst({
      where: {
        slug: data.slug,
        NOT: { id },
      },
    });

    if (existing) {
      return { success: false, error: "This slug is already in use by another assessment" };
    }

    await db.assessment.update({
      where: { id },
      data: {
        type: data.type,
        clientName: data.clientName,
        clientDescription: data.clientDescription || null,
        assessmentType: data.assessmentType,
        assessmentUrl: data.assessmentUrl,
        slug: data.slug,
        passwordRequired: data.passwordRequired,
        password: data.passwordRequired ? data.password : null,
        logoUrl: data.logoUrl || null,
        status: data.status,
      },
    });

    revalidatePath("/admin");
    revalidatePath(`/admin/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating assessment:", error);
    return { success: false, error: "Failed to update assessment" };
  }
}

export async function deleteAssessment(id: string) {
  try {
    // Soft delete: set status to archived
    await db.assessment.update({
      where: { id },
      data: { status: "archived" },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting assessment:", error);
    return { success: false, error: "Failed to delete assessment" };
  }
}

export async function checkSlugAvailability(slug: string, excludeId?: string) {
  const existing = await db.assessment.findFirst({
    where: {
      slug,
      ...(excludeId ? { NOT: { id: excludeId } } : {}),
    },
  });

  return { available: !existing };
}
