// Thozhilnagaram chapter — update meeting fields when confirmed
export const CHAPTER_SLUG = 'YEF-thozhilnagaram'

// yef-AM previously stored this chapter without the "h" in thozhil.
const CHAPTER_SLUGS = new Set([CHAPTER_SLUG, 'YEF-thozilnagaram'])

export const belongsToChapter = (slug) => CHAPTER_SLUGS.has(slug)

export const chapters = [
  {
    slug:          CHAPTER_SLUG,
    name:          'YEF Thozhilnagaram',
    mode:          'In-Person',
    category_open: true,
    business:      'TBA',
    day:           'TBA',
    time:          'TBA',
    members:       0,
    venue:         'TBA',
    url:           'https://thozhilnagaram.yef-network.com',
  },
]
