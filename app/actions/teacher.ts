"use server"

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function addTeacher(data: { name: string; email: string; passwordRaw: string }) {
  const session = await getServerSession(authOptions);
  
  const currentRole = (session?.user as any)?.role;
  if (!['SUPER_ADMIN', 'ORG_ADMIN', 'PRINCIPAL'].includes(currentRole)) {
    throw new Error("Unauthorized: Only Administrators can create new Teachers.");
  }

  const organizationId = (session?.user as any)?.organizationId;
  const campusId = (session?.user as any)?.campusId;

  if (!organizationId) throw new Error("Unauthorized: No organization associated.");

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new Error("A user with this email already exists.");

  const hashed = await bcrypt.hash(data.passwordRaw, 10);

  await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash: hashed,
      role: 'TEACHER',
      organizationId,
      campusId
    }
  });

  revalidatePath('/dashboard/teachers');
  return { success: true };
}

export async function assignTeacherToClassroom(teacherId: string, classroomId: string | null) {
  const session = await getServerSession(authOptions);
  const currentRole = (session?.user as any)?.role;

  if (!['SUPER_ADMIN', 'ORG_ADMIN', 'PRINCIPAL'].includes(currentRole)) {
    throw new Error("Unauthorized.");
  }

  // Use a transaction to ensure 1:1 consistency if needed, 
  // but Prisma @unique + connect/disconnect handles much of this.
  
  // 1. First, if we are assigning to a new classroom, 
  // we should check if that classroom already has a different teacher 
  // (Prisma will throw if we try to connect a second teacher to a @unique field, 
  // but let's be explicit if we want to 'swap' or 'overwrite').
  
  // Actually, the simplest way to "assign teacher X to classroom Y":
  // Update classroom Y to have primaryTeacherId = X.
  // Because primaryTeacherId is @unique on Classroom, this ensures no two teachers share a class.
  // Because primaryClassroom is the inverse relation, a teacher can only have one.
  
  if (classroomId) {
    await prisma.classroom.update({
      where: { id: classroomId },
      data: { primaryTeacherId: teacherId }
    });
  } else {
    // If classroomId is null, we are "unassigning" the teacher from THEIR current classroom
    await prisma.classroom.updateMany({
      where: { primaryTeacherId: teacherId },
      data: { primaryTeacherId: null }
    });
  }

  revalidatePath('/dashboard/teachers');
  revalidatePath('/dashboard/classrooms');
  return { success: true };
}
