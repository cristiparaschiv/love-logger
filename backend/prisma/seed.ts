import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Get passwords from environment or use defaults
  const hePass = process.env.HE_PASSWORD || 'he123';
  const shePass = process.env.SHE_PASSWORD || 'she123';

  // Hash passwords
  const hePassword = await bcrypt.hash(hePass, 12);
  const shePassword = await bcrypt.hash(shePass, 12);

  // Create users
  const he = await prisma.user.upsert({
    where: { username: 'he' },
    update: {},
    create: {
      username: 'he',
      passwordHash: hePassword,
    },
  });

  const she = await prisma.user.upsert({
    where: { username: 'she' },
    update: {},
    create: {
      username: 'she',
      passwordHash: shePassword,
    },
  });

  // Initialize score
  await prisma.score.upsert({
    where: { id: 'default-score' },
    update: {},
    create: {
      id: 'default-score',
      heScore: 0,
      sheScore: 0,
    },
  });

  console.log('Seeding complete!');
  console.log('Created users:');
  console.log(`  - Username: he, Password: ${process.env.HE_PASSWORD ? '(from HE_PASSWORD env)' : 'he123 (default)'}`);
  console.log(`  - Username: she, Password: ${process.env.SHE_PASSWORD ? '(from SHE_PASSWORD env)' : 'she123 (default)'}`);
  console.log('Created initial score entry');

  if (!process.env.HE_PASSWORD || !process.env.SHE_PASSWORD) {
    console.log('\n⚠️  Using default passwords! Change them with:');
    console.log('   npm run change-password');
  }
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
