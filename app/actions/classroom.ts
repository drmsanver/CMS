"use server"

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createClassroom(data: { name: string; gradeLevel: string; primaryTeacherId?: string }) {
  const session = await getServerSession(authOptions);
  const campusId = (session?.user as any)?.campusId;
  const currentRole = (session?.user as any)?.role;

  if (!['SUPER_ADMIN', 'ORG_ADMIN', 'PRINCIPAL'].includes(currentRole)) {
    throw new Error("Unauthorized: Only Administrators can create classrooms.");
  }
  if (!campusId) throw new Error("Unauthorized: No campus associated.");

  await prisma.classroom.create({
    data: {
      name: data.name,
      gradeLevel: data.gradeLevel,
      primaryTeacherId: data.primaryTeacherId || null,
      campusId,
    }
  });

  revalidatePath('/dashboard/classrooms');
  return { success: true };
}

export async function assignStudentToClassroom(studentId: string, classroomId: string) {
  const session = await getServerSession(authOptions);
  const currentRole = (session?.user as any)?.role;

  if (!['SUPER_ADMIN', 'ORG_ADMIN', 'PRINCIPAL', 'COUNSELOR'].includes(currentRole)) {
    throw new Error("Unauthorized.");
  }

  await prisma.student.update({
    where: { id: studentId },
    data: { classroomId }
  });

  revalidatePath('/dashboard/classrooms');
  revalidatePath('/dashboard/students');
  return { success: true };
}

export async function removeStudentFromClassroom(studentId: string) {
  const session = await getServerSession(authOptions);
  const currentRole = (session?.user as any)?.role;

  if (!['SUPER_ADMIN', 'ORG_ADMIN', 'PRINCIPAL', 'COUNSELOR'].includes(currentRole)) {
    throw new Error("Unauthorized.");
  }

  await prisma.student.update({
    where: { id: studentId },
    data: { classroomId: null }
  });

  revalidatePath('/dashboard/classrooms');
  revalidatePath('/dashboard/students');
  return { success: true };
}

export async function updateClassroom(id: string, data: { name: string; gradeLevel: string; primaryTeacherId?: string }) {
  const session = await getServerSession(authOptions);
  const currentRole = (session?.user as any)?.role;

  if (!['SUPER_ADMIN', 'ORG_ADMIN', 'PRINCIPAL'].includes(currentRole)) {
    throw new Error("Unauthorized.");
  }

  await prisma.classroom.update({
    where: { id },
    data: {
      name: data.name,
      gradeLevel: data.gradeLevel,
      primaryTeacherId: data.primaryTeacherId || undefined, // use undefined to not update if null? No, schema says @unique primaryTeacherId String?
    }
  });

  revalidatePath('/dashboard/classrooms');
  return { success: true };
}

export async function deleteClassroom(id: string) {
  const session = await getServerSession(authOptions);
  const currentRole = (session?.user as any)?.role;

  if (!['SUPER_ADMIN', 'ORG_ADMIN', 'PRINCIPAL'].includes(currentRole)) {
    throw new Error("Unauthorized.");
  }

  await prisma.classroom.delete({
    where: { id }
  });

  revalidatePath('/dashboard/classrooms');
  return { success: true };
}
