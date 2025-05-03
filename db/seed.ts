import { PrismaClient } from '@prisma/client';
import sampleData from './sample-data';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Clearing existing data...');
    await prisma.product.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.verificationToken.deleteMany();
    await prisma.user.deleteMany();

    console.log('Seeding products...');
    await prisma.product.createMany({ data: sampleData.products });

    console.log('Seeding users...');
    await prisma.user.createMany({ data: sampleData.users });

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding the database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
