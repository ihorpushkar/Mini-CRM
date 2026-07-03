import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Clean existing data
  await prisma.task.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const adminPassword = await hashPassword('admin123');
  const userPassword = await hashPassword('user123');

  const admin = await prisma.user.create({
    data: {
      email: 'admin@test.com',
      password: adminPassword,
      role: 'admin',
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      email: 'user@test.com',
      password: userPassword,
      role: 'user',
    },
  });

  console.log('Created users:', { admin: admin.email, user: regularUser.email });

  // Create clients
  const client1 = await prisma.client.create({
    data: {
      name: 'Acme Corporation',
      email: 'contact@acme.com',
      phone: '+1-555-0100',
      createdBy: admin.id,
    },
  });

  const client2 = await prisma.client.create({
    data: {
      name: 'Tech Solutions Inc',
      email: 'info@techsolutions.com',
      phone: '+1-555-0200',
      createdBy: regularUser.id,
    },
  });

  const client3 = await prisma.client.create({
    data: {
      name: 'Global Services Ltd',
      email: 'hello@globalservices.com',
      phone: '+1-555-0300',
      createdBy: admin.id,
    },
  });

  console.log('Created clients:', [client1.name, client2.name, client3.name]);

  // Create tasks
  const task1 = await prisma.task.create({
    data: {
      title: 'Initial consultation meeting',
      description: 'Schedule and conduct initial consultation with client',
      status: 'completed',
      clientId: client1.id,
      assignedTo: admin.id,
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: 'Prepare project proposal',
      description: 'Draft and send project proposal to client',
      status: 'pending',
      clientId: client1.id,
      assignedTo: regularUser.id,
    },
  });

  const task3 = await prisma.task.create({
    data: {
      title: 'Follow up on contract',
      description: 'Contact client regarding contract signing',
      status: 'pending',
      clientId: client2.id,
      assignedTo: admin.id,
    },
  });

  const task4 = await prisma.task.create({
    data: {
      title: 'Technical assessment',
      description: 'Perform technical assessment of client requirements',
      status: 'completed',
      clientId: client2.id,
      assignedTo: regularUser.id,
    },
  });

  const task5 = await prisma.task.create({
    data: {
      title: 'Quarterly review',
      description: 'Schedule quarterly business review',
      status: 'pending',
      clientId: client3.id,
      assignedTo: admin.id,
    },
  });

  console.log('Created tasks:', [task1.title, task2.title, task3.title, task4.title, task5.title]);

  console.log('Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
