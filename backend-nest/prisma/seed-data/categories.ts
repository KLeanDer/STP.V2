export interface SeedCategoryGroup {
  slug: string;
  name: string;
  description?: string;
  sub?: { slug: string; name: string; description?: string }[];
}

export interface SeedCategory {
  slug: string;
  name: string;
  description?: string;
  groups: SeedCategoryGroup[];
}

export const categoriesSeed: SeedCategory[] = [
  {
    slug: 'electronics',
    name: 'Електроніка',
    description: 'Техніка, гаджети та аксесуари для щоденного користування.',
    groups: [
      {
        slug: 'phones',
        name: 'Телефони та планшети',
        sub: [
          { slug: 'iphone', name: 'iPhone' },
          { slug: 'samsung', name: 'Samsung' },
          { slug: 'xiaomi', name: 'Xiaomi' },
          { slug: 'other', name: 'Інші телефони' },
          { slug: 'tablets', name: 'Планшети' },
          { slug: 'accessories', name: 'Аксесуари' },
          { slug: 'cases', name: 'Чохли та захист' },
        ],
      },
      {
        slug: 'computers',
        name: 'Комп’ютери та ноутбуки',
        sub: [
          { slug: 'laptops', name: 'Ноутбуки' },
          { slug: 'pcs', name: 'Стаціонарні ПК' },
          { slug: 'components', name: 'Комплектуючі' },
          { slug: 'monitors', name: 'Монітори' },
          { slug: 'peripherals', name: 'Периферія' },
        ],
      },
      {
        slug: 'tv-audio',
        name: 'Телевізори та аудіо',
        sub: [
          { slug: 'tv', name: 'Телевізори' },
          { slug: 'speakers', name: 'Колонки' },
          { slug: 'headphones', name: 'Навушники' },
          { slug: 'microphones', name: 'Мікрофони' },
          { slug: 'smart-home', name: 'Розумний дім' },
        ],
      },
      {
        slug: 'gaming',
        name: 'Ігри та приставки',
        sub: [
          { slug: 'playstation', name: 'PlayStation' },
          { slug: 'xbox', name: 'Xbox' },
          { slug: 'nintendo', name: 'Nintendo' },
          { slug: 'pc-games', name: 'PC-ігри' },
          { slug: 'gaming-accessories', name: 'Аксесуари для геймерів' },
        ],
      },
    ],
  },
  {
    slug: 'auto',
    name: 'Авто',
    description: 'Легкові та комерційні авто, мотоцикли, запчастини та сервіси.',
    groups: [
      {
        slug: 'cars',
        name: 'Легкові авто',
        sub: [
          { slug: 'electric', name: 'Електромобілі' },
          { slug: 'gasoline', name: 'Бензинові' },
          { slug: 'diesel', name: 'Дизельні' },
          { slug: 'hybrid', name: 'Гібриди' },
        ],
      },
      { slug: 'moto', name: 'Мотоцикли' },
      { slug: 'trucks', name: 'Вантажівки' },
      { slug: 'special', name: 'Спецтехніка' },
      { slug: 'parts', name: 'Запчастини' },
      { slug: 'tires', name: 'Шини та диски' },
      { slug: 'services', name: 'Послуги автосервісу' },
    ],
  },
  {
    slug: 'real-estate',
    name: 'Нерухомість',
    description: 'Квартири, будинки, оренда та комерційні приміщення.',
    groups: [
      { slug: 'apartments', name: 'Квартири' },
      { slug: 'houses', name: 'Будинки' },
      { slug: 'land', name: 'Ділянки' },
      { slug: 'commercial', name: 'Комерційна нерухомість' },
      { slug: 'rent', name: 'Оренда' },
      { slug: 'garage', name: 'Гаражі та паркінг' },
    ],
  },
  {
    slug: 'fashion',
    name: 'Мода',
    description: 'Одяг, взуття та аксесуари для жінок, чоловіків і дітей.',
    groups: [
      {
        slug: 'men',
        name: 'Чоловічий одяг',
        sub: [
          { slug: 'jackets', name: 'Куртки' },
          { slug: 'pants', name: 'Штани' },
          { slug: 'tshirts', name: 'Футболки' },
          { slug: 'shoes', name: 'Взуття' },
          { slug: 'accessories', name: 'Аксесуари' },
        ],
      },
      {
        slug: 'women',
        name: 'Жіночий одяг',
        sub: [
          { slug: 'dresses', name: 'Сукні' },
          { slug: 'skirts', name: 'Спідниці' },
          { slug: 'tops', name: 'Топи' },
          { slug: 'shoes', name: 'Взуття' },
          { slug: 'bags', name: 'Сумки' },
        ],
      },
      {
        slug: 'children',
        name: 'Дитячий одяг',
        sub: [
          { slug: 'girls', name: 'Для дівчат' },
          { slug: 'boys', name: 'Для хлопців' },
          { slug: 'shoes', name: 'Дитяче взуття' },
        ],
      },
      { slug: 'jewelry', name: 'Прикраси' },
      { slug: 'watches', name: 'Годинники' },
    ],
  },
  {
    slug: 'kids',
    name: 'Діти',
    description: 'Все для дитячого розвитку, ігор та догляду.',
    groups: [
      { slug: 'toys', name: 'Іграшки' },
      { slug: 'strollers', name: 'Візки' },
      { slug: 'furniture', name: 'Дитячі меблі' },
      { slug: 'clothes', name: 'Одяг' },
      { slug: 'education', name: 'Освіта та розвиток' },
    ],
  },
  {
    slug: 'sports',
    name: 'Спорт',
    description: 'Тренажери, велосипеди, інвентар та все для активного відпочинку.',
    groups: [
      { slug: 'equipment', name: 'Спортивне обладнання' },
      { slug: 'bikes', name: 'Велосипеди' },
      { slug: 'gym', name: 'Тренажери' },
      { slug: 'tourism', name: 'Туризм та кемпінг' },
      { slug: 'team', name: 'Командні види спорту' },
    ],
  },
  {
    slug: 'jobs',
    name: 'Робота',
    description: 'Вакансії у різних сферах та рівнях досвіду.',
    groups: [
      { slug: 'it', name: 'IT та технології' },
      { slug: 'construction', name: 'Будівництво' },
      { slug: 'transport', name: 'Логістика та транспорт' },
      { slug: 'education', name: 'Освіта' },
      { slug: 'medicine', name: 'Медицина' },
      { slug: 'service', name: 'Обслуговування' },
    ],
  },
  {
    slug: 'home',
    name: 'Дім',
    description: 'Меблі, техніка та товари для дому.',
    groups: [
      { slug: 'furniture', name: 'Меблі' },
      { slug: 'appliances', name: 'Побутова техніка' },
      { slug: 'tools', name: 'Інструменти' },
      { slug: 'decor', name: 'Декор' },
      { slug: 'kitchen', name: 'Кухонне приладдя' },
    ],
  },
  {
    slug: 'services',
    name: 'Послуги',
    description: 'Побутові, освітні, логістичні та цифрові послуги.',
    groups: [
      { slug: 'repair', name: 'Ремонт' },
      { slug: 'transport', name: 'Перевезення' },
      { slug: 'education', name: 'Курси та навчання' },
      { slug: 'it-services', name: 'IT-послуги' },
      { slug: 'beauty', name: 'Краса та здоров’я' },
      { slug: 'photo-video', name: 'Фото та відео' },
    ],
  },
  {
    slug: 'trends',
    name: 'Тренди',
    description: 'Актуальні напрямки: еко, hand-made, технології.',
    groups: [
      { slug: 'eco', name: 'Еко-товари' },
      { slug: 'handmade', name: 'Hand-made' },
      { slug: 'crypto', name: 'Криптотовари' },
      { slug: 'ai', name: 'AI-гаджети' },
      { slug: 'collectibles', name: 'Колекційні речі' },
    ],
  },
];
