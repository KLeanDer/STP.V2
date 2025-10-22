import { useState } from "react";
import { motion } from "framer-motion";
import FormSection from "./FormSection";
import { validateForm } from "./utils";
import BackgroundWrapper from "../../../components/layout/BackgroundWrapper";
import SocialLine from "../../../components/common/SocialLine";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function CreateListing() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    images: [], // теперь [{ file, preview }]
    contactName: "",
    contactPhone: "",
    city: "",
    condition: "new",
    isOriginal: true,
    deliveryAvailable: false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // === Отправка объявления ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);

    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Необхідно увійти в акаунт");

      // 🖼️ Загружаем фото перед созданием объявления
      const uploadedUrls = [];
      for (const img of form.images) {
        // Если фото уже URL (например, отредактированное объявление) — пропускаем
        if (typeof img === "string" && img.startsWith("http")) {
          uploadedUrls.push(img);
          continue;
        }

        // Если это локальный файл — загружаем
        const formData = new FormData();
        formData.append("image", img.file);

        const res = await fetch(`${API_BASE}/api/uploads`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        const data = await res.json();
        if (data?.url) uploadedUrls.push(data.url);
      }

      // === Готовим payload для создания объявления ===
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category: form.category,
        images: uploadedUrls, // уже ссылки
        contactName: form.contactName.trim() || null,
        contactPhone: form.contactPhone.trim() || null,
        city: form.city.trim() || null,
        condition: form.condition,
        isOriginal: form.isOriginal,
        deliveryAvailable: form.deliveryAvailable,
      };

      const res = await fetch(`${API_BASE}/api/listings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create listing");

      setSuccess("Оголошення успішно створене ✅");

      // Очистка формы
      setForm({
        title: "",
        description: "",
        price: "",
        category: "",
        images: [],
        contactName: "",
        contactPhone: "",
        city: "",
        condition: "new",
        isOriginal: true,
        deliveryAvailable: false,
      });
    } catch (err) {
      console.error(err);
      setSuccess("Помилка при створенні ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundWrapper>
      <div className="flex flex-col min-h-screen text-neutral-900 overflow-hidden relative">
        <SocialLine />

        <main className="flex-grow flex flex-col justify-center items-center pt-16 pb-24 px-4 sm:px-8">
          {/* === Заголовок === */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-10"
          >
            <h1 className="text-5xl font-extrabold tracking-tight mb-3 select-none flex justify-center gap-2 overflow-visible">
              <span
                className="inline-flex bg-gradient-to-b from-[#4a4a50] via-[#252933] to-[#111827]
                           text-transparent bg-clip-text overflow-visible min-w-fit pl-1 pr-[6px]"
              >
                STP
              </span>
              <span
                className="inline-flex bg-gradient-to-r from-[#3b82f6] via-[#6366f1] to-[#8b5cf6]
                           text-transparent bg-clip-text"
              >
                Marketplace
              </span>
            </h1>

            <p className="text-neutral-500 text-lg mt-2">
              Додайте своє оголошення — це безкоштовно і займає лише хвилину
            </p>
          </motion.div>

          {/* === Форма === */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-3xl bg-white/85 backdrop-blur-xl 
                       border border-neutral-200 rounded-2xl shadow-xl p-8 sm:p-10"
          >
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Створити оголошення
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              <FormSection
                form={form}
                setForm={setForm}
                handleChange={handleChange}
                errors={errors}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-medium text-white
                           bg-gradient-to-r from-[#3b82f6] via-[#6366f1] to-[#8b5cf6]
                           hover:from-[#2563eb] hover:via-[#4f46e5] hover:to-[#7c3aed]
                           transition-all duration-300 disabled:opacity-60 shadow-md"
              >
                {loading ? "Збереження..." : "Опублікувати оголошення"}
              </button>
            </form>

            {success && (
              <p className="mt-8 text-center font-medium text-neutral-700">
                {success}
              </p>
            )}
          </motion.div>
        </main>

        <footer className="text-center text-sm text-neutral-500 py-6">
          © 2025 STP — створено з довірою та стилем.
        </footer>
      </div>
    </BackgroundWrapper>
  );
}
