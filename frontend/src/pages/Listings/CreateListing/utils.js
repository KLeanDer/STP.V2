export function validateForm(form) {
  const errors = {};
  if (!form.title || form.title.length < 10)
    errors.title = "Мінімум 10 символів";
  if (!form.categoryId)
    errors.categoryId = "Оберіть категорію";
  if (!form.description || form.description.length < 30)
    errors.description = "Мінімум 30 символів";
  if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
    errors.price = "Вкажіть коректну ціну";
  return errors;
}
