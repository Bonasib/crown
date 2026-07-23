import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const DEFAULT_SETTINGS: Record<string, string> = {
  default_language: 'ar',
  global_profit_percent: '20',
  stars_per_usd: '50',
  support_username: 'digyourownwhole',
  g2a_client_id: '',
  g2a_api_key: '',
  g2a_base_url: 'https://api.g2a.com',
};

async function main() {
  console.log('🌱 Seeding shop database...');

  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    await prisma.shopSetting.upsert({
      where: { key },
      update: {},
      create: { key, value },
    });
  }
  console.log(`  Seeded ${Object.keys(DEFAULT_SETTINGS).length} settings`);

  const adminUsername = process.env['SEED_ADMIN_USERNAME'] ?? 'admin';
  const adminPassword = process.env['SEED_ADMIN_PASSWORD'] ?? 'ChangeMe123!';
  await prisma.adminUser.upsert({
    where: { username: adminUsername },
    update: {},
    create: {
      username: adminUsername,
      passwordHash: await bcrypt.hash(adminPassword, 10),
      role: 'SUPER_ADMIN',
    },
  });
  console.log(`  Admin user ready: ${adminUsername} (change the password after first login)`);

  const category = await prisma.category.upsert({
    where: { id: 'demo-category' },
    update: {},
    create: {
      id: 'demo-category',
      nameAr: 'بطاقات هدايا',
      nameEn: 'Gift Cards',
      sortOrder: 0,
    },
  });

  await prisma.product.upsert({
    where: { id: 'demo-product' },
    update: {},
    create: {
      id: 'demo-product',
      categoryId: category.id,
      nameAr: 'مثال: بطاقة هدايا 10$',
      nameEn: 'Example: $10 Gift Card',
      descriptionAr: 'منتج تجريبي — عدّله أو احذفه من لوحة التحكم.',
      descriptionEn: 'Demo product — edit or delete it from the admin panel.',
      sourceType: 'MANUAL',
      costMinor: 900,
      deliveryType: 'TEXT',
      deliveryContent: 'This is a demo delivery message. Replace with real content or switch to KEYS/FILE delivery.',
    },
  });
  console.log('  Seeded demo category + product');

  console.log('✅ Shop database seeded.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
