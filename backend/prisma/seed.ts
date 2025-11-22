import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create demo tenant
  const demoTenant = await prisma.tenant.upsert({
    where: { slug: 'demo' },
    update: {},
    create: {
      name: 'Demo Health Department',
      slug: 'demo',
    },
  });

  console.log('✅ Created tenant:', demoTenant.name);

  // Create admin user
  const hashedAdminPassword = await bcrypt.hash('Admin123!', 10);
  const adminUser = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: demoTenant.id,
        email: 'admin@demo.com'
      }
    },
    update: {},
    create: {
      tenantId: demoTenant.id,
      email: 'admin@demo.com',
      password: hashedAdminPassword,
      name: 'Admin User',
      role: 'admin',
      isActive: true,
    },
  });

  console.log('✅ Created admin user:', adminUser.email);

  // Create case worker
  const hashedWorkerPassword = await bcrypt.hash('Worker123!', 10);
  const caseWorker = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: demoTenant.id,
        email: 'worker@demo.com'
      }
    },
    update: {},
    create: {
      tenantId: demoTenant.id,
      email: 'worker@demo.com',
      password: hashedWorkerPassword,
      name: 'Case Worker',
      role: 'case_worker',
      isActive: true,
    },
  });

  console.log('✅ Created case worker:', caseWorker.email);

  // Create sample beneficiaries
  await prisma.beneficiary.upsert({
    where: {
      tenantId_medicaidId: {
        tenantId: demoTenant.id,
        medicaidId: 'MCD-001-2024'
      }
    },
    update: {},
    create: {
      tenantId: demoTenant.id,
      medicaidId: 'MCD-001-2024',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1985-06-15',
      email: 'john.doe@example.com',
      phone: '555-555-0101',
      engagementStatus: 'pending_verification',
    },
  });

  await prisma.beneficiary.upsert({
    where: {
      tenantId_medicaidId: {
        tenantId: demoTenant.id,
        medicaidId: 'MCD-002-2024'
      }
    },
    update: {},
    create: {
      tenantId: demoTenant.id,
      medicaidId: 'MCD-002-2024',
      firstName: 'Jane',
      lastName: 'Smith',
      dateOfBirth: '1990-03-22',
      email: 'jane.smith@example.com',
      phone: '555-555-0102',
      engagementStatus: 'verified',
    },
  });

  await prisma.beneficiary.upsert({
    where: {
      tenantId_medicaidId: {
        tenantId: demoTenant.id,
        medicaidId: 'MCD-003-2024'
      }
    },
    update: {},
    create: {
      tenantId: demoTenant.id,
      medicaidId: 'MCD-003-2024',
      firstName: 'Robert',
      lastName: 'Johnson',
      dateOfBirth: '1978-11-30',
      email: 'robert.johnson@example.com',
      phone: '555-555-0103',
      engagementStatus: 'not_engaged',
    },
  });

  console.log('✅ Created 3 sample beneficiaries');

  console.log('\n' + '='.repeat(60));
  console.log('📋 DEMO CREDENTIALS');
  console.log('='.repeat(60));
  console.log('\n🔑 Admin Portal Login:');
  console.log('   Email:    admin@demo.com');
  console.log('   Password: Admin123!');
  console.log('\n🔑 Case Worker Login:');
  console.log('   Email:    worker@demo.com');
  console.log('   Password: Worker123!');
  console.log('\n📱 Member Portal Login:');
  console.log('   Phone:    555-555-0101 (John Doe)');
  console.log('   Phone:    555-555-0102 (Jane Smith)');
  console.log('   Phone:    555-555-0103 (Robert Johnson)');
  console.log('   Code:     123456 (for all members)');
  console.log('\n📊 Sample Data:');
  console.log('   Tenants:       1');
  console.log('   Users:         2');
  console.log('   Beneficiaries: 3');
  console.log('\n' + '='.repeat(60));
  console.log('🎉 Seed completed successfully!');
  console.log('='.repeat(60) + '\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
