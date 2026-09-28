/**
 * NEXO ENERGY — multilingual content system
 * All website copy lives here in three languages: uz / ru / en.
 * To edit any text, simply change the values below.
 */

export type Lang = "uz" | "ru" | "en";

export const LANGS: { code: Lang; label: string }[] = [
  { code: "uz", label: "UZ" },
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
];

/* ------------------------------------------------------------------ */
/* Flavor catalog                                                      */
/* ------------------------------------------------------------------ */

export interface FlavorText {
  tag: string;
  desc: string;
  notes: string[];
  benefits: string[];
  sugar: string;
}

export interface Flavor {
  id: string;
  name: string;
  css: string;
  energy: number;
  caffeine: string;
  size: string;
  uz: FlavorText;
  ru: FlavorText;
  en: FlavorText;
}

export const FLAVORS: Flavor[] = [
  {
    id: "litchi",
    name: "DOUBLE LITCHI",
    css: "#ff3d8e",
    energy: 78,
    caffeine: "80 mg",
    size: "330 ml",
    uz: {
      tag: "Tropik litchi",
      desc: "Tropik litchi ta’mi bilan kuchli va tetiklantiruvchi ichimlik.",
      notes: ["Litchi", "Tropik nafislik", "Gul ta’mi"],
      benefits: ["Tezkor tetiklik", "Yumshoq ta’m", "Faol kun uchun quvvat"],
      sugar: "Kam shakar",
    },
    ru: {
      tag: "Тропический личи",
      desc: "Яркий и освежающий напиток с насыщенным вкусом личи.",
      notes: ["Личи", "Тропическая нежность", "Цветочная нота"],
      benefits: ["Мгновенная бодрость", "Мягкий вкус", "Энергия для активного дня"],
      sugar: "Меньше сахара",
    },
    en: {
      tag: "Tropical Lychee",
      desc: "A bold and refreshing drink with a rich tropical lychee flavor.",
      notes: ["Lychee", "Tropical finesse", "Floral note"],
      benefits: ["Instant refresh", "Smooth taste", "Energy for an active day"],
      sugar: "Less sugar",
    },
  },
  {
    id: "citrus",
    name: "CITRUS RUSH",
    css: "#ffa225",
    energy: 92,
    caffeine: "160 mg",
    size: "330 ml",
    uz: {
      tag: "Sitrus portlashi",
      desc: "Apelsin va limonning shiddatli uyg‘unligi bilan maksimal quvvat.",
      notes: ["Apelsin", "Limon", "Shiddatli tetiklik"],
      benefits: ["Maksimal kofein", "Sport uchun ideal", "Tiniq fokus"],
      sugar: "Tarkibida qand mavjud",
    },
    ru: {
      tag: "Цитрусовый взрыв",
      desc: "Максимальная энергия со взрывным сочетанием апельсина и лимона.",
      notes: ["Апельсин", "Лимон", "Быстрая бодрость"],
      benefits: ["Максимум кофеина", "Идеально для спорта", "Ясный фокус"],
      sugar: "С сахаром",
    },
    en: {
      tag: "Citrus Explosion",
      desc: "Maximum energy from a bursting blend of orange and lemon.",
      notes: ["Orange", "Lemon", "Rush energy"],
      benefits: ["Maximum caffeine", "Built for sport", "Sharp focus"],
      sugar: "With sugar",
    },
  },
  {
    id: "berry",
    name: "BERRY SHOCK",
    css: "#7c4dff",
    energy: 85,
    caffeine: "120 mg",
    size: "330 ml",
    uz: {
      tag: "Rezavor shok",
      desc: "O‘rmon mevalarining yangi to‘lqini bilan kutilmagan tetiklik.",
      notes: ["O‘rmon mevalari", "Rezavor nafislik", "Shirin-yorqin ta’m"],
      benefits: ["Muvozanatli quvvat", "Uzoq tetiklik", "Shahar ritmi uchun"],
      sugar: "Kam shakar",
    },
    ru: {
      tag: "Ягодный шок",
      desc: "Неожиданная свежесть с волной лесных ягод.",
      notes: ["Лесные ягоды", "Ягодная нежность", "Сладкий яркий вкус"],
      benefits: ["Сбалансированная энергия", "Долгая бодрость", "Для ритма города"],
      sugar: "Меньше сахара",
    },
    en: {
      tag: "Berry Shock",
      desc: "An unexpected rush of freshness with a wave of wild berries.",
      notes: ["Wild berries", "Berry delicacy", "Sweet-bright taste"],
      benefits: ["Balanced energy", "Long-lasting boost", "For the city rhythm"],
      sugar: "Less sugar",
    },
  },
  {
    id: "grape",
    name: "DARK GRAPE",
    css: "#a855f7",
    energy: 70,
    caffeine: "80 mg",
    size: "330 ml",
    uz: {
      tag: "To‘q uzum",
      desc: "To‘q uzumning chuqur ta’mi va yumshoq quvvat uyg‘unligi.",
      notes: ["To‘q uzum", "Baxmal ta’m", "Chuqur nafislik"],
      benefits: ["Yumshoq quvvat", "Kechki mashg‘ulotlar uchun", "Sifatli dam olish"],
      sugar: "Kam shakar",
    },
    ru: {
      tag: "Тёмный виноград",
      desc: "Глубокий вкус тёмного винограда с мягкой энергией.",
      notes: ["Тёмный виноград", "Бархатный вкус", "Глубокая утончённость"],
      benefits: ["Мягкая энергия", "Для вечерних тренировок", "Качественный отдых"],
      sugar: "Меньше сахара",
    },
    en: {
      tag: "Dark Grape",
      desc: "A deep dark grape taste balanced with smooth energy.",
      notes: ["Dark grape", "Velvet taste", "Deep elegance"],
      benefits: ["Smooth energy", "Evening sessions", "Quality recovery"],
      sugar: "Less sugar",
    },
  },
  {
    id: "lime",
    name: "ICE LIME",
    css: "#b6f02c",
    energy: 74,
    caffeine: "80 mg",
    size: "330 ml",
    uz: {
      tag: "Muzdek laym",
      desc: "Muzdek laym ta’mi bilan sovuqdek tetiklantiruvchi ichimlik.",
      notes: ["Laym", "Muzdek yalpiz", "Sovuq tetiklik"],
      benefits: ["Yoz issiqda ideal", "Sovuq tetiklik", "Tiniqlik hissi"],
      sugar: "Kam shakar",
    },
    ru: {
      tag: "Ледяной лайм",
      desc: "Ледяная свежесть с освежающим вкусом лайма.",
      notes: ["Лайм", "Ледяная мята", "Холодная свежесть"],
      benefits: ["Идеально в жару", "Ледяная бодрость", "Ощущение чистоты"],
      sugar: "Меньше сахара",
    },
    en: {
      tag: "Ice Lime",
      desc: "Ice-cold refreshment with a crisp lime kick.",
      notes: ["Lime", "Iced mint", "Cold crisp"],
      benefits: ["Perfect for hot days", "Icy refresh", "Feeling of clarity"],
      sugar: "Less sugar",
    },
  },
];

/* ------------------------------------------------------------------ */
/* UI copy                                                             */
/* ------------------------------------------------------------------ */

const en = {
  nav: {
    home: "Home",
    products: "Products",
    flavors: "Flavors",
    about: "About",
    contact: "Contact",
    cta: "Explore Now",
  },
  hero: {
    brand: "NEXO ENERGY",
    kicker: "Premium Energy Drink",
    title: "A New Level of Taste and Energy",
    sub: "NEXO ENERGY is a premium lineup crafted for taste, style and an active life. Scroll to enter the collection.",
    primary: "Explore Now",
    secondary: "View Flavors",
    scroll: "Scroll to explore",
  },
  catalog: {
    kicker: "The Collection",
    title: "Our Flavors",
    sub: "Every flavor is a different energy. Journey through the collection and find yours.",
    hint: "Select a can — it will come to you",
  },
  details: {
    kicker: "Featured Product",
    title: "Product Features",
    notes: "Flavor Notes",
    benefits: "Benefits",
    energy: "Energy Level",
    size: "Volume",
    caffeine: "Caffeine",
    sugar: "Sugar",
    cta: "Try This Flavor",
    next: "Switch Flavor",
  },
  story: {
    kicker: "NEXO ENERGY",
    title: "Why Choose Us?",
    sub: "Premium taste, modern design, and energy for an active lifestyle.",
    features: [
      { t: "Premium Taste", d: "Five distinct flavor profiles, crafted with real juice extracts and a silky carbonation." },
      { t: "Modern Design", d: "A bold can design born for the city — minimal, futuristic, instantly iconic." },
      { t: "Active Energy", d: "Clean caffeine, vitamins and zero compromise. Built for work, sport and night." },
    ],
    stats: [
      { value: "5", label: "Flavors" },
      { value: "100%", label: "Energy" },
      { value: "80+", label: "Caffeine, mg" },
    ],
  },
  cta: {
    kicker: "Final Call",
    title: "Find Your Flavor",
    sub: "NEXO ENERGY — city-grade energy. Pick your can and take the level up.",
    primary: "Explore Now",
    secondary: "Contact Us",
  },
  footer: {
    tagline: "Premium canned energy for the city. Taste the future.",
    rights: "© 2026 NEXO ENERGY. All rights reserved.",
    nav: "Menu",
    follow: "Follow Us",
  },
  loader: { label: "Loading Experience" },
  fallback: {
    title: "A New Level of Taste and Energy",
    sub: "Your device does not support WebGL — here is the NEXO ENERGY lineup in static mode. Open this page on a modern browser for the full 3D experience.",
    flavors: "Our Flavors",
  },
};

export type LocaleContent = typeof en;

const uz: LocaleContent = {
  nav: {
    home: "Bosh sahifa",
    products: "Mahsulotlar",
    flavors: "Ta’mlar",
    about: "Biz haqimizda",
    contact: "Aloqa",
    cta: "Hozir ko‘rish",
  },
  hero: {
    brand: "NEXO ENERGY",
    kicker: "Premium energiya ichimligi",
    title: "Lazzat va quvvatning yangi darajasi",
    sub: "NEXO ENERGY — lazzat, uslub va faol hayot uchun yaratilgan premium ichimliklar to‘plami. To‘plamga kirish uchun pastga suring.",
    primary: "Hozir ko‘rish",
    secondary: "Ta’mlarni ko‘rish",
    scroll: "Scroll — tajribani boshlang",
  },
  catalog: {
    kicker: "To‘plam",
    title: "Bizning ta’mlarimiz",
    sub: "Har bir ta’m — alohida quvvat. To‘plam bo‘ylab sayohat qiling va o‘z ta’mingizni toping.",
    hint: "Bankani tanlang — u siz tomon keladi",
  },
  details: {
    kicker: "Tanlangan mahsulot",
    title: "Mahsulot xususiyatlari",
    notes: "Ta’m notalari",
    benefits: "Afzalliklar",
    energy: "Quvvat darajasi",
    size: "Hajmi",
    caffeine: "Kofein",
    sugar: "Shakar",
    cta: "Bu ta’mni sinash",
    next: "Ta’mni almashtirish",
  },
  story: {
    kicker: "NEXO ENERGY",
    title: "Nima uchun aynan biz?",
    sub: "Premium ta’m, zamonaviy dizayn va faol hayot uchun quvvat.",
    features: [
      { t: "Premium ta’m", d: "Haqiqiy sharbat ekstraktlari va ipakdek gazlanish bilan beshta alohida ta’m profili." },
      { t: "Zamonaviy dizayn", d: "Shahar uchun yaratilgan jasur banka dizayni — minimal, futuristik, darhol taniqli." },
      { t: "Faol quvvat", d: "Sof kofein, vitaminlar va murosasiz sifat. Ish, sport va tun uchun." },
    ],
    stats: [
      { value: "5", label: "Ta’mlar" },
      { value: "100%", label: "Quvvat" },
      { value: "80+", label: "Kofein, mg" },
    ],
  },
  cta: {
    kicker: "So‘nggi sahna",
    title: "O‘zingizga mos ta’mni tanlang",
    sub: "NEXO ENERGY — shahar uslubidagi quvvat. O‘z bankangizni tanlang va darajani ko‘taring.",
    primary: "Hozir ko‘rish",
    secondary: "Biz bilan bog‘lanish",
  },
  footer: {
    tagline: "Shahar uchun premium bankali energiya. Kelajak ta’mini his qiling.",
    rights: "© 2026 NEXO ENERGY. Barcha huquqlar himoyalangan.",
    nav: "Menyu",
    follow: "Bizga qo‘shiling",
  },
  loader: { label: "Tajriba yuklanmoqda" },
  fallback: {
    title: "Lazzat va quvvatning yangi darajasi",
    sub: "Qurilmangiz WebGL’ni qo‘llab-quvvatlamaydi — NEXO ENERGY to‘plami statik rejimda. To‘liq 3D tajriba uchun sahifani zamonaviy brauzerda oching.",
    flavors: "Bizning ta’mlarimiz",
  },
};

const ru: LocaleContent = {
  nav: {
    home: "Главная",
    products: "Продукты",
    flavors: "Вкусы",
    about: "О нас",
    contact: "Контакты",
    cta: "Смотреть сейчас",
  },
  hero: {
    brand: "NEXO ENERGY",
    kicker: "Премиальный энергетический напиток",
    title: "Новый уровень вкуса и энергии",
    sub: "NEXO ENERGY — премиальные напитки, созданные для вкуса, стиля и активной жизни. Листайте вниз, чтобы войти в коллекцию.",
    primary: "Смотреть сейчас",
    secondary: "Смотреть вкусы",
    scroll: "Листайте — начните опыт",
  },
  catalog: {
    kicker: "Коллекция",
    title: "Наши вкусы",
    sub: "Каждый вкус — это своя энергия. Путешествуйте по коллекции и найдите свой.",
    hint: "Выберите банку — она подойдёт к вам",
  },
  details: {
    kicker: "Избранный продукт",
    title: "Особенности продукта",
    notes: "Вкусовые ноты",
    benefits: "Преимущества",
    energy: "Уровень энергии",
    size: "Объём",
    caffeine: "Кофеин",
    sugar: "Сахар",
    cta: "Попробовать этот вкус",
    next: "Сменить вкус",
  },
  story: {
    kicker: "NEXO ENERGY",
    title: "Почему именно мы?",
    sub: "Премиальный вкус, современный дизайн и энергия для активной жизни.",
    features: [
      { t: "Премиальный вкус", d: "Пять уникальных вкусовых профилей с настоящими фруктовыми экстрактами и шелковистой газацией." },
      { t: "Современный дизайн", d: "Смелый дизайн банки, созданный для города — минималистичный, футуристичный, мгновенно узнаваемый." },
      { t: "Активная энергия", d: "Чистый кофеин, витамины и никаких компромиссов. Для работы, спорта и ночи." },
    ],
    stats: [
      { value: "5", label: "Вкусов" },
      { value: "100%", label: "Энергии" },
      { value: "80+", label: "Кофеина, мг" },
    ],
  },
  cta: {
    kicker: "Финальная сцена",
    title: "Выберите свой вкус",
    sub: "NEXO ENERGY — энергия в городском стиле. Выберите свою банку и поднимите уровень.",
    primary: "Смотреть сейчас",
    secondary: "Связаться с нами",
  },
  footer: {
    tagline: "Премиальная баночная энергия для города. Попробуйте будущее на вкус.",
    rights: "© 2026 NEXO ENERGY. Все права защищены.",
    nav: "Меню",
    follow: "Подписывайтесь",
  },
  loader: { label: "Загрузка" },
  fallback: {
    title: "Новый уровень вкуса и энергии",
    sub: "Ваше устройство не поддерживает WebGL — коллекция NEXO ENERGY в статическом режиме. Откройте страницу в современном браузере для полного 3D-опыта.",
    flavors: "Наши вкусы",
  },
};

export const translations: Record<Lang, LocaleContent> = { uz, ru, en };
