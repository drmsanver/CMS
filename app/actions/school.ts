"use server"

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createSchool(data: {
  campusId: string;
  name: string;
  principalName?: string;
  principalPhoto?: string;
  principalPhone1?: string;
  principalPhone2?: string;
  address?: string;
  logoUrl?: string;
  capacity?: number;
  classroomCount?: number;
  gradeLevels: string[];
  orderWeight?: number;
}) {
  const session = await getServerSession(authOptions);
  const currentRole = (session?.user as any)?.role;

  if (!['SUPER_ADMIN', 'ORG_ADMIN', 'COORDINATOR'].includes(currentRole)) {
    throw new Error("Unauthorized.");
  }

  await prisma.school.create({
    data: {
      ...data,
      capacity: data.capacity ? Number(data.capacity) : undefined,
      classroomCount: data.classroomCount ? Number(data.classroomCount) : undefined,
    }
  });

  revalidatePath('/dashboard/school-units');
  return { success: true };
}

export async function updateSchool(id: string, data: any) {
  const session = await getServerSession(authOptions);
  const currentRole = (session?.user as any)?.role;

  if (!['SUPER_ADMIN', 'ORG_ADMIN', 'COORDINATOR'].includes(currentRole)) {
    throw new Error("Unauthorized.");
  }

  const { id: _, campusId: __, ...updateData } = data;

  await prisma.school.update({
    where: { id },
    data: {
      ...updateData,
      capacity: updateData.capacity ? Number(updateData.capacity) : undefined,
      classroomCount: updateData.classroomCount ? Number(updateData.classroomCount) : undefined,
    }
  });

  revalidatePath('/dashboard/school-units');
  return { success: true };
}

export async function deleteSchool(id: string) {
  const session = await getServerSession(authOptions);
  const currentRole = (session?.user as any)?.role;

  if (!['SUPER_ADMIN', 'ORG_ADMIN', 'COORDINATOR'].includes(currentRole)) {
    throw new Error("Unauthorized.");
  }

  await prisma.school.delete({ where: { id } });

  revalidatePath('/dashboard/school-units');
  return { success: true };
}
