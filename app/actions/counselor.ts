"use server"

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function addCounselor(data: { name: string, email: string, passwordRaw: string }) {
  const session = await getServerSession(authOptions);
  
  // We check if the current user has permission (Must be SUPER_ADMIN or ORG_ADMIN or PRINCIPAL)
  const currentRole = (session?.user as any)?.role;
  if (!['SUPER_ADMIN', 'ORG_ADMIN', 'PRINCIPAL'].includes(currentRole)) {
    throw new Error("Unauthorized: Only Administrators can create new Counselors.");
  }

  const organizationId = (session?.user as any)?.organizationId;
  const campusId = (session?.user as any)?.campusId;

  if (!organizationId) throw new Error("Unauthorized: No organization associated.");

  // Check if email already exists
  const existing = await prisma.user.findUnique({ where: { email: data.email }});
  if (existing) throw new Error("A user with this email already exists.");

  const hashed = await bcrypt.hash(data.passwordRaw, 10);

  await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash: hashed,
      role: 'COUNSELOR',
      organizationId,
      campusId // Assign to same campus as the creator admin, or leave null. We assume same campus here.
    }
  });

  revalidatePath('/dashboard/counselors');
  return { success: true };
}
