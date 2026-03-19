import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  console.log("Starting DB seed...");

  // 1. Create Organization
  const org = await prisma.organization.upsert({
    where: { subdomain: 'demo-school' },
    update: {},
    create: {
      name: 'Demo School Network',
      subdomain: 'demo-school',
      campuses: {
        create: [
          {
            name: 'Main Campus',
            address: '123 Education Blvd'
          },
          {
            name: 'North Campus',
            address: '456 Northern Ave'
          }
        ]
      }
    }
  });

  const campuses = await prisma.campus.findMany({
    where: { organizationId: org.id }
  });
  
  const mainCampus = campuses.find(c => c.name === 'Main Campus')!;

  // 2. Create Admin User
  const passwordHash = await bcrypt.hash('password123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@school.com' },
    update: {},
    create: {
      email: 'admin@school.com',
      name: 'System Administrator',
      passwordHash,
      role: 'SUPER_ADMIN',
      organizationId: org.id,
      campusId: mainCampus.id
    }
  });

  // Create Counselor User
  const counselorUser = await prisma.user.upsert({
    where: { email: 'counselor@school.com' },
    update: {},
    create: {
      email: 'counselor@school.com',
      name: 'Jane Counselor',
      passwordHash: await bcrypt.hash('counselor123', 10),
      role: 'COUNSELOR',
      organizationId: org.id,
      campusId: mainCampus.id
    }
  });

  // 3. Create Sample Students
  const students = [
    { studentNumber: 'STU001', firstName: 'Ahmet', lastName: 'Yilmaz', gradeLevel: '9' },
    { studentNumber: 'STU002', firstName: 'Ayse', lastName: 'Kaya', gradeLevel: '10' },
    { studentNumber: 'STU003', firstName: 'Mehmet', lastName: 'Demir', gradeLevel: '11' }
  ];

  for (const s of students) {
    await prisma.student.upsert({
      where: { studentNumber: s.studentNumber },
      update: {},
      create: {
        ...s,
        campusId: mainCampus.id
      }
    });
  }

  // 4. Create Sample Tasks
  await prisma.task.create({
    data: {
      title: 'Review Ahmet Yilmaz 1st Term Progress',
      description: 'Prepare notes for parent meeting regarding the math scores.',
      assignedToId: counselorUser.id,
      createdById: adminUser.id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
      status: 'PENDING'
    }
  });

  console.log("Seeding complete. Use admin@school.com / password123 to login.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
