import {
  FileText,
  Tag,
  List,
  MapPin,
  BadgeCheck,
  PackageCheck,
  Image as ImageIcon,
} from "lucide-react";
import { useEffect } from "react";
import ImageUploader from "./ImageUploader";
import ContactFields from "./ContactFields";

export default function FormSection({ form, setForm, handleChange, errors }) {
  // 🌍 Автоматичне визначення міста по IP
  useEffect(() => {
    if (form.city) return; // не перезаписуємо, якщо користувач уже ввів
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data?.city) setForm((prev) => ({ ...prev, city: data.city }));
      })
      .catch(() => {});
  }, []);

  return (
    <>
      {/* === Фото === */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
          <ImageIcon size={18} /> Фото товару
        </label>
        <ImageUploader form={form} setForm={setForm} />
      </div>

      {/* === Заголовок === */}
      <div>
        <label className="flex items-center gap-2 font-medium text-neutral-700 mb-2 mt-6">
          <Tag size={18} /> Заголовок
        </label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Наприклад: iPhone 12 у гарному стані"
          className={`w-full border rounded-lg px-4 py-2 focus:ring-2 outline-none transition-all ${
            errors.title
              ? "border-red-600 focus:ring-red-200"
              : "border-neutral-300 focus:ring-blue-200"
          }`}
        />
        {errors.title && (
          <p className="text-red-600 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      {/* === Ціна === */}
      <div>
        <label className="flex items-center gap-2 font-medium text-neutral-700 mb-2 mt-4">
          💵 Ціна
        </label>
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="5000"
          className={`w-full border rounded-lg px-4 py-2 focus:ring-2 outline-none transition-all ${
            errors.price
              ? "border-red-600 focus:ring-red-200"
              : "border-neutral-300 focus:ring-blue-200"
          }`}
        />
        {errors.price && (
          <p className="text-red-600 text-sm mt-1">{errors.price}</p>
        )}
      </div>

      {/* === Категорія === */}
      <div>
        <label className="flex items-center gap-2 font-medium text-neutral-700 mb-2 mt-4">
          <List size={18} /> Категорія
        </label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className={`w-full border rounded-lg px-4 py-2 focus:ring-2 outline-none transition-all ${
            errors.category
              ? "border-red-600 focus:ring-red-200"
              : "border-neutral-300 focus:ring-blue-200"
          }`}
        >
          <option value="">Оберіть категорію</option>
          <option value="ELECTRONICS">Електроніка</option>
          <option value="CLOTHES">Одяг</option>
          <option value="AUTO">Авто</option>
          <option value="OTHER">Інше</option>
        </select>
        {errors.category && (
          <p className="text-red-600 text-sm mt-1">{errors.category}</p>
        )}
      </div>

      {/* === Місто === */}
      <div>
        <label className="flex items-center gap-2 font-medium text-neutral-700 mb-2 mt-4">
          <MapPin size={18} /> Місто / Регіон
        </label>
        <input
          type="text"
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="Наприклад: Київ"
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 outline-none border-neutral-300 focus:ring-blue-200"
        />
      </div>

      {/* === Стан товару === */}
      <div>
        <label className="flex items-center gap-2 font-medium text-neutral-700 mb-2 mt-4">
          <BadgeCheck size={18} /> Стан товару
        </label>
        <select
          name="condition"
          value={form.condition}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 outline-none border-neutral-300 focus:ring-blue-200"
        >
          <option value="new">Новий</option>
          <option value="used_like_new">Б/у як новий</option>
          <option value="used_minor">Б/у з незначними нюансами</option>
          <option value="used_with_issues">Б/у з нюансами</option>
        </select>
      </div>

      {/* === Оригінальність === */}
      <div>
        <label className="flex items-center gap-2 font-medium text-neutral-700 mb-2 mt-4">
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
              className="accent-blue-600"
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
              className="accent-blue-600"
            />
            <span className="text-sm text-neutral-800">Не оригінал</span>
          </label>
        </div>
      </div>

      {/* === Можлива доставка === */}
      <div className="mt-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.deliveryAvailable}
            onChange={() =>
              setForm({ ...form, deliveryAvailable: !form.deliveryAvailable })
            }
            className="w-4 h-4 accent-blue-600"
          />
          <span className="text-sm text-neutral-800">Можлива доставка</span>
        </label>
      </div>

      {/* === Опис === */}
      <div>
        <label className="flex items-center gap-2 font-medium text-neutral-700 mb-2 mt-6">
          <FileText size={18} /> Опис
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Опишіть товар детально..."
          rows={4}
          className={`w-full border rounded-lg px-4 py-2 focus:ring-2 outline-none transition-all ${
            errors.description
              ? "border-red-600 focus:ring-red-200"
              : "border-neutral-300 focus:ring-blue-200"
          }`}
        />
        {errors.description && (
          <p className="text-red-600 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      {/* === Контактні дані === */}
      <ContactFields form={form} handleChange={handleChange} setForm={setForm} />
    </>
  );
}
