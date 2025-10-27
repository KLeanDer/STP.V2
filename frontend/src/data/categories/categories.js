// C:\STP.V2\frontend\src\data\categories.js

export const categories = [
  {
    id: "electronics",
    name: "Електроніка",
    sub: [
      {
        id: "phones",
        name: "Телефони та планшети",
        sub: [
          { id: "iphone", name: "iPhone" },
          { id: "samsung", name: "Samsung" },
          { id: "xiaomi", name: "Xiaomi" },
          { id: "other_phones", name: "Інші телефони" },
          { id: "tablets", name: "Планшети" },
          { id: "accessories", name: "Аксесуари" },
          { id: "cases", name: "Чохли та захист" },
        ],
      },
      {
        id: "computers",
        name: "Комп’ютери та ноутбуки",
        sub: [
          { id: "laptops", name: "Ноутбуки" },
          { id: "pcs", name: "ПК" },
          { id: "components", name: "Комплектуючі" },
          { id: "monitors", name: "Монітори" },
          { id: "peripherals", name: "Периферія" },
        ],
      },
      {
        id: "tv_audio",
        name: "Телевізори та аудіо",
        sub: [
          { id: "tv", name: "Телевізори" },
          { id: "speakers", name: "Колонки" },
          { id: "headphones", name: "Навушники" },
          { id: "microphones", name: "Мікрофони" },
          { id: "smart_home", name: "Розумний дім" },
        ],
      },
      {
        id: "gaming",
        name: "Ігри та приставки",
        sub: [
          { id: "ps", name: "PlayStation" },
          { id: "xbox", name: "Xbox" },
          { id: "nintendo", name: "Nintendo" },
          { id: "pc_games", name: "PC-ігри" },
          { id: "gaming_accessories", name: "Аксесуари для геймерів" },
        ],
      },
    ],
  },
  {
    id: "auto",
    name: "Авто",
    sub: [
      {
        id: "cars",
        name: "Легкові авто",
        sub: [
          { id: "electric", name: "Електромобілі" },
          { id: "gasoline", name: "Бензинові" },
          { id: "diesel", name: "Дизельні" },
          { id: "hybrid", name: "Гібриди" },
        ],
      },
      { id: "moto", name: "Мотоцикли" },
      { id: "trucks", name: "Вантажівки" },
      { id: "special", name: "Спецтехніка" },
      { id: "parts", name: "Запчастини" },
      { id: "tires", name: "Шини та диски" },
      { id: "services", name: "Послуги автосервісу" },
    ],
  },
  {
    id: "real_estate",
    name: "Нерухомість",
    sub: [
      { id: "apartments", name: "Квартири" },
      { id: "houses", name: "Будинки" },
      { id: "land", name: "Ділянки" },
      { id: "commercial", name: "Комерційна нерухомість" },
      { id: "rent", name: "Оренда" },
      { id: "garage", name: "Гаражі та паркінг" },
    ],
  },
  {
    id: "fashion",
    name: "Мода",
    sub: [
      {
        id: "men",
        name: "Чоловічий одяг",
        sub: [
          { id: "jackets", name: "Куртки" },
          { id: "pants", name: "Штани" },
          { id: "tshirts", name: "Футболки" },
          { id: "shoes", name: "Взуття" },
          { id: "accessories", name: "Аксесуари" },
        ],
      },
      {
        id: "women",
        name: "Жіночий одяг",
        sub: [
          { id: "dresses", name: "Сукні" },
          { id: "skirts", name: "Спідниці" },
          { id: "tops", name: "Топи" },
          { id: "shoes", name: "Взуття" },
          { id: "bags", name: "Сумки" },
        ],
      },
      {
        id: "children",
        name: "Дитячий одяг",
        sub: [
          { id: "girls", name: "Для дівчат" },
          { id: "boys", name: "Для хлопців" },
          { id: "shoes", name: "Взуття" },
        ],
      },
      { id: "jewelry", name: "Прикраси" },
      { id: "watches", name: "Годинники" },
    ],
  },
  {
    id: "kids",
    name: "Діти",
    sub: [
      { id: "toys", name: "Іграшки" },
      { id: "strollers", name: "Візки" },
      { id: "furniture", name: "Дитячі меблі" },
      { id: "clothes", name: "Одяг" },
      { id: "education", name: "Освіта та розвиток" },
    ],
  },
  {
    id: "sports",
    name: "Спорт",
    sub: [
      { id: "equipment", name: "Спортивне обладнання" },
      { id: "bikes", name: "Велосипеди" },
      { id: "gym", name: "Тренажери" },
      { id: "tourism", name: "Туризм та кемпінг" },
      { id: "team", name: "Командні види спорту" },
    ],
  },
  {
    id: "jobs",
    name: "Робота",
    sub: [
      { id: "it", name: "IT та технології" },
      { id: "construction", name: "Будівництво" },
      { id: "transport", name: "Логістика та транспорт" },
      { id: "education", name: "Освіта" },
      { id: "medicine", name: "Медицина" },
      { id: "service", name: "Обслуговування" },
    ],
  },
  {
    id: "home",
    name: "Дім",
    sub: [
      { id: "furniture", name: "Меблі" },
      { id: "appliances", name: "Побутова техніка" },
      { id: "tools", name: "Інструменти" },
      { id: "decor", name: "Декор" },
      { id: "kitchen", name: "Кухонне приладдя" },
    ],
  },
  {
    id: "services",
    name: "Послуги",
    sub: [
      { id: "repair", name: "Ремонт" },
      { id: "transport", name: "Перевезення" },
      { id: "education", name: "Курси та навчання" },
      { id: "it_services", name: "IT-послуги" },
      { id: "beauty", name: "Краса та здоров’я" },
      { id: "photo_video", name: "Фото та відео" },
    ],
  },
  {
    id: "trends",
    name: "Тренди",
    sub: [
      { id: "eco", name: "Еко-товари" },
      { id: "handmade", name: "Hand-made" },
      { id: "crypto", name: "Криптотовари" },
      { id: "ai", name: "AI-гаджети" },
      { id: "collectibles", name: "Колекційні речі" },
    ],
  },
];
