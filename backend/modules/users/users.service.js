import prisma from "../../core/db.js";

export async function getAllUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
    },
  });
}

export async function createUser({ name, email, password, phone }) {
  return prisma.user.create({
    data: {
      name,
      email,
      password, // TODO: позже обернем в bcrypt.hash
      phone: phone ?? null,
    },
  });
}

// ✅ новый метод для редактирования профиля
export async function updateProfile(userId, { name, phone, about, avatarUrl }) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      name,
      phone,
      about,
      avatarUrl,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      about: true,
      avatarUrl: true,
      createdAt: true,
    },
  });
}
