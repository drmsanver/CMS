"use server"

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addStudent(data: {
  studentNumber: string;
  firstName: string;
  lastName: string;
  gradeLevel: string;
  dateOfBirth?: string;
  fatherName?: string;
  fatherPhone?: string;
  fatherEmail?: string;
  motherName?: string;
  motherPhone?: string;
  motherEmail?: string;
  defaultContact?: string;
  gender?: any;
  schoolId?: string;
  classroomId?: string;
  campusId?: string;
}) {
  const session = await getServerSession(authOptions);
  const sessionCampusId = (session?.user as any)?.campusId;
  const targetCampusId = data.campusId || sessionCampusId;

  if (!targetCampusId) throw new Error("Unauthorized: No campus associated.");

  const { dateOfBirth, campusId: _, ...rest } = data;

  await prisma.student.create({
    data: {
      ...rest,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      campusId: targetCampusId,
    }
  });

  revalidatePath('/dashboard/students');
  return { success: true };
}

export async function addStudentsBulk(students: any[]) {
  const session = await getServerSession(authOptions);
  const sessionCampusId = (session?.user as any)?.campusId;

  const dataToInsert = students.map(s => ({
    studentNumber: String(s.studentNumber),
    firstName: String(s.firstName),
    lastName: String(s.lastName),
    gender: s.gender,
    gradeLevel: String(s.gradeLevel),
    schoolId: s.schoolId,
    classroomId: s.classroomId,
    campusId: s.campusId || sessionCampusId
  })).filter(s => s.campusId); // Ensure campusId exists

  if (dataToInsert.length === 0) return { success: true, count: 0 };

  await prisma.student.createMany({
    data: dataToInsert,
    skipDuplicates: true
  });

  revalidatePath('/dashboard/students');
  return { success: true, count: dataToInsert.length };
}
