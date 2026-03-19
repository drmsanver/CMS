"use server"

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createSemester(data: { name: string }) {
  const session = await getServerSession(authOptions);
  const campusId = (session?.user as any)?.campusId;
  const currentRole = (session?.user as any)?.role;

  if (!['SUPER_ADMIN', 'ORG_ADMIN', 'PRINCIPAL', 'COORDINATOR'].includes(currentRole)) {
    throw new Error("Unauthorized.");
  }
  if (!campusId) throw new Error("No campus associated.");

  await prisma.semester.create({
    data: {
      name: data.name,
      campusId,
    }
  });

  revalidatePath('/dashboard/semesters');
  return { success: true };
}

export async function deleteSemester(id: string) {
  const session = await getServerSession(authOptions);
  const currentRole = (session?.user as any)?.role;

  if (!['SUPER_ADMIN', 'ORG_ADMIN', 'PRINCIPAL', 'COORDINATOR'].includes(currentRole)) {
    throw new Error("Unauthorized.");
  }

  await prisma.semester.delete({ where: { id } });

  revalidatePath('/dashboard/semesters');
  return { success: true };
}
