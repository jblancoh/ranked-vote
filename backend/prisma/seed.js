/**
 * Seed script for Ranked Vote - Multi-Tenant Version
 * Creates default tenant and migrates existing data
 */

import { PrismaClient } from '@prisma/client';

// Create a Prisma client WITHOUT middleware for seeding
// This bypasses tenant filtering to allow direct database operations
const prisma = new PrismaClient({
  log: ['error', 'warn']
});

async function main() {
  console.log('🌱 Starting seed...\n');

  // ============================================
  // 1. Create Default Tenant
  // ============================================

  console.log('📦 Creating default tenant...');

  const defaultTenant = await prisma.tenant.upsert({
    where: { slug: 'default' },
    update: {},
    create: {
      slug: 'default',
      name: 'Flor de Tabasco 2026',
      subdomain: null,
      logoUrl: null,
      primaryColor: '#dc2626',
      secondaryColor: '#f97316',
      active: true,
      config: {
        voting: {
          positions: 5,
          pointsSystem: {
            '1st': 5,
            '2nd': 4,
            '3rd': 3,
            '4th': 2,
            '5th': 1
          },
          allowDuplicates: false,
          ipValidation: true,
          emailVerification: false,
          requireVoterName: true
        },
        candidates: {
          requiredFields: ['name', 'municipality'],
          customFields: []
        },
        branding: {
          eventTitle: 'Certamen Flor de Tabasco 2026',
          description: 'Vota por tu candidata favorita para representar a Tabasco',
          logoUrl: null
        },
        features: {
          publicResults: true,
          anonymousVoting: true,
          realTimeResults: true,
          allowRevote: false
        }
      }
    }
  });

  console.log(`✅ Created tenant: ${defaultTenant.name} (${defaultTenant.slug})\n`);

  // ============================================
  // 2. Migrate Existing Data (if any)
  // ============================================

  console.log('🔄 Checking for existing data to migrate...');

  try {
    // Check if there's data without tenantId
    const candidatesWithoutTenant = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM candidates
      WHERE "tenantId" IS NULL
    `;

    const votesWithoutTenant = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM votes
      WHERE "tenantId" IS NULL
    `;

    const eventsWithoutTenant = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM events
      WHERE "tenantId" IS NULL
    `;

    const resultsWithoutTenant = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM results
      WHERE "tenantId" IS NULL
    `;

    const candidatesCount = Number(candidatesWithoutTenant[0]?.count || 0);
    const votesCount = Number(votesWithoutTenant[0]?.count || 0);
    const eventsCount = Number(eventsWithoutTenant[0]?.count || 0);
    const resultsCount = Number(resultsWithoutTenant[0]?.count || 0);

    if (candidatesCount > 0 || votesCount > 0 || eventsCount > 0 || resultsCount > 0) {
      console.log(`Found data to migrate:`);
      console.log(`  - Candidates: ${candidatesCount}`);
      console.log(`  - Votes: ${votesCount}`);
      console.log(`  - Events: ${eventsCount}`);
      console.log(`  - Results: ${resultsCount}\n`);

      console.log('🔧 Migrating existing data to default tenant...');

      // Migrate candidates
      if (candidatesCount > 0) {
        await prisma.$executeRaw`
          UPDATE candidates
          SET "tenantId" = ${defaultTenant.id}
          WHERE "tenantId" IS NULL
        `;
        console.log(`✅ Migrated ${candidatesCount} candidates`);
      }

      // Migrate votes
      if (votesCount > 0) {
        await prisma.$executeRaw`
          UPDATE votes
          SET "tenantId" = ${defaultTenant.id}
          WHERE "tenantId" IS NULL
        `;
        console.log(`✅ Migrated ${votesCount} votes`);
      }

      // Migrate events
      if (eventsCount > 0) {
        await prisma.$executeRaw`
          UPDATE events
          SET "tenantId" = ${defaultTenant.id}
          WHERE "tenantId" IS NULL
        `;
        console.log(`✅ Migrated ${eventsCount} events`);
      }

      // Migrate results
      if (resultsCount > 0) {
        await prisma.$executeRaw`
          UPDATE results
          SET "tenantId" = ${defaultTenant.id}
          WHERE "tenantId" IS NULL
        `;
        console.log(`✅ Migrated ${resultsCount} results`);
      }

      console.log('\n✅ Data migration complete!\n');
    } else {
      console.log('ℹ️  No existing data to migrate.\n');
    }
  } catch (error) {
    console.log('ℹ️  No existing data (fresh install).\n');
  }

  // ============================================
  // 3. Create Sample Candidates
  // ============================================

  const existingCandidates = await prisma.candidate.count({
    where: { tenantId: defaultTenant.id }
  });

  if (existingCandidates === 0) {
    console.log('📝 Creating sample candidates...');

    const municipalities = [
      'Centro', 'Cárdenas', 'Comalcalco', 'Huimanguillo',
      'Macuspana', 'Nacajuca', 'Paraíso', 'Tacotalpa',
      'Teapa', 'Jalpa de Méndez', 'Cunduacán', 'Balancán',
      'Centla', 'Emiliano Zapata', 'Jalapa', 'Jonuta', 'Tenosique'
    ];

    for (let i = 0; i < municipalities.length; i++) {
      await prisma.candidate.create({
        data: {
          tenantId: defaultTenant.id,
          name: `Embajadora ${municipalities[i]}`,
          municipality: municipalities[i],
          bio: `Representante del municipio de ${municipalities[i]}`,
          order: i + 1,
          active: true
        }
      });
    }

    console.log(`✅ Created ${municipalities.length} sample candidates\n`);
  }

  // ============================================
  // 4. Create Default Event
  // ============================================

  const existingEvent = await prisma.event.findFirst({
    where: { tenantId: defaultTenant.id }
  });

  if (!existingEvent) {
    console.log('📅 Creating default event...');

    await prisma.event.create({
      data: {
        tenantId: defaultTenant.id,
        name: 'Certamen Flor de Tabasco 2026',
        description: 'Elección de la representante floral de Tabasco',
        startDate: new Date('2026-04-01T00:00:00Z'),
        endDate: new Date('2026-04-30T23:59:59Z'),
        active: true,
        votingOpen: true
      }
    });

    console.log('✅ Created default event\n');
  }

  // ============================================
  // Summary
  // ============================================

  console.log('📊 Final Summary:');
  console.log(`  Tenant: ${defaultTenant.name}`);
  console.log(`  Candidates: ${await prisma.candidate.count({ where: { tenantId: defaultTenant.id } })}`);
  console.log(`  Votes: ${await prisma.vote.count({ where: { tenantId: defaultTenant.id } })}`);
  console.log(`  Events: ${await prisma.event.count({ where: { tenantId: defaultTenant.id } })}`);
  console.log('\n🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('\n❌ Seed failed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
