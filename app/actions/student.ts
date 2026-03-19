"use server"

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addStudent(data: { studentNumber: string, firstName: string, lastName: string, gradeLevel: string }) {
  const session = await getServerSession(authOptions);
  const campusId = (session?.user as any)?.campusId;

  if (!campusId) throw new Error("Unauthorized: No campus associated.");

  await prisma.student.create({
    data: {
      ...data,
      campusId,
    }
  });

  revalidatePath('/dashboard/students');
  return { success: true };
}

export async function addStudentsBulk(students: any[]) {
  const session = await getServerSession(authOptions);
  const campusId = (session?.user as any)?.campusId;

  if (!campusId) throw new Error("Unauthorized: No campus associated.");

  const dataToInsert = students.map(s => ({
    studentNumber: String(s.studentNumber),
    firstName: String(s.firstName),
    lastName: String(s.lastName),
    gradeLevel: String(s.gradeLevel),
    campusId
  }));

  await prisma.student.createMany({
    data: dataToInsert,
    skipDuplicates: true
  });

  revalidatePath('/dashboard/students');
  return { success: true, count: dataToInsert.length };
}
