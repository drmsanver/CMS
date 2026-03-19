"use server"

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * GRADE GROUP ACTIONS
 */

export async function createGradeGroup(data: { name: string; grades: string[] }) {
  const session = await getServerSession(authOptions);
  const campusId = (session?.user as any)?.campusId;
  const currentRole = (session?.user as any)?.role;

  if (!['SUPER_ADMIN', 'ORG_ADMIN', 'PRINCIPAL', 'COORDINATOR'].includes(currentRole)) {
    throw new Error("Unauthorized.");
  }
  if (!campusId) throw new Error("No campus associated.");

  await prisma.gradeGroup.create({
    data: {
      name: data.name,
      grades: data.grades,
      campusId,
    }
  });

  revalidatePath('/dashboard/grade-groups');
  return { success: true };
}

export async function updateGradeGroup(id: string, data: { name: string; grades: string[] }) {
  const session = await getServerSession(authOptions);
  const currentRole = (session?.user as any)?.role;

  if (!['SUPER_ADMIN', 'ORG_ADMIN', 'PRINCIPAL', 'COORDINATOR'].includes(currentRole)) {
    throw new Error("Unauthorized.");
  }

  await prisma.gradeGroup.update({
    where: { id },
    data: {
      name: data.name,
      grades: data.grades
    }
  });

  revalidatePath('/dashboard/grade-groups');
  return { success: true };
}

export async function deleteGradeGroup(id: string) {
  const session = await getServerSession(authOptions);
  const currentRole = (session?.user as any)?.role;

  if (!['SUPER_ADMIN', 'ORG_ADMIN', 'PRINCIPAL', 'COORDINATOR'].includes(currentRole)) {
    throw new Error("Unauthorized.");
  }

  await prisma.gradeGroup.delete({ where: { id } });

  revalidatePath('/dashboard/grade-groups');
  return { success: true };
}

/**
 * TASK ACTIONS
 */

export async function createCoordinatorTask(data: { 
  title: string; 
  description?: string; 
  dueDate?: Date; 
  groupIds: string[];
  assignedToId?: string; // Optional: can still assign to a specific user
}) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  const currentRole = (session?.user as any)?.role;

  if (!['SUPER_ADMIN', 'ORG_ADMIN', 'PRINCIPAL', 'COORDINATOR'].includes(currentRole)) {
    throw new Error("Unauthorized.");
  }

  await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      createdById: userId,
      assignedToId: data.assignedToId || userId, // Default to self if not specified? 
      // Actually, if it's a "Grade Task", maybe it doesn't need an assignedToId? 
      // But the schema requires it. I'll default it to the creator for now.
      gradeGroups: {
        connect: data.groupIds.map(id => ({ id }))
      }
    }
  });

  revalidatePath('/dashboard/coordinator-tasks');
  return { success: true };
}
