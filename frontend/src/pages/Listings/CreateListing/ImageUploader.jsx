import { useRef, useState } from "react";
import { Upload, X, Maximize2, Star } from "lucide-react";
import { motion } from "framer-motion";
import ImagePreviewModal from "./ImagePreviewModal";

export default function ImageUploader({ form, setForm }) {
  const [previewIndex, setPreviewIndex] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const MAX_IMAGES = 10;

  // === Добавление файлов в локальный стейт ===
  const handleFiles = (files) => {
    setError(null);

    const currentCount = form.images.length;
    const availableSlots = MAX_IMAGES - currentCount;

    if (files.length > availableSlots) {
      setError(`Максимум ${MAX_IMAGES} фото. Ви можете додати ще ${availableSlots}.`);
      files = files.slice(0, availableSlots);
    }

    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...previews],
    }));
  };

  const handleFileChange = (e) => handleFiles(Array.from(e.target.files));
  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(Array.from(e.dataTransfer.files));
  };

  // === Удалить фото ===
  const removeImage = (preview) => {
    setError(null);
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.preview !== preview),
    }));
  };

  // === Сделать главным ===
  const setMainImage = (preview) => {
    setForm((prev) => {
      const selected = prev.images.find((img) => img.preview === preview);
      const rest = prev.images.filter((img) => img.preview !== preview);
      return { ...prev, images: [selected, ...rest] };
    });
  };

  const mainImage = form.images[0];
  const otherImages = form.images.slice(1);

  return (
    <div className="space-y-4">
      {/* === Ошибка === */}
      {error && (
        <p className="text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded-lg p-2 text-center">
          {error}
        </p>
      )}

      {/* === Если фото нет === */}
      {form.images.length === 0 && (
        <motion.div
          onClick={() => fileInputRef.current.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed rounded-2xl p-10 sm:p-14 cursor-pointer
                     flex flex-col items-center justify-center text-center
                     border-neutral-400 hover:border-neutral-700 hover:bg-neutral-100/40"
          whileHover={{ scale: 1.02 }}
        >
          <Upload className="w-12 h-12 text-neutral-700 mb-4" />
          <p className="text-neutral-700 font-medium text-lg">
            Перетягніть фото сюди або{" "}
            <span className="underline decoration-neutral-500">додайте файл</span>
          </p>
          <p className="text-neutral-500 text-sm mt-2">PNG, JPG, до 10 MB за файл</p>

          <input
            type="file"
            multiple
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </motion.div>
      )}

      {/* === Если фото есть === */}
      {form.images.length > 0 && (
        <>
          {/* Главное фото */}
          <motion.div
            className="relative w-full aspect-[4/3] sm:aspect-[3/2] rounded-2xl overflow-hidden border border-neutral-300 bg-neutral-100"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <img
              src={mainImage.preview}
              alt="main"
              className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition"
              onClick={() => setPreviewIndex(0)}
            />
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
              <Star size={12} className="text-yellow-400" />
              Головне фото
            </div>
            <button
              onClick={() => removeImage(mainImage.preview)}
              className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={() => setPreviewIndex(0)}
              className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </motion.div>

          {/* Остальные фото + кнопка добавления */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
            {otherImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group rounded-xl overflow-hidden border border-neutral-300 bg-neutral-50"
              >
                {/* Само фото */}
                <img
                  src={img.preview}
                  alt={`uploaded-${i}`}
                  className="w-full h-28 object-cover rounded-xl transition-transform duration-300 cursor-pointer group-hover:scale-[1.03]"
                  onClick={() => setPreviewIndex(i + 1)} // 👈 при клике открывается просмотр
                />

                {/* Кнопка "зробити головним" */}
                <button
                  onClick={() => setMainImage(img.preview)}
                  className="absolute bottom-1 left-1 text-xs bg-black/60 hover:bg-black/80 text-white px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition"
                >
                  Зробити головним
                </button>

                {/* Кнопка удаления */}
                <button
                  onClick={() => removeImage(img.preview)}
                  className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Кнопка увеличения */}
                <button
                  onClick={() => setPreviewIndex(i + 1)}
                  className="absolute bottom-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}

            {/* Добавить фото */}
            {form.images.length < MAX_IMAGES && (
              <motion.div
                onClick={() => fileInputRef.current.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed rounded-xl p-6 cursor-pointer 
                           flex flex-col items-center justify-center text-center 
                           border-neutral-400 hover:border-neutral-700 hover:bg-neutral-100/40"
                whileHover={{ scale: 1.03 }}
              >
                <Upload className="w-8 h-8 text-neutral-700 mb-2" />
                <p className="text-neutral-700 text-sm font-medium">Додати</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </motion.div>
            )}
          </div>
        </>
      )}

      {/* === Просмотр фото === */}
      {previewIndex !== null && (
        <ImagePreviewModal
          images={form.images.map((img) => img.preview)}
          index={previewIndex}
          setIndex={setPreviewIndex}
          onClose={() => setPreviewIndex(null)}
        />
      )}
    </div>
  );
}
