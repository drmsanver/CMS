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
