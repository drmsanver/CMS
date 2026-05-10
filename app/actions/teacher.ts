"use server"

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function getTeachers(filters?: { campusId?: string; schoolId?: string }) {
  const session = await getServerSession(authOptions);
  const organizationId = (session?.user as any)?.organizationId;
  if (!organizationId) return [];

  const where: any = {
    organizationId,
    role: 'TEACHER'
  };

  if (filters?.campusId) where.campusId = filters.campusId;
  if (filters?.schoolId) where.schoolId = filters.schoolId;

  return await prisma.user.findMany({
    where,
    include: {
      campus: true,
      school: true,
      teacherBranch: true
    },
    orderBy: { name: 'asc' }
  });
}

export async function createTeacher(data: {
  name: string;
  email: string;
  phone?: string;
  photo?: string;
  campusId: string;
  schoolId: string;
  teacherBranchId?: string;
}) {
  const session = await getServerSession(authOptions);
  const organizationId = (session?.user as any)?.organizationId;
  const currentRole = (session?.user as any)?.role;

  // Authorization: SUPER_ADMIN, ORG_ADMIN, COORDINATOR, or PRINCIPAL (if in same campus/school)
  if (!['SUPER_ADMIN', 'ORG_ADMIN', 'COORDINATOR', 'PRINCIPAL'].includes(currentRole)) {
    throw new Error("Unauthorized.");
  }

  if (!organizationId) throw new Error("No organization associated.");

  // Default password is "School123!"
  const passwordHash = await bcrypt.hash("School123!", 10);

  const teacher = await prisma.user.create({
    data: {
      ...data,
      organizationId,
      role: 'TEACHER',
      passwordHash
    }
  });

  revalidatePath('/dashboard/teachers');
  return teacher;
}

export const addTeacher = createTeacher;


export async function importTeachers(teachers: any[]) {
  const session = await getServerSession(authOptions);
  const organizationId = (session?.user as any)?.organizationId;
  if (!organizationId) throw new Error("Unauthorized.");

  const passwordHash = await bcrypt.hash("School123!", 10);

  const results = {
    created: 0,
    errors: [] as string[]
  };

  for (const t of teachers) {
    try {
      await prisma.user.create({
        data: {
          name: t.name,
          email: t.email,
          phone: t.phone,
          campusId: t.campusId,
          schoolId: t.schoolId,
          teacherBranchId: t.teacherBranchId,
          organizationId,
          role: 'TEACHER',
          passwordHash
        }
      });
      results.created++;
    } catch (err: any) {
      results.errors.push(`Failed for ${t.email}: ${err.message}`);
    }
  }

  revalidatePath('/dashboard/teachers');
  return results;
}

export async function updateTeacher(id: string, data: {
  name?: string;
  email?: string;
  phone?: string;
  photo?: string;
  campusId?: string;
  schoolId?: string;
  teacherBranchId?: string;
}) {
  const session = await getServerSession(authOptions);
  const currentRole = (session?.user as any)?.role;

  if (!['SUPER_ADMIN', 'ORG_ADMIN', 'COORDINATOR', 'PRINCIPAL'].includes(currentRole)) {
    throw new Error("Unauthorized.");
  }

  const teacher = await prisma.user.update({
    where: { id },
    data
  });

  revalidatePath('/dashboard/teachers');
  return teacher;
}

export async function deleteTeacher(id: string) {
  const session = await getServerSession(authOptions);
  const currentRole = (session?.user as any)?.role;

  if (!['SUPER_ADMIN', 'ORG_ADMIN', 'PRINCIPAL'].includes(currentRole)) {
    throw new Error("Unauthorized.");
  }

  await prisma.user.delete({ where: { id } });
  revalidatePath('/dashboard/teachers');
  return { success: true };
}
