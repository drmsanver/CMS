"use server"

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const DEFAULT_BRANCHES = [
  "Sınıf", "Değerler", "Rehberlik", "Edebiyat", "Türkçe", "Matematik", "Fen", 
  "Fizik", "Kimya", "Biyoloji", "Din Kültürü", "Ahlak Bilgisi", 
  "YDil-İngilizce", "Ydil-Fransızca", "Ydil-Almanca", "YDil-Arapça", 
  "Coğrafya", "Tarih", "İnkılap Tarihi", "Sosyoloji", "Psikoloji"
];

export async function getTeacherBranches() {
  const session = await getServerSession(authOptions);
  const organizationId = (session?.user as any)?.organizationId;
  if (!organizationId) return [];

  const branches = await prisma.defTeacherBranch.findMany({
    where: { organizationId },
    orderBy: { order: 'asc' }
  });

  if (branches.length === 0) {
    // Seed if empty
    const sorted = [...DEFAULT_BRANCHES].sort((a, b) => a.localeCompare(b, 'tr'));
    for (let i = 0; i < sorted.length; i++) {
      await prisma.defTeacherBranch.create({
        data: {
          name: sorted[i],
          order: i + 1,
          organizationId
        }
      });
    }
    return await prisma.defTeacherBranch.findMany({
      where: { organizationId },
      orderBy: { order: 'asc' }
    });
  }

  return branches;
}

export async function createTeacherBranch(name: string, order: number) {
  const session = await getServerSession(authOptions);
  const organizationId = (session?.user as any)?.organizationId;
  const currentRole = (session?.user as any)?.role;

  if (!['SUPER_ADMIN', 'ORG_ADMIN'].includes(currentRole)) {
    throw new Error("Unauthorized.");
  }

  if (!organizationId) throw new Error("No organization associated.");

  const branch = await prisma.defTeacherBranch.create({
    data: { name, order, organizationId }
  });

  revalidatePath('/dashboard/teacher-branches');
  return branch;
}

export async function updateTeacherBranch(id: string, data: { name?: string, order?: number }) {
  const session = await getServerSession(authOptions);
  const currentRole = (session?.user as any)?.role;

  if (!['SUPER_ADMIN', 'ORG_ADMIN'].includes(currentRole)) {
    throw new Error("Unauthorized.");
  }

  await prisma.defTeacherBranch.update({
    where: { id },
    data
  });

  revalidatePath('/dashboard/teacher-branches');
  return { success: true };
}

export async function deleteTeacherBranch(id: string) {
  const session = await getServerSession(authOptions);
  const currentRole = (session?.user as any)?.role;

  if (!['SUPER_ADMIN', 'ORG_ADMIN'].includes(currentRole)) {
    throw new Error("Unauthorized.");
  }

  await prisma.defTeacherBranch.delete({ where: { id } });

  revalidatePath('/dashboard/teacher-branches');
  return { success: true };
}
