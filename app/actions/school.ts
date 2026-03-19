"use server"

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addSchool(data: {
  name: string;
  fullName?: string;
  shortName?: string;
  principalName?: string;
  address?: string;
  phoneNumbers: string[];
  logoUrl?: string;
  websiteUrl?: string;
  email?: string;
  socialMedia?: any;
  orderWeight?: number;
  images: string[];
  grades: string[];
}) {
  const session = await getServerSession(authOptions);
  const currentRole = (session?.user as any)?.role;
  const organizationId = (session?.user as any)?.organizationId;

  if (!['SUPER_ADMIN', 'ORG_ADMIN', 'PRINCIPAL'].includes(currentRole)) {
    throw new Error("Unauthorized.");
  }

  if (!organizationId) throw new Error("No organization associated.");

  await prisma.campus.create({
    data: {
      ...data,
      organizationId
    }
  });

  revalidatePath('/dashboard/schools');
  return { success: true };
}

export async function updateSchool(id: string, data: any) {
  const session = await getServerSession(authOptions);
  const currentRole = (session?.user as any)?.role;

  if (!['SUPER_ADMIN', 'ORG_ADMIN', 'PRINCIPAL'].includes(currentRole)) {
    throw new Error("Unauthorized.");
  }

  await prisma.campus.update({
    where: { id },
    data
  });

  revalidatePath('/dashboard/schools');
  return { success: true };
}

export async function deleteSchool(id: string) {
  const session = await getServerSession(authOptions);
  const currentRole = (session?.user as any)?.role;

  if (!['SUPER_ADMIN', 'ORG_ADMIN', 'PRINCIPAL'].includes(currentRole)) {
    throw new Error("Unauthorized.");
  }

  await prisma.campus.delete({ where: { id } });

  revalidatePath('/dashboard/schools');
  return { success: true };
}
