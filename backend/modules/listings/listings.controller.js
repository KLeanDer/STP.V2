import * as listingsService from "./listings.service.js";

// 📌 Получить все объявления (с поддержкой фильтров userId + status)
export async function getAllListings(req, res, next) {
  try {
    const { userId, status } = req.query;

    const filters = {};
    if (userId) filters.userId = String(userId);
    if (status && ["active", "inactive"].includes(status)) {
      filters.status = status;
    }

    const listings = await listingsService.getAllListings(filters);
    res.json(listings);
  } catch (err) {
    next(err);
  }
}

// 📌 Получить объявление по ID
export async function getListingById(req, res, next) {
  try {
    const { id } = req.params;
    const listing = await listingsService.getListingById(id);

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    res.json(listing);
  } catch (err) {
    next(err);
  }
}

// 📌 Создать объявление
export async function createListing(req, res, next) {
  try {
    const { title, description, price, category, images } = req.body;
    const userId = req.userId || req.user?.id;

    if (!title || !description || !price) {
      return res
        .status(400)
        .json({ error: "title, description, price required" });
    }

    const listing = await listingsService.createListing({
      title,
      description,
      price,
      category,
      userId,
      images,
    });

    res.status(201).json(listing);
  } catch (err) {
    next(err);
  }
}

// 📌 Обновить объявление (полное редактирование)
export async function updateListing(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.userId || req.user?.id;
    const { title, description, price, category, images } = req.body;

    const updated = await listingsService.updateListing(id, userId, {
      title,
      description,
      price,
      category,
      images,
    });

    if (!updated) {
      return res
        .status(404)
        .json({ error: "Listing not found or not owned by user" });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
}

// 📌 Обновить статус объявления (active <-> inactive)
export async function updateStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.userId || req.user?.id;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updated = await listingsService.updateStatus(id, userId, status);

    if (!updated) {
      return res
        .status(404)
        .json({ error: "Listing not found or not owned by user" });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
}
