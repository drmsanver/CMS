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
  if (!campusId) throw new Error("No campus assigned to user");

  await prisma.defActivityType.create({
    data: { name, campusId }
  });

  revalidatePath('/dashboard/infrastructure');
  return { success: true };
}

export async function createParticipant(name: string) {
  const session = await getServerSession(authOptions);
  const campusId = (session?.user as any)?.campusId;
  const currentRole = (session?.user as any)?.role;

  if (!['SUPER_ADMIN', 'ORG_ADMIN', 'PRINCIPAL', 'COORDINATOR'].includes(currentRole)) {
    throw new Error("Unauthorized.");
  }
  if (!campusId) throw new Error("No campus assigned to user");

  await prisma.defParticipant.create({
    data: { name, campusId }
  });

  revalidatePath('/dashboard/infrastructure');
  return { success: true };
}

export async function updateActivityType(id: string, name: string) {
  const session = await getServerSession(authOptions);
  const campusId = (session?.user as any)?.campusId;
  const currentRole = (session?.user as any)?.role;

  if (!['SUPER_ADMIN', 'ORG_ADMIN', 'PRINCIPAL', 'COORDINATOR'].includes(currentRole)) {
    throw new Error("Unauthorized.");
  }
  if (!campusId) throw new Error("No campus associated.");
  
  await prisma.defActivityType.update({
    where: { id },
    data: { name }
  });
  revalidatePath('/dashboard/coordinator-tasks');
  return { success: true };
}

export async function deleteActivityType(id: string) {
  const session = await getServerSession(authOptions);
  const campusId = (session?.user as any)?.campusId;
  const currentRole = (session?.user as any)?.role;

  if (!['SUPER_ADMIN', 'ORG_ADMIN', 'PRINCIPAL', 'COORDINATOR'].includes(currentRole)) {
    throw new Error("Unauthorized.");
  }
  if (!campusId) throw new Error("No campus associated.");
  
  await prisma.defActivityType.delete({
    where: { id }
  });
  revalidatePath('/dashboard/coordinator-tasks');
  return { success: true };
}

export async function updateParticipant(id: string, name: string) {
  const session = await getServerSession(authOptions);
  const campusId = (session?.user as any)?.campusId;
  const currentRole = (session?.user as any)?.role;

  if (!['SUPER_ADMIN', 'ORG_ADMIN', 'PRINCIPAL', 'COORDINATOR'].includes(currentRole)) {
    throw new Error("Unauthorized.");
  }
  if (!campusId) throw new Error("No campus associated.");
  
  await prisma.defParticipant.update({
    where: { id },
    data: { name }
  });
  revalidatePath('/dashboard/coordinator-tasks');
  return { success: true };
}

export async function deleteParticipant(id: string) {
  const session = await getServerSession(authOptions);
  const campusId = (session?.user as any)?.campusId;
  const currentRole = (session?.user as any)?.role;

  if (!['SUPER_ADMIN', 'ORG_ADMIN', 'PRINCIPAL', 'COORDINATOR'].includes(currentRole)) {
    throw new Error("Unauthorized.");
  }
  if (!campusId) throw new Error("No campus associated.");
  
  await prisma.defParticipant.delete({
    where: { id }
  });
  revalidatePath('/dashboard/coordinator-tasks');
  return { success: true };
}
