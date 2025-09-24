import prisma from "../../core/db.js";

// 🔹 Получить все объявления (с фильтрами userId и status)
export async function getAllListings({ userId, status } = {}) {
  const where = {};

  if (userId) {
    where.userId = userId;
  }

  if (status && ["active", "inactive"].includes(status)) {
    where.status = status;
  } else if (!userId) {
    // Если фильтр не указан и это не профиль — показываем только активные
    where.status = "active";
  }

  return prisma.listing.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, email: true, avatarUrl: true } },
      images: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

// 🔹 Получить объявление по ID (показываем даже если inactive — владелец увидит)
export async function getListingById(id) {
  return prisma.listing.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, avatarUrl: true } },
      images: true,
    },
  });
}

// 🔹 Создать объявление
export async function createListing({ title, description, price, category, userId, images }) {
  return prisma.listing.create({
    data: {
      title,
      description,
      price: Number(price),
      category: category || "OTHER",
      status: "active", // новое всегда активно
      userId,
      images: {
        create: Array.isArray(images)
          ? images.filter(Boolean).map((url) => ({ url }))
          : [],
      },
    },
    include: {
      user: { select: { id: true, name: true, email: true, avatarUrl: true } },
      images: true,
    },
  });
}

// 🔹 Обновить объявление полностью
export async function updateListing(listingId, userId, { title, description, price, category, images }) {
  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing) return null;
  if (listing.userId !== userId) return null;

  return prisma.listing.update({
    where: { id: listingId },
    data: {
      title,
      description,
      price: price ? Number(price) : listing.price,
      category: category || listing.category,
      images: images
        ? {
            deleteMany: {}, // удаляем старые
            create: images.filter(Boolean).map((url) => ({ url })), // создаём новые
          }
        : undefined,
    },
    include: {
      user: { select: { id: true, name: true, email: true, avatarUrl: true } },
      images: true,
    },
  });
}

// 🔹 Обновить статус (active/inactive)
export async function updateStatus(listingId, userId, status) {
  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing) return null;
  if (listing.userId !== userId) return null;

  return prisma.listing.update({
    where: { id: listingId },
    data: { status },
    include: {
      user: { select: { id: true, name: true, email: true, avatarUrl: true } },
      images: true,
    },
  });
}

// 🔹 Получить объявления конкретного пользователя
export async function getUserListings(userId, status) {
  const where = { userId };

  if (status && ["active", "inactive"].includes(status)) {
    where.status = status;
  }

  return prisma.listing.findMany({
    where,
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });
}
