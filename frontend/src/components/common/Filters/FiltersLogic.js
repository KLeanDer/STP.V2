// базовые вспомогательные функции

export function applyFilters(listings, filters) {
  return listings.filter((item) => {
    if (filters.categoryId && item.category?.id !== filters.categoryId) return false;
    if (filters.subcategoryId && item.subcategory?.id !== filters.subcategoryId) return false;
    if (filters.city && item.city !== filters.city) return false;

    if (
      typeof filters.priceMin === "number" &&
      Number.isFinite(filters.priceMin) &&
      Number(item.price) < filters.priceMin
    )
      return false;

    if (
      typeof filters.priceMax === "number" &&
      Number.isFinite(filters.priceMax) &&
      Number(item.price) > filters.priceMax
    )
      return false;

    if (filters.deliveryAvailable && !item.deliveryAvailable) return false;

    return true;
  });
}

export function resetFilters() {
  return {
    categoryId: "",
    subcategoryId: "",
    priceMin: "",
    priceMax: "",
    city: "",
    deliveryAvailable: false,
  };
}
