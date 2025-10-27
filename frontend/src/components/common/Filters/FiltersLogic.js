// базовые вспомогательные функции

export function applyFilters(listings, filters) {
  return listings.filter((item) => {
    if (filters.category && item.category !== filters.category) return false;
    if (filters.city && item.city !== filters.city) return false;
    if (
      filters.priceMin &&
      Number(item.price) < Number(filters.priceMin)
    )
      return false;
    if (
      filters.priceMax &&
      Number(item.price) > Number(filters.priceMax)
    )
      return false;
    if (filters.deliveryAvailable && !item.deliveryAvailable) return false;
    return true;
  });
}

export function resetFilters() {
  return {
    category: "",
    priceMin: "",
    priceMax: "",
    city: "",
    deliveryAvailable: false,
  };
}
