"use server"

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createActivityType(name: string) {
  const session = await getServerSession(authOptions);
  const campusId = (session?.user as any)?.campusId;
  const currentRole = (session?.user as any)?.role;

  if (!['SUPER_ADMIN', 'ORG_ADMIN', 'PRINCIPAL', 'COORDINATOR'].includes(currentRole)) {
    throw new Error("Unauthorized.");
  }
  if (!campusId) throw new Error("No campus associated.");

  await prisma.activityType.create({
    data: { name, campusId }
  });

  revalidatePath('/dashboard/coordinator-tasks');
  return { success: true };
}

export async function createParticipant(name: string) {
  const session = await getServerSession(authOptions);
  const campusId = (session?.user as any)?.campusId;
  const currentRole = (session?.user as any)?.role;

  if (!['SUPER_ADMIN', 'ORG_ADMIN', 'PRINCIPAL', 'COORDINATOR'].includes(currentRole)) {
    throw new Error("Unauthorized.");
  }
  if (!campusId) throw new Error("No campus associated.");

  await prisma.participant.create({
    data: { name, campusId }
  });

  revalidatePath('/dashboard/coordinator-tasks');
  return { success: true };
}
