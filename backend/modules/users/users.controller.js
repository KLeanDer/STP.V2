import * as usersService from "./users.service.js";

export async function getAllUsers(req, res, next) {
  try {
    const users = await usersService.getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
}

export async function createUser(req, res, next) {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email, password required" });
    }
    const user = await usersService.createUser({ name, email, password, phone });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

// ✅ новый метод для обновления профиля
export async function updateProfile(req, res, next) {
  try {
    const userId = req.user.id; // authMiddleware добавляет user
    const { name, phone, about, avatarUrl } = req.body;

    const updated = await usersService.updateProfile(userId, {
      name,
      phone,
      about,
      avatarUrl,
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
}
