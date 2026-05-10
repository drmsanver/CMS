"use server"

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getCampusTypes() {
  const session = await getServerSession(authOptions);
  const organizationId = (session?.user as any)?.organizationId;
  if (!organizationId) return [];

  const types = await prisma.defCampusType.findMany({
    where: { organizationId },
    orderBy: { name: 'asc' }
  });

  if (types.length === 0) {
    // Seed default types
    const defaults = ["Bağımsız", "Okul"];
    for (const name of defaults) {
      await prisma.defCampusType.create({
        data: { name, organizationId }
      });
    }
    // Update existing campuses to "Okul" by default
    const okulType = await prisma.defCampusType.findFirst({
      where: { name: "Okul", organizationId }
    });
    if (okulType) {
      await prisma.campus.updateMany({
        where: { organizationId, typeId: null },
        data: { typeId: okulType.id }
      });
    }
    return await prisma.defCampusType.findMany({
      where: { organizationId },
      orderBy: { name: 'asc' }
    });
  }

  return types;
}

export async function createCampusType(name: string) {
  const session = await getServerSession(authOptions);
  const organizationId = (session?.user as any)?.organizationId;
  const currentRole = (session?.user as any)?.role;

  if (!['SUPER_ADMIN', 'ORG_ADMIN'].includes(currentRole)) {
    throw new Error("Unauthorized.");
  }

  if (!organizationId) throw new Error("No organization associated.");

  const type = await prisma.defCampusType.create({
    data: { name, organizationId }
  });

  revalidatePath('/dashboard/campus-types');
  return type;
}

export async function updateCampusType(id: string, name: string) {
  const session = await getServerSession(authOptions);
  const currentRole = (session?.user as any)?.role;

  if (!['SUPER_ADMIN', 'ORG_ADMIN'].includes(currentRole)) {
    throw new Error("Unauthorized.");
  }

  await prisma.defCampusType.update({
    where: { id },
    data: { name }
  });

  revalidatePath('/dashboard/campus-types');
  return { success: true };
}

export async function deleteCampusType(id: string) {
  const session = await getServerSession(authOptions);
  const currentRole = (session?.user as any)?.role;

  if (!['SUPER_ADMIN', 'ORG_ADMIN'].includes(currentRole)) {
    throw new Error("Unauthorized.");
  }

  await prisma.defCampusType.delete({ where: { id } });

  revalidatePath('/dashboard/campus-types');
  return { success: true };
}
