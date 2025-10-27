import {
  FileText,
  Tag,
  List,
  MapPin,
  BadgeCheck,
  PackageCheck,
  Image as ImageIcon,
  Truck,
  Banknote,
} from "lucide-react";
import { useEffect } from "react";
import ImageUploader from "./ImageUploader";
import ContactFields from "./ContactFields";

export default function FormSection({
  form,
  setForm,
  handleChange,
  errors,
  categories = [],
  categoriesLoading = false,
  categoriesError = null,
}) {
  // 🌍 Автоматичне визначення міста по IP
  useEffect(() => {
    if (form.city) return;
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data?.city) setForm((prev) => ({ ...prev, city: data.city }));
      })
      .catch(() => {});
  }, [form.city, setForm]);

  const baseInput =
    "w-full border border-neutral-300 rounded-xl px-4 py-2.5 bg-white focus:ring-2 focus:ring-[var(--stp-ring)] focus:border-transparent outline-none transition-all";
  const errorInput =
    "w-full border border-rose-300 rounded-xl px-4 py-2.5 bg-white focus:ring-2 focus:ring-rose-200 outline-none transition-all";

  const gradient =
    "bg-gradient-to-r from-[#3b82f6] via-[#6366f1] to-[#8b5cf6]";

  // 🚚 Доставка за замовчуванням
  useEffect(() => {
    if (form.deliveryAvailable === undefined) {
      setForm((prev) => ({ ...prev, deliveryAvailable: true }));
    }
  }, [form.deliveryAvailable, setForm]);

  return (
    <div
      className="space-y-10"
      style={{
        "--stp-ring": "#6366f1",
      }}
    >
      {/* === Фото === */}
      <section className="p-6 rounded-2xl border border-neutral-200 bg-neutral-50/60 shadow-sm">
        <label className="block text-base font-semibold text-neutral-800 mb-3 flex items-center gap-2">
          <ImageIcon size={20} /> Фото товару
        </label>
        <ImageUploader form={form} setForm={setForm} />
      </section>

      {/* === Основна інформація === */}
      <section className="space-y-6">
        {/* Заголовок (до 80 символів) */}
        <div>
          <label className="flex items-center gap-2 font-medium text-neutral-800 mb-2">
            <Tag size={18} /> Заголовок
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            maxLength={80}
            placeholder="Наприклад: iPhone 12 у гарному стані"
            className={errors.title ? errorInput : baseInput}
          />
          <div className="flex justify-between text-[12px] text-neutral-500 mt-1">
            <span>Максимум 80 символів</span>
            <span>{form.title.length}/80</span>
          </div>
          {errors.title && (
            <p className="text-rose-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Ціна, Категорія, Місто */}
        <div className="grid sm:grid-cols-3 gap-6">
          {/* Ціна */}
          <div>
            <label className="flex items-center gap-2 font-medium text-neutral-800 mb-2">
              <Banknote size={18} /> Ціна
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="5000"
              className={errors.price ? errorInput : baseInput}
            />
            {errors.price && (
              <p className="text-rose-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          {/* Категорія */}
          <div className="space-y-2">
            <div>
              <label className="flex items-center gap-2 font-medium text-neutral-800 mb-2">
                <List size={18} /> Категорія
              </label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    categoryId: e.target.value,
                    subcategoryId: "",
                  }))
                }
                className={errors.categoryId ? errorInput : baseInput}
                disabled={categoriesLoading}
              >
                <option value="">Оберіть категорію</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-rose-500 text-sm mt-1">{errors.categoryId}</p>
              )}
              {categoriesError && !categoriesLoading && (
                <p className="text-rose-500 text-sm mt-1">
                  Не вдалося завантажити категорії. Спробуйте пізніше.
                </p>
              )}
            </div>

            {form.categoryId && (
              <div>
                <label className="flex items-center gap-2 font-medium text-neutral-800 mb-2">
                  <List size={18} /> Підкатегорія
                </label>
                <select
                  name="subcategoryId"
                  value={form.subcategoryId}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      subcategoryId: e.target.value,
                    }))
                  }
                  className={baseInput}
                  disabled={categoriesLoading}
                >
                  <option value="">Усі підкатегорії</option>
                  {categories
                    .find((category) => category.id === form.categoryId)
                    ?.subcategories?.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>

          {/* Місто */}
          <div>
            <label className="flex items-center gap-2 font-medium text-neutral-800 mb-2">
              <MapPin size={18} /> Місто / Регіон
            </label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Наприклад: Київ"
              className={baseInput}
            />
          </div>
        </div>

        {/* Стан товару */}
        <div>
          <label className="flex items-center gap-2 font-medium text-neutral-800 mb-2">
            <BadgeCheck size={18} /> Стан товару
          </label>
          <select
            name="condition"
            value={form.condition}
            onChange={handleChange}
            className={baseInput}
          >
            <option value="new">Новий</option>
            <option value="used_like_new">Б/у як новий</option>
            <option value="used_minor">Б/у з незначними нюансами</option>
            <option value="used_with_issues">Б/у з нюансами</option>
          </select>
        </div>

        {/* Оригінальність + Доставка */}
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Оригінальність */}
          <div>
            <label className="flex items-center gap-2 font-medium text-neutral-800 mb-2">
              <PackageCheck size={18} /> Оригінальність
            </label>
            <div className="flex gap-6 mt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="isOriginal"
                  value="true"
                  checked={form.isOriginal === true}
                  onChange={() => setForm({ ...form, isOriginal: true })}
                  className="accent-[var(--stp-ring)]"
                />
                <span className="text-sm text-neutral-800">Оригінал</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="isOriginal"
                  value="false"
                  checked={form.isOriginal === false}
                  onChange={() => setForm({ ...form, isOriginal: false })}
                  className="accent-[var(--stp-ring)]"
                />
                <span className="text-sm text-neutral-800">Репліка</span>
              </label>
            </div>
          </div>

          {/* Доставка */}
          <div>
            <label className="flex items-center gap-2 font-medium text-neutral-800 mb-2">
              <Truck size={18} /> Можливість доставки
            </label>
            <div className="flex items-center mt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.deliveryAvailable}
                  onChange={() =>
                    setForm({
                      ...form,
                      deliveryAvailable: !form.deliveryAvailable,
                    })
                  }
                  className="w-4 h-4 accent-[var(--stp-ring)]"
                />
                <span className="text-sm text-neutral-800">Можлива доставка</span>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* === Опис === */}
      <section className="p-6 rounded-2xl border border-neutral-200 bg-neutral-50/60 shadow-sm">
        <label className="flex items-center gap-2 font-semibold text-neutral-800 mb-2">
          <FileText size={18} /> Опис
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Опишіть товар детально: стан, комплектація, деталі, гарантія тощо..."
          rows={6}
          maxLength={3000}
          className={errors.description ? errorInput : baseInput}
        />
        <div className="flex justify-between text-[12px] text-neutral-500 mt-1">
          <span>Максимум 3000 символів</span>
          <span>{form.description.length}/3000</span>
        </div>
        {errors.description && (
          <p className="text-rose-500 text-sm mt-1">{errors.description}</p>
        )}
      </section>

      {/* === Контактні дані === */}
      <section className="p-6 rounded-2xl border border-neutral-200 bg-neutral-50/60 shadow-sm">
        <ContactFields
          form={form}
          handleChange={handleChange}
          setForm={setForm}
        />
      </section>
    </div>
  );
}
