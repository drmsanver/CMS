import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const org = await prisma.organization.findFirst();
  if (!org) {
    console.error("No organization found.");
    return;
  }

  const types = ["Bağımsız", "Okul"];
  for (const name of types) {
    await prisma.defCampusType.upsert({
      where: { 
        // We don't have a unique constraint on name+orgId yet in schema,
        // but we can find unique if we had one.
        // For now, let's just find and create if missing.
        id: name + org.id 
      },
      update: {},
      create: {
        id: name + org.id,
        name,
        organizationId: org.id
      }
    });
    console.log(`Ensured Campus Type: ${name}`);
  }

  // Set existing campuses to "Okul"
  const okulType = await prisma.defCampusType.findFirst({
    where: { name: "Okul", organizationId: org.id }
  });

  if (okulType) {
    await prisma.campus.updateMany({
      where: { organizationId: org.id, typeId: null },
      data: { typeId: okulType.id }
    });
    console.log("Updated existing campuses to 'Okul' type.");
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
