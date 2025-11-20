import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  const tenant = await prisma.tenant.upsert({
    where: { slug: 'demo-state' },
    update: {},
    create: {
      name: 'Demo State Agency',
      slug: 'demo-state',
    },
  });

  console.log('Created tenant:', tenant.name);

  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { 
      tenantId_email: {
        tenantId: tenant.id,
        email: 'admin@demo.gov',
      }
    },
    update: {},
    create: {
      tenantId: tenant.id,
      role: 'admin',
      email: 'admin@demo.gov',
      name: 'Admin User',
      password: hashedPassword,
      isActive: true,
    },
  });

  console.log('Created admin user:', adminUser.email);

  const caseWorkerPassword = await bcrypt.hash('caseworker123', 10);
  const caseWorker = await prisma.user.upsert({
    where: { 
      tenantId_email: {
        tenantId: tenant.id,
        email: 'caseworker@demo.gov',
      }
    },
    update: {},
    create: {
      tenantId: tenant.id,
      role: 'case_worker',
      email: 'caseworker@demo.gov',
      name: 'Case Worker',
      password: caseWorkerPassword,
      isActive: true,
    },
  });

  console.log('Created case worker user:', caseWorker.email);

  const beneficiaries = [
    {
      medicaidId: 'MED001',
      firstName: 'John',
      lastName: 'Smith',
      dateOfBirth: '1985-03-15',
      phone: '5555550101',
      email: 'john.smith@example.com',
      engagementStatus: 'active',
    },
    {
      medicaidId: 'MED002',
      firstName: 'Jane',
      lastName: 'Doe',
      dateOfBirth: '1990-07-22',
      phone: '5555550102',
      email: 'jane.doe@example.com',
      engagementStatus: 'active',
    },
    {
      medicaidId: 'MED003',
      firstName: 'Robert',
      lastName: 'Johnson',
      dateOfBirth: '1978-11-30',
      phone: '5555550103',
      email: 'robert.johnson@example.com',
      engagementStatus: 'non_compliant',
    },
    {
      medicaidId: 'MED004',
      firstName: 'Maria',
      lastName: 'Garcia',
      dateOfBirth: '1995-05-18',
      phone: '5555550104',
      email: 'maria.garcia@example.com',
      engagementStatus: 'exempt',
    },
    {
      medicaidId: 'MED005',
      firstName: 'Michael',
      lastName: 'Williams',
      dateOfBirth: '1982-09-08',
      phone: '5555550105',
      email: 'michael.williams@example.com',
      engagementStatus: 'active',
    },
    {
      medicaidId: 'MED006',
      firstName: 'Sarah',
      lastName: 'Brown',
      dateOfBirth: '1988-12-25',
      phone: '5555550106',
      email: 'sarah.brown@example.com',
      engagementStatus: 'unknown',
    },
    {
      medicaidId: 'MED007',
      firstName: 'David',
      lastName: 'Martinez',
      dateOfBirth: '1975-04-14',
      phone: '5555550107',
      email: 'david.martinez@example.com',
      engagementStatus: 'active',
    },
    {
      medicaidId: 'MED008',
      firstName: 'Lisa',
      lastName: 'Anderson',
      dateOfBirth: '1992-08-03',
      phone: '5555550108',
      email: 'lisa.anderson@example.com',
      engagementStatus: 'non_compliant',
    },
  ];

  for (const beneficiary of beneficiaries) {
    await prisma.beneficiary.upsert({
      where: {
        tenantId_medicaidId: {
          tenantId: tenant.id,
          medicaidId: beneficiary.medicaidId,
        },
      },
      update: {},
      create: {
        ...beneficiary,
        tenantId: tenant.id,
      },
    });
  }

  console.log(`Created ${beneficiaries.length} beneficiaries`);
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
