import prisma from "../../core/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function register({ name, email, password, phone }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("User already exists");
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashed, phone },
    select: { id: true, name: true, email: true, phone: true, createdAt: true },
  });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

  return { user, token };
}

export async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

  return { user: { id: user.id, name: user.name, email: user.email }, token };
}
