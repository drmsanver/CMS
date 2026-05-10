"use server"

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function getAllUsers() {
  const session = await getServerSession(authOptions);
  const organizationId = (session?.user as any)?.organizationId;
  const currentRole = (session?.user as any)?.role;

  if (!['SUPER_ADMIN', 'ORG_ADMIN'].includes(currentRole)) {
    throw new Error("Unauthorized.");
  }

  return await prisma.user.findMany({
    where: { organizationId },
    include: {
      campus: true,
      school: true
    },
    orderBy: { name: 'asc' }
  });
}

export async function adminResetPassword(userId: string, newPassword?: string) {
  const session = await getServerSession(authOptions);
  const currentRole = (session?.user as any)?.role;

  if (!['SUPER_ADMIN', 'ORG_ADMIN'].includes(currentRole)) {
    throw new Error("Unauthorized.");
  }

  // If no password provided, use "School123!" as default
  const password = newPassword || "School123!";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash }
  });

  return { success: true, message: `Password reset to ${password}` };
}

export async function updateUserProfile(data: {
  userId: string;
  name?: string;
  phone?: string;
  photo?: string;
  isPhoneVerified?: boolean;
}) {
  const session = await getServerSession(authOptions);
  const currentUserId = (session?.user as any)?.id;
  const currentRole = (session?.user as any)?.role;

  // Users can update their own profile, or Admins can update any
  if (currentUserId !== data.userId && !['SUPER_ADMIN', 'ORG_ADMIN'].includes(currentRole)) {
    throw new Error("Unauthorized.");
  }

  await prisma.user.update({
    where: { id: data.userId },
    data: {
      name: data.name,
      phone: data.phone,
      photo: data.photo,
      isPhoneVerified: data.isPhoneVerified
    }
  });

  revalidatePath('/dashboard/profile');
  return { success: true };
}
