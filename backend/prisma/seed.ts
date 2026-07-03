import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password';

const prisma = new PrismaClient();

const userSelect = { id: true, email: true, role: true } as const;

async function main() {
  await prisma.task.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      email: 'admin@test.com',
      password: await hashPassword('admin123'),
      role: 'admin',
    },
    select: userSelect,
  });

  const user = await prisma.user.create({
    data: {
      email: 'user@test.com',
      password: await hashPassword('user123'),
      role: 'user',
    },
    select: userSelect,
  });

  const client1 = await prisma.client.create({
    data: {
      name: 'Acme Corp',
      email: 'contact@acme.com',
      phone: '+1234567890',
      createdBy: admin.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Setup meeting',
      description: 'Initial call with client',
      status: 'pending',
      clientId: client1.id,
      assignedTo: user.id,
    },
  });

  console.log('Seed data created');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
