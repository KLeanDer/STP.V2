import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';
import { categoriesSeed } from './seed-data/categories';

const prisma = new PrismaClient();

function buildSubcategories(categorySlug: string, groupSlug: string, groupName: string, sub?: { slug: string; name: string; description?: string }[]) {
  const items: { slug: string; name: string; description?: string }[] = [];

  // базовий рівень (група як окрема підкатегорія)
  items.push({
    slug: `${categorySlug}-${groupSlug}`,
    name: groupName,
  });

  if (Array.isArray(sub)) {
    for (const nested of sub) {
      items.push({
        slug: `${categorySlug}-${groupSlug}-${nested.slug}`,
        name: `${groupName} · ${nested.name}`,
        description: nested.description,
      });
    }
  }

  return items;
}

async function seedCategories() {
  await prisma.subcategory.deleteMany();
  await prisma.category.deleteMany();

  for (const category of categoriesSeed) {
    const subcategories = category.groups.flatMap((group) =>
      buildSubcategories(category.slug, group.slug, group.name, group.sub),
    );

    await prisma.category.create({
      data: {
        name: category.name,
        slug: category.slug,
        description: category.description ?? null,
        subcategories: {
          create: subcategories.map((sub) => ({
            name: sub.name,
            slug: sub.slug,
            description: sub.description ?? null,
          })),
        },
      },
    });
  }
}

async function seedSampleListings() {
  const passwordHash = hashSync('stp-demo', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@stp.local' },
    update: {},
    create: {
      name: 'STP Demo Seller',
      email: 'demo@stp.local',
      password: passwordHash,
      avatarUrl: 'https://i.pravatar.cc/150?img=12',
      phone: '+380501234567',
      about: 'Демо-продавець маркетплейсу STP.',
    },
  });

  await prisma.listing.deleteMany();

  const categories = await prisma.category.findMany({ include: { subcategories: true } });
  const findBySlug = (slug: string) => {
    for (const category of categories) {
      const match = category.subcategories.find((sub) => sub.slug === slug);
      if (match) {
        return { categoryId: category.id, subcategoryId: match.id };
      }
    }
    return null;
  };

  const samples = [
    {
      title: 'Apple iPhone 14 Pro 256GB Deep Purple',
      description:
        'Оригінальний iPhone 14 Pro у кольорі Deep Purple. У комплекті коробка та зарядний кабель. Стан як новий, без подряпин.',
      price: 42000,
      subSlug: 'electronics-phones-iphone',
      city: 'Київ',
      condition: 'used_like_new',
      isOriginal: true,
      deliveryAvailable: true,
      images: [
        'https://images.unsplash.com/photo-1661961110671-5b0192124b51?auto=format&fit=crop&w=900&q=80',
      ],
    },
    {
      title: 'Електровелосипед Cube Kathmandu Hybrid',
      description:
        'Touring-електровелосипед із запасом ходу до 120 км. Повністю обслужений, у комплекті зарядний блок та багажник.',
      price: 68500,
      subSlug: 'sports-bikes',
      city: 'Львів',
      condition: 'used',
      isOriginal: true,
      deliveryAvailable: false,
      images: [
        'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=80',
      ],
    },
    {
      title: 'PlayStation 5 Digital Edition',
      description:
        'Консоль PlayStation 5 Digital Edition на 825 ГБ. Придбана у 2024 році, використана кілька разів. Додаю один геймпад DualSense.',
      price: 23500,
      subSlug: 'electronics-gaming-playstation',
      city: 'Одеса',
      condition: 'used_like_new',
      isOriginal: true,
      deliveryAvailable: true,
      images: [
        'https://images.unsplash.com/photo-1606813902914-0ffce72262b6?auto=format&fit=crop&w=900&q=80',
      ],
    },
    {
      title: 'Пуховик жіночий NorthFace 700-fill',
      description:
        'Легкий жіночий пуховик NorthFace розміру M. Дуже теплий, стан відмінний, без слідів носіння.',
      price: 7200,
      subSlug: 'fashion-women-jackets',
      city: 'Харків',
      condition: 'used_like_new',
      isOriginal: true,
      deliveryAvailable: true,
      images: [
        'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=900&q=80',
      ],
    },
  ];

  for (const sample of samples) {
    const mapping =
      findBySlug(sample.subSlug) ||
      findBySlug(sample.subSlug.split('-').slice(0, 2).join('-'));

    if (!mapping) {
      console.warn(`⚠️  Не вдалося знайти підкатегорію для ${sample.subSlug}`);
      continue;
    }

    await prisma.listing.create({
      data: {
        title: sample.title,
        description: sample.description,
        price: sample.price,
        categoryId: mapping.categoryId,
        subcategoryId: mapping.subcategoryId,
        city: sample.city,
        condition: sample.condition,
        isOriginal: sample.isOriginal,
        deliveryAvailable: sample.deliveryAvailable,
        userId: demoUser.id,
        images: {
          create: sample.images.map((url) => ({ url })),
        },
      },
    });
  }
}

async function main() {
  try {
    await prisma.listingAttributeValue.deleteMany();
    await prisma.image.deleteMany();
    await prisma.listingView.deleteMany();
    await prisma.favorite.deleteMany();
    await prisma.listing.deleteMany();
    await prisma.subcategoryAttribute.deleteMany();
    await prisma.attributeDefinition.deleteMany();

    await seedCategories();
    await seedSampleListings();
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
