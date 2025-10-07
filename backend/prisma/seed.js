import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Crear un evento
  const event = await prisma.event.create({
    data: {
      name: 'Flor de Tabasco 2025',
      description: 'Elección de la Flor de Tabasco 2025',
      startDate: new Date('2025-04-01T00:00:00Z'),
      endDate: new Date('2025-04-30T23:59:59Z'),
      active: true,
      votingOpen: true,
    },
  });

  console.log(`Created event: ${event.name}`);

  // 2. Crear candidatas
  const municipalities = [
    'Centro', 'Cárdenas', 'Comalcalco', 'Huimanguillo',
    'Macuspana', 'Nacajuca', 'Paraíso', 'Tacotalpa',
    'Teapa', 'Jalpa de Méndez', 'Cunduacán', 'Balancán',
    'Centla', 'Emiliano Zapata', 'Jalapa', 'Jonuta', 'Tenosique'
  ];

  for (let i = 0; i < municipalities.length; i++) {
    await prisma.candidate.create({
      data: {
        name: `Embajadora ${municipalities[i]}`,
        municipality: municipalities[i],
        bio: `Representante del municipio de ${municipalities[i]}...`,
        order: i + 1,
        active: true,
      }
    });
  }

  console.log(`✅ Base de datos poblada con datos de ejemplo`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });