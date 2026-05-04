export type Chapter = {
  number: string;       // e.g. "0", "0.1", "1", "15"
  title: string;        // Arabic title from the source
  views?: number;       // approximate views for nice subtitle
  age?: string;         // English relative age (e.g. "2 weeks ago")
  url: string;          // canonical URL on olympustaff.com
};

export const SERIES = {
  slug: 'reverend-insanity-master-of-gu',
  titleEn: 'Reverend Insanity (Master of Gu)',
  titleAr: 'سيد الغو',
  sourceUrl: 'https://olympustaff.com/series/reverend-insanity-master-of-gu',
  artist: 'استوديو كودكو',
  type: 'مانها صيني',
  status: 'مستمرة',
  synopsisAr:
    'البشر هم جوهر الحياة، بينما يُجسّد الغو جوهر السماء والأرض. عندما تُشوّه رؤية المرء للعالم وقيمه وفلسفته، لا يعود إنسانًا، بل شيطانًا يُبعث من جديد. هذه قصة مسافر عبر الزمن، يُولد من جديد بلا نهاية، يشق طريقه عبر عالمٍ تُشكّله القوة الغامضة للغو.',
  tags: ['أكشن', 'إثارة', 'بطل غير إعتيادي', 'خيال', 'دموي', 'غموض', 'عنف', 'سنين', 'نفسي', 'تراجيدي'],
};

const URL_BASE = `${SERIES.sourceUrl}`;

export const CHAPTERS: Chapter[] = [
  { number: '0',   title: 'إعلان النزول',                                          views: 44223, age: '7 months ago', url: `${URL_BASE}/0` },
  { number: '0.1', title: 'تصميم باي نينغ',                                         views: 39075, age: '7 months ago', url: `${URL_BASE}/0.1` },
  { number: '0.2', title: 'تصميم فانغ يوان بعد التناسخ',                               views: 32080, age: '7 months ago', url: `${URL_BASE}/0.2` },
  { number: '0.5', title: 'الإعلان التشويقي الرسمي',                                  views: 31599, age: '7 months ago', url: `${URL_BASE}/0.5` },
  { number: '1',   title: 'قلب الشيطان لم يندم أبدًا حتى في وجه الموت',                  views: 51742, age: '7 months ago', url: `${URL_BASE}/1` },
  { number: '2',   title: 'العودة بالزمن مع خبرة 500 عام من المعرفة',                   views: 44129, age: '7 months ago', url: `${URL_BASE}/2` },
  { number: '3',   title: 'تنحوا جانبًا واغربوا عن وجهي',                                views: 31738, age: '6 months ago', url: `${URL_BASE}/3` },
  { number: '4',   title: 'غو يوي فانغ يوان',                                         views: 27520, age: '6 months ago', url: `${URL_BASE}/4` },
  { number: '5',   title: 'الإنسان الأول والغو الثلاث، صحوة الآمال',                       views: 23968, age: '6 months ago', url: `${URL_BASE}/5` },
  { number: '6',   title: 'طريق المستقبل ينبئ بالإثارة',                                  views: 22113, age: '5 months ago', url: `${URL_BASE}/6` },
  { number: '7',   title: 'مكيدة التبنّي',                                              views: 18881, age: '4 months ago', url: `${URL_BASE}/7` },
  { number: '8',   title: 'شين تسوي',                                                 views: 20064, age: '4 months ago', url: `${URL_BASE}/8` },
  { number: '9',   title: 'في النُزل',                                                 views: 16513, age: '3 months ago', url: `${URL_BASE}/9` },
  { number: '10',  title: 'المحاولة الأخيرة',                                            views: 13846, age: '3 months ago', url: `${URL_BASE}/10` },
  { number: '11',  title: 'حقيقة الماضي',                                              views: 14535, age: '3 months ago', url: `${URL_BASE}/11` },
  { number: '12',  title: 'القرار',                                                    views: 12725, age: '2 months ago', url: `${URL_BASE}/12` },
  { number: '13',  title: 'صفقة',                                                     views: 15600, age: '2 months ago', url: `${URL_BASE}/13` },
  { number: '14',  title: 'استيقاظ',                                                  views: 11612, age: '1 month ago', url: `${URL_BASE}/14` },
  { number: '15',  title: 'المركز الأول',                                                views: 6888,  age: '2 weeks ago', url: `${URL_BASE}/15` },
];

export const getChapterIndex = (n: string) =>
  CHAPTERS.findIndex((c) => c.number === n);

export const getChapter = (n: string) =>
  CHAPTERS.find((c) => c.number === n);

export const getNeighbors = (n: string) => {
  const i = getChapterIndex(n);
  if (i < 0) return { prev: undefined, next: undefined };
  return {
    prev: i > 0 ? CHAPTERS[i - 1] : undefined,
    next: i < CHAPTERS.length - 1 ? CHAPTERS[i + 1] : undefined,
  };
};
